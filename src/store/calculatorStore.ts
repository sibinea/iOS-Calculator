import { create } from 'zustand';

import {
  backspace,
  calculate,
  clear,
  getClearLabel,
  getExpressionLine,
  formatNumberForDisplay,
  inputDecimal,
  inputDigit,
  INITIAL_STATE,
  Operation,
  performOperation,
  percentage,
  toggleSign,
  type CalculatorSnapshot,
} from '../utils/calculatorLogic';

interface CalculatorStore extends CalculatorSnapshot {
  inputDigit: (digit: string) => void;
  inputDecimal: () => void;
  performOperation: (op: Operation) => void;
  calculate: () => void;
  clear: () => void;
  backspace: () => void;
  toggleSign: () => void;
  percentage: () => void;
}

export const useCalculatorStore = create<CalculatorStore>((set) => ({
  ...INITIAL_STATE,

  inputDigit: (digit) => set((state) => inputDigit(state, digit)),
  inputDecimal: () => set((state) => inputDecimal(state)),
  performOperation: (op) => set((state) => performOperation(state, op)),
  calculate: () => set((state) => calculate(state)),
  clear: () => set((state) => clear(state)),
  backspace: () => set((state) => backspace(state)),
  toggleSign: () => set((state) => toggleSign(state)),
  percentage: () => set((state) => percentage(state)),
}));

export const selectDisplay = (state: CalculatorStore) =>
  formatNumberForDisplay(state.display);

export const selectExpression = (state: CalculatorStore) => getExpressionLine(state);

export const selectClearLabel = (state: CalculatorStore) => getClearLabel(state);
