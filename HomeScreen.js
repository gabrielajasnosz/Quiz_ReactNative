import React, {Component} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
} from 'react-native';
import App from './App';
import Headline from './Headline';
import QuizService from './QuizService';
import Button from './Button';
import SQLite from 'react-native-sqlite-storage';
import NetInfo from '@react-native-community/netinfo';

import AsyncStorage from '@react-native-async-storage/async-storage';

const _ = require('lodash');

let db;
class HomeScreen extends Component {
  NetInfoSubscribtion = null;
  constructor() {
    super();

    db = SQLite.openDatabase({
      name: 'quiz.db',
      createFromLocation: 1,
    });

    this.state = {
      DBresult: [],
      details: [],
      isConnected: false,
    };
  }

  async componentDidMount() {
    this.NetInfoSubscribtion = NetInfo.addEventListener(
      this.handleConnectivityChange,
    );
    const quiz = new QuizService();
    this.props.navigation.navigate('Home', {
      tests: await quiz.getTestsWithInternetChecking(),
    });

    const dateFromStorage = await AsyncStorage.getItem('CurrentDate');
    if (
      dateFromStorage ===
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
    }
  }
  handleConnectivityChange = (state) => {
    this.setState({isConnected: state.isConnected});
  };

  componentWillUnmount() {
    this.NetInfoSubscribtion && this.NetInfoSubscribtion();
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

          this.setState({details: resultTemp});
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

  getResults = async (navigation) => {
    const quiz = new QuizService();

    navigation.navigate('Result', {
      result: await quiz.getResult(),
    });
  };

  async handleOnPress(navigation, item) {
    const quiz = new QuizService();
    const myDetails = await quiz.getDetailsTests(item.id);
    navigation.navigate('Test', {
      id: item.id,
      title: item.name,
      description: item.description,
      tags: item.tags,
      level: item.level,
      numberOfTasks: item.numberOfTasks,
      currentQuestion: 0,
      score: 0,
      tasks: _.shuffle(myDetails.tasks),
      end: false,
    });
    console.log(myDetails.tasks[0].question);
  }

  render() {
    const {navigation, route} = this.props;
    const {tests} = route.params;
    console.log(this.state.DBresult);
    console.log(this.state.details);
    return (
      <View style={styles.container}>
        <Headline navigation={navigation} title={'Home'} />
        <View style={{flex: 10, backgroundColor: 'white'}}>
          <SafeAreaView>
            <FlatList
              data={_.shuffle(tests)}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => {
                    this.handleOnPress(navigation, item);
                  }}>
                  <Text style={styles.title}>{item.name}</Text>
                  <View style={styles.tags}>
                    {item.tags.map((element, index) => {
                      return <Text style={styles.tag}>{item.tags[index]}</Text>;
                    })}
                  </View>
                  <View>
                    <Text style={styles.description}>{item.description}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </SafeAreaView>
        </View>
        <View style={styles.resultContainer}>
          <Text style={styles.title}> Get to know your ranking result</Text>
          <TouchableOpacity
            style={[styles.checkStyle]}
            onPress={() => this.getResults(navigation)}>
            <Text style={styles.checkTextStyle}>Check!</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  drawerButtons: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    margin: 12,
    height: 55,
  },
  container: {
    flex: 1,
  },
  resultContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 1,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderColor: 'grey',
    borderWidth: 2,
    height: 140,
    overflow: 'hidden',
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Oswald-VariableFont_wght',
  },
  tags: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  tag: {
    fontSize: 15,
    color: '#4a3aa4',
    textDecorationLine: 'underline',
    marginRight: 5,
    fontFamily: 'OpenSans',
  },
  description: {
    fontSize: 12,
    color: '#000000',
    marginRight: 5,
    fontFamily: 'OpenSans',
  },
  checkStyle: {
    margin: 10,
    height: 40,
    width: 120,
    backgroundColor: '#00000000',
    borderColor: 'black',
    justifyContent: 'center',
    borderWidth: 1,
  },
  Oswald: {
    fontSize: 30,
    alignSelf: 'center',
    margin: 10,
    fontFamily: 'Oswald-VariableFont_wght',
  },
  OpenSans: {
    fontSize: 20,
    alignSelf: 'center',
    margin: 10,
    fontFamily: 'OpenSans-Regular',
  },
  checkTextStyle: {
    fontSize: 15,
    color: '#000000',
    textAlign: 'center',
    fontFamily: 'OpenSans',
  },
});

export default HomeScreen;
