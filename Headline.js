import {TouchableOpacity, Image, StyleSheet, Text, View} from 'react-native';

import * as React from 'react';

function Headline(props) {
  let {navigation, title} = props;
  return (
    <View style={styles.toolbar}>
      <View style={[styles.drawerIcon]}>
        <TouchableOpacity
          onPress={() => {
            navigation.openDrawer();
          }}>
          <Image
            source={require('./hamburgerIcon.png')}
            style={styles.imageStyle}
          />
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.headline}>{title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerIcon: {
    borderWidth: 2,
    width: 40,
    height: 40,
    backgroundColor: 'lightgrey',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStyle: {
    width: 20,
    height: 20,
  },
  toolbar: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    alignItems: 'center',
    paddingLeft: 15,
  },
  headline: {
    color: 'black',
    fontSize: 26,
    fontFamily: 'Oswald-VariableFont_wght',
  },
});

export default Headline;
