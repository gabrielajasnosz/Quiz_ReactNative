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

let db;
const _ = require('lodash');

class HomeScreen extends Component {
  service = new QuizService();
  NetInfoSubscribtion = null;

  constructor() {
    super();
    this.state = {
      isLoading: true,
      isConnected: false,
      testDetailsAll: null,
    };
    db = SQLite.openDatabase({
      name: 'quiz.db',
      createFromLocation: 1,
    });
  }

  async componentDidMount() {
    this.NetInfoSubscribtion = NetInfo.addEventListener(
      this.handleConnectivityChange,
    );
    const service = new QuizService();
    service.getAllDetailsTests();
    this.setState({
      isLoading: false,
    });

    const dateFromStorage = await AsyncStorage.getItem('Date');
    if (
      await NetInfo.fetch().then((state) => {
        return state.isConnected;
      })
    ) {
      if (
        dateFromStorage ===
        new Date().getDate().toString() +
          '-' +
          new Date().getMonth().toString() +
          '-' +
          new Date().getFullYear().toString()
      ) {
        console.log('Data already saved today.');
      } else {
        await AsyncStorage.setItem(
          'Date',
          new Date().getDate().toString() +
            '-' +
            new Date().getMonth().toString() +
            '-' +
            new Date().getFullYear().toString(),
        );
        this.savetoDataBase();
        console.log('Data succesfully saved.');
      }
    } else {
    }
  }

  componentWillUnmount() {
    this.NetInfoSubscribtion && this.NetInfoSubscribtion();
  }

  handleConnectivityChange = (state) => {
    this.setState({isConnected: state.isConnected});
  };
  savetoDataBase = async () => {
    const service = new QuizService();
    const testsDetails = await service.getAllDetailsTests();

    this.executeQuery('DROP TABLE IF EXISTS tests', []);
    this.executeQuery(
      'CREATE TABLE IF NOT EXISTS tests (id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL, description TEXT NOT NULL, tags TEXT NOT NULL, level TEXT NOT NULL, numberOfTasks INTEGER NOT NULL);',
      [],
    );

    this.props.route.params?.testsData.map((test) => {
      this.executeQuery(
        'INSERT INTO tests (id, name, description, tags, level, numberOfTasks) VALUES (?,?,?,?,?,?);',
        [
          test.id,
          test.name,
          test.description,
          test.tags.toString(),
          test.level,
          test.numberOfTasks,
        ],
      );
    });

    this.executeQuery('DROP TABLE IF EXISTS testsDetails', []);
    this.executeQuery(
      'CREATE TABLE IF NOT EXISTS testsDetails (tags TEXT NOT NULL, tasks TEXT NOT NULL, name TEXT NOT NULL, description TEXT NOT NULL, level TEXT NOT NULL, id TEXT NOT NULL);',
      [],
    );
    testsDetails.map(async (test) => {
      this.executeQuery(
        'INSERT INTO testsDetails (tags, tasks, name, description, level, id) VALUES (?,?,?,?,?,?);',
        [
          test.tags.toString(),
          JSON.stringify(test.tasks),
          test.name,
          test.description,
          test.level,
          test.id,
        ],
      );
    });
  };

  executeQuery = (sqlQuery, params = []) =>
    new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          sqlQuery,
          params,
          (tx, results) => {
            resolve(results);
          },
          (error) => {
            console.log(error);
            reject(error);
          },
        );
      });
    });

  failToOpenDB = (err) => {
    console.log('fail' + err);
  };

  getResults = async (navigation) => {
    if (
      await NetInfo.fetch().then((state) => {
        return state.isConnected;
      })
    ) {
      const quiz = new QuizService();

      navigation.navigate('Result', {
        result: await quiz.getResult(),
      });
    } else {
      alert("You don't have internet connection!");
    }
  };

  async handleOnPress(navigation, item) {
    const quiz = new QuizService();
    const myDetails = await quiz.getDetailsTestsWithInternetCheck(item.id);
    await NetInfo.fetch().then((state) => {
      return state.isConnected;
    });

    if (
      await NetInfo.fetch().then((state) => {
        return state.isConnected;
      })
    ) {
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
    } else {
      navigation.navigate('Test', {
        id: item.id,
        title: item.name,
        description: item.description,
        tags: item.tags,
        level: item.level,
        numberOfTasks: item.numberOfTasks,
        currentQuestion: 0,
        score: 0,
        tasks: _.shuffle(JSON.parse(myDetails.tasks)),
        end: false,
      });
    }
  }

  render() {
    const {navigation, route} = this.props;
    const {testsData} = route.params;
    return (
      <View style={styles.container}>
        <Headline navigation={navigation} title={'Home'} />
        <View style={{flex: 10, backgroundColor: 'white'}}>
          <SafeAreaView>
            <FlatList
              data={testsData}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => {
                    this.handleOnPress(navigation, item);
                  }}>
                  <Text style={styles.title}>{item.name}</Text>
                  <View style={styles.tags}>
                    <Text style={styles.tag}>{item.tags}</Text>
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
