export type Operation = '+' | '-' | '×' | '÷';

export const MAX_DIGITS = 15;

export interface CalculatorSnapshot {
  display: string;
  previousValue: number | null;
  operation: Operation | null;
  waitingForOperand: boolean;
  hasError: boolean;
}

export const INITIAL_STATE: CalculatorSnapshot = {
  display: '0',
  previousValue: null,
  operation: null,
  waitingForOperand: false,
  hasError: false,
};

export function countDigits(value: string): number {
  return value.replace(/[^0-9]/g, '').length;
}

export function applyOperation(a: number, b: number, op: Operation): number | 'error' {
  switch (op) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '×':
      return a * b;
    case '÷':
      return b === 0 ? 'error' : a / b;
    default:
      return b;
  }
}

export function normalizeResult(value: number | 'error'): string {
  if (value === 'error') return 'Error';

  if (!Number.isFinite(value)) return 'Error';

  const rounded = parseFloat(value.toPrecision(12));
  let result = String(rounded);

  if (result.includes('e') || result.includes('E')) {
    return 'Error';
  }

  if (countDigits(result.replace('-', '')) > MAX_DIGITS) {
    return 'Error';
  }

  return result;
}

export function inputDigit(state: CalculatorSnapshot, digit: string): CalculatorSnapshot {
  if (state.hasError) return state;

  if (state.waitingForOperand) {
    return {
      ...state,
      display: digit,
      waitingForOperand: false,
    };
  }

  if (state.display === '0') {
    return { ...state, display: digit };
  }

  if (countDigits(state.display) >= MAX_DIGITS) {
    return state;
  }

  return { ...state, display: state.display + digit };
}

export function inputDecimal(state: CalculatorSnapshot): CalculatorSnapshot {
  if (state.hasError) return state;

  if (state.waitingForOperand) {
    return {
      ...state,
      display: '0.',
      waitingForOperand: false,
    };
  }

  if (state.display.includes('.')) {
    return state;
  }

  return { ...state, display: `${state.display}.` };
}

export function toggleSign(state: CalculatorSnapshot): CalculatorSnapshot {
  if (state.hasError || state.display === '0') return state;

  if (state.display.startsWith('-')) {
    return { ...state, display: state.display.slice(1) };
  }

  return { ...state, display: `-${state.display}` };
}

export function percentage(state: CalculatorSnapshot): CalculatorSnapshot {
  if (state.hasError) return state;

  const value = parseFloat(state.display) / 100;
  const display = normalizeResult(value);

  return {
    ...state,
    display,
    hasError: display === 'Error',
    waitingForOperand: false,
  };
}

export function performOperation(
  state: CalculatorSnapshot,
  nextOperation: Operation
): CalculatorSnapshot {
  if (state.hasError) return state;

  const currentValue = parseFloat(state.display);

  if (state.previousValue === null) {
    return {
      ...state,
      previousValue: currentValue,
      operation: nextOperation,
      waitingForOperand: true,
    };
  }

  if (state.waitingForOperand) {
    return {
      ...state,
      operation: nextOperation,
    };
  }

  const result = applyOperation(state.previousValue, currentValue, state.operation!);
  const display = normalizeResult(result);

  if (display === 'Error') {
    return {
      ...INITIAL_STATE,
      display: 'Error',
      hasError: true,
    };
  }

  return {
    display,
    previousValue: parseFloat(display),
    operation: nextOperation,
    waitingForOperand: true,
    hasError: false,
  };
}

export function calculate(state: CalculatorSnapshot): CalculatorSnapshot {
  if (state.hasError || state.operation === null || state.previousValue === null) {
    return state;
  }

  if (state.waitingForOperand) {
    return {
      ...state,
      waitingForOperand: false,
    };
  }

  const currentValue = parseFloat(state.display);
  const result = applyOperation(state.previousValue, currentValue, state.operation);
  const display = normalizeResult(result);

  if (display === 'Error') {
    return {
      ...INITIAL_STATE,
      display: 'Error',
      hasError: true,
    };
  }

  return {
    display,
    previousValue: parseFloat(display),
    operation: null,
    waitingForOperand: false,
    hasError: false,
  };
}

export function backspace(state: CalculatorSnapshot): CalculatorSnapshot {
  if (state.hasError || state.waitingForOperand || state.display === '0') {
    return state;
  }

  const nextDisplay = state.display.slice(0, -1);

  return {
    ...state,
    display: nextDisplay.length <= 1 || nextDisplay === '-' ? '0' : nextDisplay,
  };
}

export function clear(state: CalculatorSnapshot): CalculatorSnapshot {
  if (state.hasError) {
    return { ...INITIAL_STATE };
  }

  if (state.display !== '0') {
    return {
      ...state,
      display: '0',
      waitingForOperand: state.previousValue !== null,
    };
  }

  if (state.previousValue !== null || state.operation !== null) {
    return { ...INITIAL_STATE };
  }

  return { ...INITIAL_STATE };
}

export function getExpressionLine(state: CalculatorSnapshot): string {
  if (state.hasError || state.operation === null || state.previousValue === null) {
    return '';
  }

  const formattedPrevious = formatNumberForDisplay(String(state.previousValue));
  return `${formattedPrevious} ${state.operation}`;
}

export function formatNumberForDisplay(value: string): string {
  if (value === 'Error') return 'Error';

  const isNegative = value.startsWith('-');
  const unsigned = isNegative ? value.slice(1) : value;
  const [integerPart, decimalPart] = unsigned.split('.');
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  let formatted = decimalPart !== undefined ? `${formattedInteger}.${decimalPart}` : formattedInteger;
  if (isNegative) formatted = `-${formatted}`;

  return formatted;
}

export function getClearLabel(state: CalculatorSnapshot): 'AC' | 'C' {
  if (state.hasError) return 'AC';

  const shouldShowClear =
    state.display !== '0' ||
    state.previousValue !== null ||
    state.operation !== null;

  return shouldShowClear ? 'C' : 'AC';
}
