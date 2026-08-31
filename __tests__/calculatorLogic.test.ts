import {
  applyOperation,
  backspace,
  calculate,
  clear,
  countDigits,
  formatNumberForDisplay,
  getClearLabel,
  getExpressionLine,
  INITIAL_STATE,
  inputDecimal,
  inputDigit,
  normalizeResult,
  performOperation,
  percentage,
  toggleSign,
} from '../src/utils/calculatorLogic';

describe('calculatorLogic', () => {
  describe('inputDigit', () => {
    it('replaces leading zero', () => {
      expect(inputDigit(INITIAL_STATE, '5').display).toBe('5');
    });

    it('appends digits', () => {
      const state = inputDigit(INITIAL_STATE, '1');
      expect(inputDigit(state, '2').display).toBe('12');
    });

    it('blocks input beyond 15 digits', () => {
      let state = { ...INITIAL_STATE, display: '123456789012345' };
      state = inputDigit(state, '6');
      expect(state.display).toBe('123456789012345');
    });

    it('starts fresh after waitingForOperand', () => {
      const state = {
        ...INITIAL_STATE,
        display: '8',
        previousValue: 5,
        operation: '+' as const,
        waitingForOperand: true,
      };
      expect(inputDigit(state, '2').display).toBe('2');
    });
  });

  describe('inputDecimal', () => {
    it('adds a decimal point once', () => {
      const once = inputDecimal(INITIAL_STATE);
      const twice = inputDecimal(once);
      expect(once.display).toBe('0.');
      expect(twice.display).toBe('0.');
    });

    it('starts with 0. when waiting for operand', () => {
      const state = {
        ...INITIAL_STATE,
        waitingForOperand: true,
        previousValue: 1,
        operation: '+' as const,
      };
      expect(inputDecimal(state).display).toBe('0.');
    });
  });

  describe('toggleSign', () => {
    it('toggles positive and negative values', () => {
      const positive = inputDigit(INITIAL_STATE, '9');
      const negative = toggleSign(positive);
      const positiveAgain = toggleSign(negative);
      expect(negative.display).toBe('-9');
      expect(positiveAgain.display).toBe('9');
    });
  });

  describe('percentage', () => {
    it('divides the current value by 100', () => {
      const state = inputDigit(INITIAL_STATE, '5');
      expect(percentage(state).display).toBe('0.05');
    });
  });

  describe('applyOperation', () => {
    it('handles basic math', () => {
      expect(applyOperation(10, 2, '+')).toBe(12);
      expect(applyOperation(10, 2, '-')).toBe(8);
      expect(applyOperation(10, 2, '×')).toBe(20);
      expect(applyOperation(10, 2, '÷')).toBe(5);
    });

    it('returns error for division by zero', () => {
      expect(applyOperation(10, 0, '÷')).toBe('error');
    });
  });

  describe('performOperation and calculate', () => {
    it('chains calculations', () => {
      let state = inputDigit(INITIAL_STATE, '5');
      state = performOperation(state, '+');
      state = inputDigit(state, '3');
      state = calculate(state);
      expect(state.display).toBe('8');

      state = performOperation(state, '+');
      state = inputDigit(state, '2');
      state = calculate(state);
      expect(state.display).toBe('10');
    });

    it('updates the pending operator without calculating twice', () => {
      let state = inputDigit(INITIAL_STATE, '9');
      state = performOperation(state, '+');
      state = performOperation(state, '-');
      state = inputDigit(state, '1');
      state = calculate(state);
      expect(state.display).toBe('8');
    });
  });

  describe('backspace', () => {
    it('removes the last digit', () => {
      let state = inputDigit(INITIAL_STATE, '1');
      state = inputDigit(state, '2');
      state = inputDigit(state, '3');
      expect(backspace(state).display).toBe('12');
    });

    it('resets to zero when one digit remains', () => {
      const state = inputDigit(INITIAL_STATE, '7');
      expect(backspace(state).display).toBe('0');
    });

    it('ignores backspace while waiting for the next operand', () => {
      let state = inputDigit(INITIAL_STATE, '5');
      state = performOperation(state, '+');
      expect(backspace(state)).toEqual(state);
    });

    it('does nothing when display is already zero', () => {
      expect(backspace(INITIAL_STATE)).toEqual(INITIAL_STATE);
    });
  });

  describe('clear', () => {
    it('shows C then AC behavior', () => {
      let state = inputDigit(INITIAL_STATE, '7');
      expect(getClearLabel(state)).toBe('C');

      state = clear(state);
      expect(state.display).toBe('0');
      expect(getClearLabel(state)).toBe('AC');
    });

    it('clears staged calculations in two steps', () => {
      let state = inputDigit(INITIAL_STATE, '5');
      state = performOperation(state, '+');
      state = inputDigit(state, '3');

      state = clear(state);
      expect(state.display).toBe('0');
      expect(state.operation).toBe('+');

      state = clear(state);
      expect(state).toEqual(INITIAL_STATE);
    });

    it('resets error state', () => {
      const errorState = { ...INITIAL_STATE, display: 'Error', hasError: true };
      expect(clear(errorState)).toEqual(INITIAL_STATE);
    });
  });

  describe('formatNumberForDisplay', () => {
    it('formats integers with commas', () => {
      expect(formatNumberForDisplay('1234567')).toBe('1,234,567');
    });

    it('formats decimals and negatives', () => {
      expect(formatNumberForDisplay('-1234.56')).toBe('-1,234.56');
    });
  });

  describe('normalizeResult', () => {
    it('returns Error for invalid results', () => {
      expect(normalizeResult(Number.POSITIVE_INFINITY)).toBe('Error');
      expect(normalizeResult('error')).toBe('Error');
    });

    it('limits precision', () => {
      expect(normalizeResult(0.1 + 0.2)).toBe('0.3');
    });
  });

  describe('getExpressionLine', () => {
    it('shows the pending operation', () => {
      let state = inputDigit(INITIAL_STATE, '5');
      state = performOperation(state, '+');
      expect(getExpressionLine(state)).toBe('5 +');
    });
  });

  describe('countDigits', () => {
    it('ignores symbols', () => {
      expect(countDigits('-12.345')).toBe(5);
    });
  });
});
