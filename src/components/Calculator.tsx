import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Keypad } from './Keypad';

export function Calculator() {
  return (
    <View style={styles.container}>
      <Keypad />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
