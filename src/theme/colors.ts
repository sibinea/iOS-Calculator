export type ColorScheme = 'light' | 'dark';

export interface CalculatorTheme {
  background: string;
  displayText: string;
  expressionText: string;
  numberButton: string;
  numberButtonText: string;
  functionButton: string;
  functionButtonText: string;
  operatorButton: string;
  operatorButtonActive: string;
  operatorButtonText: string;
}

const lightTheme: CalculatorTheme = {
  background: '#000000',
  displayText: '#FFFFFF',
  expressionText: '#A5A5A5',
  numberButton: '#333333',
  numberButtonText: '#FFFFFF',
  functionButton: '#A5A5A5',
  functionButtonText: '#FFFFFF',
  operatorButton: '#FF9F0A',
  operatorButtonActive: '#FFFFFF',
  operatorButtonText: '#FFFFFF',
};

const darkTheme: CalculatorTheme = {
  background: '#000000',
  displayText: '#FFFFFF',
  expressionText: '#A5A5A5',
  numberButton: '#333333',
  numberButtonText: '#FFFFFF',
  functionButton: '#A5A5A5',
  functionButtonText: '#FFFFFF',
  operatorButton: '#FF9F0A',
  operatorButtonActive: '#FFFFFF',
  operatorButtonText: '#FFFFFF',
};

export function getTheme(scheme: string | null | undefined): CalculatorTheme {
  // ponytail: iOS calculator is dark in both modes; same palette keeps the diff tiny
  return scheme === 'light' ? lightTheme : darkTheme;
}
