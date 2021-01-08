import React, {Component} from 'react';
import SQLite from 'react-native-sqlite-storage';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
let check;
const checkNet = NetInfo.addEventListener((state) => {
  check = state.isConnected;
});
const _ = require('lodash');
let db;
class QuizService extends Component {
  baseURL = 'http://tgryl.pl/quiz';

  constructor() {
    super();
    db = SQLite.openDatabase({
      name: 'quiz.db',
      createFromLocation: 1,
    });

    this.state = {
      //tags: [],
      //tests: [],
      answers: [],
      questions: [],
    };
  }

  getTestsWithInternetChecking = async () => {
    let tests = [];
    if (
      await NetInfo.fetch().then((state) => {
        return state.isConnected;
      })
    ) {
      // QuizService.setState({
      //   tests: await this.getTests(),
      // });
      tests = await this.getTests();
      const dateFromStorage = await AsyncStorage.getItem('CurrentDate');
      if (
        dateFromStorage !==
        new Date().getDate().toString() +
          '-' +
          new Date().getMonth().toString() +
          '-' +
          new Date().getFullYear().toString()
      ) {
        console.log('Tests already in database for today');
      } else {
        await AsyncStorage.setItem(
          'CurrentDate',
          new Date().getDate().toString() +
            '-' +
            new Date().getMonth().toString() +
            '-' +
            new Date().getFullYear().toString(),
        );
        await this.success();
        //this.getTestsFromDatabase();
      }
    } else {
      tests = this.getTestsFromDatabase();
      console.log('lolll');
    }

    return tests;
  };

  getTestsFromDatabase() {
    const query1 = 'SELECT * FROM tags;';
    let table1 = [];
    let tags = [];
    let tests = [];

    db.transaction((tx) => {
      tx.executeSql(query1, [], (tx, results) => {
        let len = results.rows.length;
        if (len > 0) {
          for (let i = 0; i < results.rows.length; i++) {
            table1.push(results.rows.item(i));
          }
          tags = table1;
        }
      });
    });

    const query2 = 'SELECT * FROM tests;';
    let table = [];
    db.transaction((tx) => {
      tx.executeSql(query2, [], (tx, results) => {
        let len = results.rows.length;
        if (len > 0) {
          for (let i = 0; i < results.rows.length; i++) {
            table.push(results.rows.item(i));

            let idtag = table[i].id;

            table[i].tags = [];
            tags.forEach((item, z) => {
              if (item.test_id === idtag) {
                console.log(item.test_id);
                table[i].tags.push(item.tag);
              }
            });
            tests = table;
          }
          console.log(tests);
        }
      });
    });
    return tests;
  }

  async success() {
    const quiz = new QuizService();
    const testsDetails = await quiz.getAllDetailsTests();
    const newTests = await quiz.getTests();

    const query1 = 'DROP TABLE IF EXISTS  tests';
    const query2 =
      'CREATE TABLE IF NOT EXISTS tests (id TEXT NOT NULL, name TEXT NOT NULL, description TEXT NOT NULL, tags TEXT NOT NULL, level TEXT NOT NULL, numberOfTasks INTEGER NOT NULL);';
    await this.executeQuery(query1, []);
    await this.executeQuery(query2, []);
    await this.executeQuery('DROP table if exists tags', []);

    await this.executeQuery(
      'CREATE TABLE IF NOT EXISTS tags (tag TEXT NOT NULL, test_id TEXT NOT NULL);',
      [],
    );

    const queryQuestions = 'drop table if exists questions';
    const queryAnswers = 'drop table if exists answers';
    const queryQuestions1 =
      'CREATE TABLE "questions" ( "question" TEXT, "id" TEXT, "duration" INTEGER, PRIMARY KEY("question"));';
    const queryAnswers1 =
      'CREATE TABLE "answers" ( "content" TEXT, "question" TEXT, "isCorrect" TEXT, PRIMARY KEY("content","question"));';

    await this.executeQuery(queryQuestions, []);
    await this.executeQuery(queryQuestions1, []);
    await this.executeQuery(queryAnswers, []);
    await this.executeQuery(queryAnswers1, []);

    newTests.map((test) => {
      const query3 =
        'INSERT INTO tests VALUES("' +
        test.id +
        '" , "' +
        test.name +
        '" , "' +
        test.description +
        '" , "' +
        1 +
        '" , "' +
        test.level +
        '" ,' +
        test.numberOfTasks +
        ');';

      this.executeQuery(query3, []);

      test.tags.forEach((item, i) => {
        const query =
          'INSERT INTO tags VALUES( "' +
          test.tags[i] +
          '" , "' +
          test.id +
          '" );';
        this.executeQuery(query, []);
      });
    });

    testsDetails.map(async (test) => {
      test.tasks.forEach((item, i) => {
        this.executeQuery(
          'INSERT INTO questions VALUES( "' +
            item.question +
            '" , "' +
            test.id +
            '" , ' +
            item.duration +
            ' )',
          [],
        );
        //console.log(item.question)
        item.answers.forEach((item2, i2) => {
          this.executeQuery(
            'INSERT INTO answers VALUES( "' +
              item2.content +
              '" , "' +
              item.question +
              '" , "' +
              item2.isCorrect.toString() +
              '" )',
            [],
          );
        });
      });
    });

    const query8 = 'SELECT * from testsDetails';
    db.transaction((tx) => {
      tx.executeSql(
        query8,
        [],
        (tx, results) => {
          let resultTemp = [];

          for (let i = 0; i < results.rows.length; i++) {
            resultTemp.push(results.rows.item(i)); //looping through each row in the table and storing it as object in the 'users' array
          }

          //this.setState({details: resultTemp});
        },
        (error) => {
          console.log(error);
        },
      );
    });
  }

