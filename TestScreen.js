import React, {Component} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Headline from './Headline';

import QuizService from './QuizService';
import Button from './Button';

class TestScreen extends Component {
  constructor() {
    super();
    this.state = {
      score: 0,
    };
  }

  render() {
    const {route, navigation} = this.props;
    const {
      id,
      title,
      currentQuestion,
      end,
      description,
      tags,
      level,
      numberOfTasks,
      tasks,
    } = route.params;

    const changeQuestion = (id) => {
      if (currentQuestion === numberOfTasks - 1) {
        const service = new QuizService();
        service.postResult('gabigabi', this.state.score, numberOfTasks, title);
        navigation.navigate('Test', {
          id: id,
          title: title,
          description: description,
          numberOfTasks: numberOfTasks,
          level: level,
          tags: tags,
          currentQuestion: currentQuestion,
          end: true,
        });
      } else {
        navigation.navigate('Test', {
          id: id,
          title: title,
          description: description,
          numberOfTasks: numberOfTasks,
          level: level,
          tags: tags,
          currentQuestion: currentQuestion + 1,
          end: false,
        });
      }
    };

    const checkAnswer = (number) => {
      if (tasks[currentQuestion].answers[number].isCorrect === true) {
        this.setState({
          score: this.state.score + 1,
        });
      }
      changeQuestion(id);
    };

    const endGame = async () => {
      const quiz = new QuizService();
      navigation.navigate('Result', {
        result: await quiz.getResult(),
      });
      this.setState({
        score: 0,
      });
    };

    return (
      <View style={{flex: 1}}>
        <Headline navigation={navigation} title={title} />

        <View style={{flex: 12, backgroundColor: 'white'}}>
          {!end && (
            <>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 10,
                }}>
                <Text style={styles.questionText2}>
                  Question {currentQuestion + 1} of {numberOfTasks}
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.questionText2}>
                    Time: {tasks[currentQuestion].duration}
                  </Text>
                </View>
              </View>
              <View style={{flex: 10, padding: 10}}>
                <View style={styles.questionBox}>
                  <ScrollView>
                    <Text style={styles.questionText}>
                      {tasks[currentQuestion].question}
                    </Text>
                  </ScrollView>
                </View>
                <View style={styles.answerBox}>
                  {tasks[currentQuestion].answers.map((element, index) => {
                    return (
                      <Button
                        title={element.content}
                        key={index}
                        handleOnPress={checkAnswer.bind(this, index)}
                      />
                    );
                  })}
                </View>
              </View>
            </>
          )}
          {end && (
            <>
              <View style={[{flex: 1, alignItems: 'center'}]}>
                <Text style={styles.questionText}>Congratulations!</Text>
                <Text style={[{marginTop: 4}]}>{title}</Text>
                <Text style={[{marginTop: 4}]}>
                  Your score:{this.state.score}
                </Text>
                <Text style={[{marginTop: 4}]}>
                  Max points: {numberOfTasks}
                </Text>
                <Text style={[{marginTop: 4}]}>
                  Date: {new Date().toISOString().slice(0, 10)}
                </Text>
                {/* eslint-disable-next-line react/jsx-no-undef */}
                <TouchableOpacity
                  style={[styles.checkStyle]}
                  onPress={() => endGame()}>
                  <Text style={{textAlign: 'center'}}>See ranking!</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  questionBox: {
    flex: 2,
    flexDirection: 'column',
    alignItems: 'center',
  },

  questionText: {
    textAlign: 'justify',
    padding: 15,
    fontSize: 26,
    fontFamily: 'Oswald-VariableFont_wght',
  },
  questionText2: {
    fontSize: 18,
    fontFamily: 'OpenSans',
  },
  answerBox: {
    borderColor: 'black',
    borderWidth: 2,
    flex: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  answers: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  answer: {
    paddingLeft: 25,
    paddingRight: 25,
  },
  progressBar: {
    width: 400,
    height: 30,
  },
  container: {
    flex: 1,
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
  checkStyle: {
    margin: 10,
    height: 70,
    width: 150,
    backgroundColor: 'lightgrey',
    borderColor: 'black',
    justifyContent: 'center',
    borderWidth: 1,
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
    fontSize: 15,
    color: '#000000',
    marginRight: 5,
    fontFamily: 'OpenSans',
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

export default TestScreen;
