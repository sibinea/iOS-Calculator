import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';

interface BackspaceIconProps {
  color: string;
}

function BackspaceIconComponent({ color }: BackspaceIconProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.arrow, { borderRightColor: color }]} />
      <View style={[styles.box, { borderColor: color }]}>
        <View style={[styles.crossVertical, { backgroundColor: color }]} />
        <View style={[styles.crossHorizontal, { backgroundColor: color }]} />
      </View>
    </View>
  );
}

export const BackspaceIcon = memo(BackspaceIconComponent);

const styles = StyleSheet.create({
  container: {
    width: 28,
    height: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrow: {
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderRightWidth: 8,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    marginRight: -1,
  },
  box: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crossVertical: {
    position: 'absolute',
    width: 2,
    height: 10,
    borderRadius: 1,
  },
  crossHorizontal: {
    position: 'absolute',
    width: 10,
    height: 2,
    borderRadius: 1,
  },
});
