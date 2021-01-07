import React, {Component} from 'react';
import SQLite from 'react-native-sqlite-storage';
import NetInfo from '@react-native-community/netinfo';
const _ = require('lodash');
//let db;
class QuizService extends Component {
  baseURL = 'http://tgryl.pl/quiz';

  constructor() {
    super();
    // let db = SQLite.openDatabase({
    //   name: 'quiz.db',
    //   createFromLocation: 1,
    // });

    this.state = {
      tags: [],
      tests: [],
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
      tests = await this.getTests();
    } else {
      const query1 = 'SELECT * FROM tags;';
      let table1 = [];

      this.props.db.transaction((tx) => {
        tx.executeSql(query1, [], (tx, results) => {
          let len = results.rows.length;
          if (len > 0) {
            for (let i = 0; i < results.rows.length; i++) {
              table1.push(results.rows.item(i));
            }
            this.setState({tags: table1});
          }
        });
      });

      const query2 = 'SELECT * FROM tests;';
      let table = [];
      this.props.db.transaction((tx) => {
        tx.executeSql(query2, [], (tx, results) => {
          let len = results.rows.length;
          if (len > 0) {
            for (let i = 0; i < results.rows.length; i++) {
              table.push(results.rows.item(i));
              let idtag = table[i].id;
              table[i].tags = [];
              this.state.tags.forEach((item, z) => {
                if (item.test_id === idtag) {
                  table[i].tags.push(item.tag);
                }
              });
            }
          }
        });
      });

      tests = _.shuffle(table);
    }
    return tests;
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
