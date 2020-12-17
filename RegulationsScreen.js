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
import AsyncStorage from '@react-native-async-storage/async-storage';
const STORAGE_KEY = '@save_rule_status';

class RegulationsScreen extends Component {
  constructor() {
    super();
    this.state = {
      regulations: 'false',
    };
  }
  async componentDidMount() {
    await this.getData();
  }
  onAccept = async () => {
    try {
      console.log(this.state.regulations);
      this.setState({
        regulations: 'true',
      });
      await AsyncStorage.setItem(STORAGE_KEY, 'true');
    } catch (err) {
      console.log(err);
    }
  };

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEY);
      if (value !== null) {
        if (value == 'true') {
          this.setState({
            regulations: 'true',
          });
        } else {
          this.setState({
            regulations: 'false',
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const {navigation} = this.props;
    if (this.state.regulations === 'true') {
      navigation.navigate('Home');
      return <View style={styles.container} />;
    } else {
      return (
        <View style={styles.container}>
          <Text style={styles.text}>Regulations.</Text>
          <Text>Rule 1</Text>
          <Text>Rule 2</Text>
          <Text>Rule 3</Text>
          <Text>Rule 4</Text>
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={() => {
              this.onAccept();
              navigation.navigate('Home');
            }}>
            <Text>ACCEPT</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '85%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 30,
    padding: 40,
  },
  buttonStyle: {
    margin: 10,
    height: 40,
    width: 120,
    backgroundColor: '#00000000',
    borderColor: 'black',
    justifyContent: 'center',
    borderWidth: 1,
  },
});

export default RegulationsScreen;
