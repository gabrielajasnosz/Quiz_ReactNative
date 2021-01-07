import React from 'react';
import {Component} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
} from 'react-native';

import SplashScreen from 'react-native-splash-screen';

import RegulationsScreen from './RegulationsScreen';

import {NavigationContainer} from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import CustomDrawerContent from './CustomDrawerContent';
import HomeScreen from './HomeScreen';
import TestScreen from './TestScreen';
import ResultsScreen from './ResultsScreen';
import QuizService from './QuizService';
const STORAGE_KEY = '@save_rule_status';

const Drawer = createDrawerNavigator();

class App extends Component {
  // async componentDidMount() {
  //   const quiz = new QuizService();
  //   this.setState({
  //     testsData: await quiz.getTests(),
  //   });
  //
  // }

  async componentDidMount() {
    // const quiz = new QuizService();
    // this.props.navigation.navigate('Home', {
    //   tests: await quiz.getTests(),
    // });
    SplashScreen.hide();
  }

  render() {
    return (
      <NavigationContainer>
        <Drawer.Navigator
          initialRouteName="Regulations"
          drawerContent={(props) => <CustomDrawerContent {...props} />}>
          <Drawer.Screen name="Home" component={HomeScreen} />
          <Drawer.Screen name="Result" component={ResultsScreen} />
          <Drawer.Screen name="Regulations" component={RegulationsScreen} />
          <Drawer.Screen name="Test" component={TestScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
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
    fontSize: 20,
    alignSelf: 'center',
    margin: 10,
    fontFamily: 'OpenSans-Regular',
  },
});

export default App;
