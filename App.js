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
import AsyncStorage from '@react-native-async-storage/async-storage';
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

//
// function CustomDrawerContent({navigation}) {
//   return (
//     <DrawerContentScrollView style={{backgroundColor: 'lightgrey'}}>
//       <Text style={styles.Oswald}>Quiz App</Text>
//       <Image
//         source={require('./logo.png')}
//         style={{height: 150, width: 140, alignSelf: 'center'}}
//       />
//       <View
//         style={{paddingBottom: 10, borderColor: 'black', borderBottomWidth: 1}}>
//         <TouchableOpacity
//           style={styles.drawerButtons}
//           onPress={() => {
//             navigation.navigate('Home');
//           }}>
//           <Text style={styles.OpenSans}>Home</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.drawerButtons}
//           onPress={() => {
//             navigation.navigate('Result');
//           }}>
//           <Text style={styles.OpenSans}>Result</Text>
//         </TouchableOpacity>
//       </View>
//       <View>
//         <FlatList
//           //keyExtractor={(item) => item.id}
//           data={this.state.testsData}
//           renderItem={({item}) => (
//             <TouchableOpacity
//               style={styles.drawerButtons}
//               onPress={() => {
//                 navigation.navigate('Test', {
//                   id: item.id,
//                   title: item.name,
//                   description:item.description,
//                   tags:item.tags,
//                   level:item.level,
//                   numberOfTasks: item.numberOfTasks,
//                   question: 0,
//                   end: false,
//                 });
//               }}>
//               <Text style={styles.OpenSans} >{item.name}</Text>
//             </TouchableOpacity>
//           )}
//         />
//       </View>
//     </DrawerContentScrollView>
//   );
// }

const Drawer = createDrawerNavigator();

class App extends Component {
  async componentDidMount() {
    const quiz = new QuizService();
    this.setState({
      testsData: await quiz.getTests(),
    })
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
