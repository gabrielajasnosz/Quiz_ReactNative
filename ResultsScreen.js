import React, {Component} from 'react';
import QuizService from './QuizService';
import {
  ScrollView,
  StyleSheet,
  View,
  FlatList,
  RefreshControl,
} from 'react-native';
import Headline from './Headline';
import ResultRow from './ResultRow';

class ResultsScreen extends Component {
  constructor() {
    const quiz = new QuizService();
    super();
    this.state = {
      refreshing: false,
    };

  }


  wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  // handleOnRefresh = () => {
  //   const quiz = new QuizService();
  //   this.setState(
  //       {
  //         refreshing: true,
  //       },
  //       this.getResults(this.props.navigation),
  //       () => {
  //         this.wait(200).then(() =>this.setState({
  //               refreshing: false,
  //               //display: this.state.result.reverse(),
  //             }
  //         ));
  //       },
  //   );
  // };

  handleOnRefresh = () => {
    this.setState({
      refreshing: true
    }, () => {
      this.getResults(this.props.navigation)
      this.setState({ refreshing: false})
    })
  }

  async getResults(navigation){
    const quiz = new QuizService();

    navigation.navigate('Result', {
      result: await quiz.getResult(),
    });
  }
  render() {
    const {navigation,route} = this.props;
    const {result} = route.params;

    return (
      <View style={{flex: 1}}>
        <Headline navigation={navigation} title={'Results'} />
        <View style={{flex: 12, padding: 10, backgroundColor: 'white'}}>
          <ScrollView>
            <ResultRow
              nick="Login"
              score="Score"
              type="Type"
              createdOn="Date"
            />
            {/* eslint-disable-next-line react/jsx-no-undef */}
            <FlatList
              //keyExtractor={(item) => item.key}
              data={result.reverse()}
              renderItem={({item}) => (
                <ResultRow
                  nick={item.nick}
                  score={item.score+'/'+ item.total}
                  type={item.type}
                  createdOn={item.createdOn}
                />
              )}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.handleOnRefresh}
                />
              }
            />
          </ScrollView>
        </View>
      </View>
    );
  }
}
//const styles = StyleSheet.create({});

export default ResultsScreen;
