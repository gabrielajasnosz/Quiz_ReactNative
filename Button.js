import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity, ScrollView} from 'react-native';

class Button extends Component {
  render() {
    const {title, key, handleOnPress} = this.props;
    return (
      <TouchableOpacity
        style={styles.checkStyle}
        onPress={() => handleOnPress({key})}>
        <Text style={styles.checkTextStyle}>{title}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  checkTextStyle: {
    fontSize: 15,
    color: '#000000',
    textAlign: 'center',
    fontFamily: 'OpenSans',
  },
  checkStyle: {
    margin: 10,
    height: 50,
    width: 200,
    backgroundColor: 'lightgrey',
    borderColor: 'black',
    justifyContent: 'center',
    borderWidth: 1,
  },
});

export default Button;
