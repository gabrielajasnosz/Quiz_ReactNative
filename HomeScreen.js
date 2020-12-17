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

class HomeScreen extends Component {
  constructor() {
    super();
    this.state = {
      testsData: [],
    };

  }



  async componentDidMount() {
    const quiz=new QuizService();
    this.setState({
      testsData: await quiz.getTests(),
    })
  }

  getResults=async (navigation) => {
    const quiz = new QuizService();

    navigation.navigate('Result', {
      result: await quiz.getResult(),
    });
  }

  async handleOnPress(navigation,item){
    const quiz=new QuizService();
    const myDetails= await quiz.getDetailsTests(item.id);
    navigation.navigate('Test', {
      id: item.id,
      title: item.name,
      description:item.description,
      tags:item.tags,
      level:item.level,
      numberOfTasks: item.numberOfTasks,
      currentQuestion: 0,
      score:0,
      tasks: myDetails.tasks,
      end: false,

    });
    console.log(myDetails.tasks[0].question);
  }

  render() {
    const {navigation} = this.props;


    return (
      <View style={styles.container}>
        <Headline navigation={navigation} title={'Home'} />
        <View style={{flex: 10, backgroundColor: 'white'}}>
          <SafeAreaView>
            <FlatList
              data={this.state.testsData}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => {
                    this.handleOnPress(navigation,item)
                  }}>
                  <Text style={styles.title}>{item.name}</Text>
                  <View style={styles.tags}>
                    {item.tags.map((element,index) => {
                      return (
                          <Text style={styles.tag}>{item.tags[index]}</Text>
                      );
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
            <Text style={styles.checkTextStyle}>
              Check!
            </Text>
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
