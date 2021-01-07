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
  ToastAndroid,
} from 'react-native';
import App from './App';
import Headline from './Headline';
import QuizService from './QuizService';
import {DrawerContentScrollView} from '@react-navigation/drawer';

const _ = require('lodash');
class CustomDrawerContent extends Component {
  constructor() {
    super();
    this.state = {
      testsData: [],
    };
  }

  async componentDidMount() {
    const quiz = new QuizService();
    this.setState({
      testsData: await quiz.getTests(),
    });
  }

  async getResults(navigation) {
    const quiz = new QuizService();
    this.props.navigation.navigate('Result', {
      result: await quiz.getResult(),
    });
  }

  refreshTests = async () => {
    const quiz = new QuizService();
    this.setState({
      testsData: await quiz.getTests(),
    });
    ToastAndroid.show('Data refreshed!', ToastAndroid.SHORT);
    this.props.navigation.navigate('Home', {
      tests: await quiz.getTests(),
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
      //tasks: myDetails.tasks,
      end: false,
    });
    console.log(myDetails.tasks[0].question);
  }

  render() {
    const {navigation} = this.props;
    return (
      <DrawerContentScrollView style={{backgroundColor: 'lightgrey'}}>
        <Text style={styles.Oswald}>Quiz App</Text>
        <Image
          source={require('./logo.png')}
          style={{height: 150, width: 140, alignSelf: 'center'}}
        />
        <View
          style={{
            paddingBottom: 10,
            borderColor: 'black',
            borderBottomWidth: 1,
          }}>
          <TouchableOpacity
            style={styles.drawerButtons}
            onPress={() => {
              navigation.navigate('Home');
            }}>
            <Text style={styles.OpenSans}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.drawerButtons}
            onPress={() => {
              this.handleOnPress(
                navigation,
                this.state.testsData[
                  Math.floor(Math.random() * this.state.testsData.length)
                ],
              );
            }}>
            <Text style={styles.OpenSans}>Random Test</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.drawerButtons}
            onPress={() => {
              this.getResults(navigation);
              // navigation.navigate('Result');
            }}>
            <Text style={styles.OpenSans}>Result</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.drawerButtons}
            onPress={() => {
              this.refreshTests();
            }}>
            <Text style={styles.OpenSans}>Refresh Tests</Text>
          </TouchableOpacity>
        </View>
        <View>
          <FlatList
            //keyExtractor={(item) => item.id}
            data={_.shuffle(this.state.testsData)}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.drawerButtons}
                onPress={() => {
                  this.handleOnPress(navigation, item);
                }}>
                <Text style={styles.OpenSans}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </DrawerContentScrollView>
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
    fontWeight: 'bold',
  },
  Oswald: {
    fontSize: 30,
    alignSelf: 'center',
    margin: 10,
    fontFamily: 'Oswald-VariableFont_wght',
  },
  OpenSans: {
    fontSize: 15,
    alignSelf: 'center',
    margin: 10,
    fontFamily: 'OpenSans-Regular',
  },
});

export default CustomDrawerContent;
