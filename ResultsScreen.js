import React, {Component} from 'react';
import QuizService from './QuizService';
import {
  ScrollView,
  StyleSheet,
  ToastAndroid,
  View,
  FlatList,
  RefreshControl,
} from 'react-native';
import Headline from './Headline';
import ResultRow from './ResultRow';

class ResultsScreen extends Component {
  wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };
  constructor() {
    super();
    this.state = {
      refreshing: false,
      //result: this.props.route.params.result,
    };
  }

  _refreshControl() {
    return (
      <RefreshControl
        refreshing={this.state.refreshing}
        onRefresh={() => this._refreshFlatList()}
      />
    );
  }

  async componentDidMount() {
    const quiz = new QuizService();
    this.props.navigation.navigate('Result', {
      result: await quiz.getResult(),
    });
  }

  _refreshFlatList() {
    const quiz = new QuizService();
    this.setState(
      {
        refreshing: true,
      },
      () => {
        this.wait(200).then(
          () => this.getResults(this.props.navigation),
          this.setState({
            refreshing: false,
            // result: quiz.getResult(),
          }),
        );

        ToastAndroid.show('Data refreshed', ToastAndroid.SHORT);
      },
    );
  }

  async getResults(navigation) {
    const quiz = new QuizService();

    navigation.navigate('Result', {
      result: await quiz.getResult(),
    });
  }
  render() {
    const {navigation, route} = this.props;
    const {result} = route.params;

    return (
      <View style={{flex: 1}}>
        <Headline navigation={navigation} title={'Results'} />
        <View style={{flex: 12, padding: 10, backgroundColor: 'white'}}>
          <ScrollView refreshControl={this._refreshControl()}>
            <ResultRow
              nick="Login"
              score="Score"
              type="Type"
              createdOn="Date"
            />
            <FlatList
              data={result}
              renderItem={({item}) => (
                <ResultRow
                  nick={item.nick}
                  score={item.score + '/' + item.total}
                  type={item.type}
                  createdOn={item.createdOn}
                />
              )}
            />
          </ScrollView>
        </View>
      </View>
    );
  }
}
//const styles = StyleSheet.create({});

export default ResultsScreen;
