import React, {Component} from 'react';
import {View, Text, StyleSheet, RefreshControl} from 'react-native';

class ResultRow extends Component {
  render() {
    const {nick, score, type, total, createdOn} = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.text}>
          <Text>{nick}</Text>
        </View>
        <View style={styles.text}>
          <Text>{score}</Text>
        </View>
        <View style={styles.text}>
          <Text>{type}</Text>
        </View>
        <View style={styles.text}>
          <Text>{createdOn}</Text>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 70,
    display: 'flex',
    flexDirection: 'row',
  },
  text: {
    width: '25%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    fontWeight: 'bold',
  },
});

export default ResultRow;