  executeQuery = (sqlQuery, params = []) =>
    db.transaction((tx) => {
      tx.executeSql(
        sqlQuery,
        params,
        (tx, results) => {
          console.log(sqlQuery);
        },
        (error) => {
          console.log(error);
        },
      );
    });

  failToOpenDB = (err) => {
    console.log('fail' + err);
  };

  //
  //
  // async getAllTags(db){
  //   const query = 'SELECT * FROM tags;';
  //   let table = [];
  //   db.transaction(tx=>{
  //     tx.executeSql(query,[],(tx,results)=>{
  //       let len = results.rows.length;
  //       if(len > 0){
  //         for(let i = 0; i< results.rows.length; i++){
  //           table.push(results.rows.item(i));
  //         }
  //         this.setState({ tags: table });
  //         this.getAllTests(db);
  //       }
  //     })
  //   })
  // }
  // async getAllTests(db){
  //   let tags = this.state.tags
  //   const query = 'SELECT * FROM tests;';
  //   let table = [];
  //   db.transaction(tx=>{
  //     tx.executeSql(query,[],(tx,results)=>{
  //       let len = results.rows.length;
  //       if(len > 0){
  //         for(let i = 0; i< results.rows.length; i++){
  //           table.push(results.rows.item(i));
  //           let idtag = table[i].id;
  //           table[i].tags = [];
  //           tags.forEach((item, z) => {
  //             if(item.id_tag === idtag){
  //               table[i].tags.push(item.tag)
  //             }
  //           });
  //         }
  //
  //         this.setState({ tests: _.shuffle(table) });
  //         this.loadAllTestsDetails(db);
  //       }
  //     })
  //   })
  // }
  //
  // getDetailsTestsWithInternetChecking = async (id) => {
  //   let detailsTests = null;
  //   if (
  //     await NetInfo.fetch().then((state) => {
  //       return state.isConnected;
  //     })
  //   ) {
  //     detailsTests = await this.getDetailsTests(id);
  //   } else {
  //     const testQuery = await this.executeQuery(
  //       'SELECT * FROM testsDetails WHERE id=?',
  //       [id],
  //     );
  //     detailsTests = await testQuery.rows.item(0);
  //   }
  //   return detailsTests;
  // };

  getAllDetailsTests = async () => {
    const tests = await this.getTests();
    const DetailsTestsArray = [];
    for (let i = 0; i < tests.length; i++) {
      DetailsTestsArray.push(await this.getDetailsTests(tests[i].id));
    }
    return DetailsTestsArray;
  };

  getResult = async () => {
    return await fetch(this.baseURL + '/results?last=10')
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        return json;
      })
      .catch((error) => {
        console.log('Api call error' + error);
      });
  };

  postResult = async (nick, score, total, type) => {
    return await fetch(this.baseURL + '/result', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nick,
        score,
        total,
        type,
      }),
    }).catch((error) => {
      console.log('POST error: ' + error);
    });
  };

  getTests = async () => {
    return await fetch(this.baseURL + '/tests')
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        return json;
      })
      .catch((error) => {
        console.log('Api call error' + error);
      });
  };

  getDetailsTests = async (id) => {
    return await fetch(this.baseURL + '/test/' + id)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        return json;
      })
      .catch((error) => {
        console.log('Api call error' + error);
      });
  };
}
export default QuizService;
