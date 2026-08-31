import React, { memo, useCallback, useRef, type ReactNode } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

export type ButtonVariant = 'number' | 'function' | 'operator';

interface CalculatorButtonProps {
  label?: string;
  icon?: ReactNode;
  onPress: () => void;
  variant: ButtonVariant;
  active?: boolean;
  colors: {
    background: string;
    text: string;
    activeBackground?: string;
    activeText?: string;
  };
  animationsEnabled?: boolean;
  accessibilityLabel?: string;
}

function CalculatorButtonComponent({
  label,
  icon,
  onPress,
  variant,
  active = false,
  colors,
  animationsEnabled = true,
  accessibilityLabel,
}: CalculatorButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const animateTo = useCallback(
    (toValue: number) => {
      if (!animationsEnabled) return;

      Animated.parallel([
        Animated.spring(scale, {
          toValue,
          useNativeDriver: true,
          speed: 50,
          bounciness: 0,
        }),
        Animated.timing(opacity, {
          toValue: toValue === 1 ? 1 : 0.85,
          duration: 80,
          useNativeDriver: true,
        }),
      ]).start();
    },
    [animationsEnabled, opacity, scale]
  );

  const handlePressIn = useCallback(() => animateTo(0.94), [animateTo]);
  const handlePressOut = useCallback(() => animateTo(1), [animateTo]);
  const handlePress = useCallback(() => onPress(), [onPress]);

  const backgroundColor = active && colors.activeBackground ? colors.activeBackground : colors.background;
  const textColor = active && colors.activeText ? colors.activeText : colors.text;

  const buttonStyle: StyleProp<ViewStyle> = [
    styles.button,
    { backgroundColor },
  ];

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label ?? 'Backspace'}
      style={({ pressed }) => [
        styles.pressable,
        !animationsEnabled && pressed && styles.pressedFallback,
      ]}
    >
      <Animated.View style={[buttonStyle, { transform: [{ scale }], opacity }]}>
        {icon ?? (
          <Text
            style={[
              styles.label,
              variant === 'function' && styles.functionLabel,
              { color: textColor },
            ]}
          >
            {label}
          </Text>
        )}
      </Animated.View>
    </Pressable>
  );
}

export const CalculatorButton = memo(CalculatorButtonComponent);

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
    aspectRatio: 1,
    margin: 6,
  },
  button: {
    flex: 1,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 34,
    fontWeight: '400',
  },
  functionLabel: {
    fontSize: 28,
    fontWeight: '500',
  },
  pressedFallback: {
    opacity: 0.85,
  },
});
