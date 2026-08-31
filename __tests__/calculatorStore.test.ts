import {
  selectClearLabel,
  selectDisplay,
  selectExpression,
  useCalculatorStore,
} from '../src/store/calculatorStore';

describe('calculatorStore', () => {
  beforeEach(() => {
    useCalculatorStore.setState({
      display: '0',
      previousValue: null,
      operation: null,
      waitingForOperand: false,
      hasError: false,
    });
  });

  it('performs chained calculations through the store', () => {
    useCalculatorStore.getState().inputDigit('5');
    useCalculatorStore.getState().performOperation('+');
    useCalculatorStore.getState().inputDigit('3');
    useCalculatorStore.getState().calculate();

    expect(useCalculatorStore.getState().display).toBe('8');

    useCalculatorStore.getState().performOperation('+');
    useCalculatorStore.getState().inputDigit('2');
    useCalculatorStore.getState().calculate();

    expect(useCalculatorStore.getState().display).toBe('10');
  });

  it('surfaces division by zero as an error', () => {
    useCalculatorStore.getState().inputDigit('8');
    useCalculatorStore.getState().performOperation('÷');
    useCalculatorStore.getState().inputDigit('0');
    useCalculatorStore.getState().calculate();

    expect(useCalculatorStore.getState().display).toBe('Error');
    expect(useCalculatorStore.getState().hasError).toBe(true);
  });

  it('exposes formatted UI selectors for display interactions', () => {
    useCalculatorStore.getState().inputDigit('1');
    useCalculatorStore.getState().inputDigit('2');
    useCalculatorStore.getState().inputDigit('3');
    useCalculatorStore.getState().inputDigit('4');

    const state = useCalculatorStore.getState();
    expect(selectDisplay(state)).toBe('1,234');
    expect(selectExpression(state)).toBe('');
    expect(selectClearLabel(state)).toBe('C');
  });
});
