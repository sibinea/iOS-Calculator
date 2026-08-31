import React, { memo, useCallback, useMemo } from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAnimationsEnabled } from '../hooks/useAnimationsEnabled';
import {
  selectClearLabel,
  selectDisplay,
  selectExpression,
  useCalculatorStore,
} from '../store/calculatorStore';
import { getTheme } from '../theme/colors';
import { BackspaceIcon } from './BackspaceIcon';
import { CalculatorButton } from './CalculatorButton';
import { Display } from './Display';

type KeyConfig = {
  label?: string;
  type: 'digit' | 'decimal' | 'clear' | 'sign' | 'percent' | 'operator' | 'equals' | 'backspace';
  value?: string;
};

const KEY_ROWS: KeyConfig[][] = [
  [
    { type: 'backspace' },
    { label: 'AC', type: 'clear' },
    { label: '%', type: 'percent' },
    { label: '÷', type: 'operator', value: '÷' },
  ],
  [
    { label: '7', type: 'digit', value: '7' },
    { label: '8', type: 'digit', value: '8' },
    { label: '9', type: 'digit', value: '9' },
    { label: '×', type: 'operator', value: '×' },
  ],
  [
    { label: '4', type: 'digit', value: '4' },
    { label: '5', type: 'digit', value: '5' },
    { label: '6', type: 'digit', value: '6' },
    { label: '-', type: 'operator', value: '-' },
  ],
  [
    { label: '1', type: 'digit', value: '1' },
    { label: '2', type: 'digit', value: '2' },
    { label: '3', type: 'digit', value: '3' },
    { label: '+', type: 'operator', value: '+' },
  ],
  [
    { label: '+/-', type: 'sign' },
    { label: '0', type: 'digit', value: '0' },
    { label: '.', type: 'decimal' },
    { label: '=', type: 'equals' },
  ],
];

function KeypadComponent() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = useMemo(() => getTheme(colorScheme), [colorScheme]);
  const animationsEnabled = useAnimationsEnabled();

  const display = useCalculatorStore(selectDisplay);
  const expression = useCalculatorStore(selectExpression);
  const clearLabel = useCalculatorStore(selectClearLabel);
  const operation = useCalculatorStore((state) => state.operation);

  const inputDigit = useCalculatorStore((state) => state.inputDigit);
  const inputDecimal = useCalculatorStore((state) => state.inputDecimal);
  const performOperation = useCalculatorStore((state) => state.performOperation);
  const calculate = useCalculatorStore((state) => state.calculate);
  const clear = useCalculatorStore((state) => state.clear);
  const backspace = useCalculatorStore((state) => state.backspace);
  const toggleSign = useCalculatorStore((state) => state.toggleSign);
  const percentage = useCalculatorStore((state) => state.percentage);

  const handleKeyPress = useCallback(
    (key: KeyConfig) => {
      switch (key.type) {
        case 'digit':
          inputDigit(key.value!);
          break;
        case 'decimal':
          inputDecimal();
          break;
        case 'clear':
          clear();
          break;
        case 'backspace':
          backspace();
          break;
        case 'sign':
          toggleSign();
          break;
        case 'percent':
          percentage();
          break;
        case 'operator':
          performOperation(key.value as '+' | '-' | '×' | '÷');
          break;
        case 'equals':
          calculate();
          break;
      }
    },
    [backspace, calculate, clear, inputDecimal, inputDigit, performOperation, percentage, toggleSign]
  );

  const buttonColors = useMemo(
    () => ({
      number: {
        background: theme.numberButton,
        text: theme.numberButtonText,
      },
      function: {
        background: theme.functionButton,
        text: theme.functionButtonText,
      },
      operator: {
        background: theme.operatorButton,
        text: theme.operatorButtonText,
        activeBackground: theme.operatorButtonActive,
        activeText: theme.operatorButton,
      },
    }),
    [theme]
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingBottom: insets.bottom + 8 }]}>
      <View style={styles.displayArea}>
        <Display expression={expression} value={display} theme={theme} />
      </View>
      <View style={styles.keypad}>
        {KEY_ROWS.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((key) => {
              const label = key.type === 'clear' ? clearLabel : key.label;
              const variant =
                key.type === 'digit' || key.type === 'decimal' || key.type === 'sign'
                  ? 'number'
                  : key.type === 'operator' || key.type === 'equals'
                    ? 'operator'
                    : 'function';

              const isActiveOperator =
                key.type === 'operator' && operation === key.value && variant === 'operator';

              return (
                <CalculatorButton
                  key={`${key.type}-${label ?? 'backspace'}`}
                  label={label}
                  icon={
                    key.type === 'backspace' ? (
                      <BackspaceIcon color={buttonColors.function.text} />
                    ) : undefined
                  }
                  variant={variant}
                  active={isActiveOperator}
                  colors={buttonColors[variant]}
                  animationsEnabled={animationsEnabled}
                  onPress={() => handleKeyPress(key)}
                />
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

export const Keypad = memo(KeypadComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  displayArea: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  keypad: {
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
