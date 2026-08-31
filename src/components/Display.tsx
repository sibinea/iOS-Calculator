import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { CalculatorTheme } from '../theme/colors';

interface DisplayProps {
  expression: string;
  value: string;
  theme: CalculatorTheme;
}

function DisplayComponent({ expression, value, theme }: DisplayProps) {
  return (
    <View style={styles.container}>
      <Text
        style={[styles.expression, { color: theme.expressionText }]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {expression}
      </Text>
      <Text
        style={[styles.value, { color: theme.displayText }]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.35}
      >
        {value}
      </Text>
    </View>
  );
}

export const Display = memo(DisplayComponent);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  expression: {
    fontSize: 24,
    fontWeight: '400',
    textAlign: 'right',
    marginBottom: 8,
    minHeight: 28,
  },
  value: {
    fontSize: 84,
    fontWeight: '200',
    textAlign: 'right',
  },
});
