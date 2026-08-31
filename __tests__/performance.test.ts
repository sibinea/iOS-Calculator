import { performance } from 'node:perf_hooks';

import { INITIAL_STATE, inputDigit, performOperation, calculate } from '../src/utils/calculatorLogic';

const ITERATIONS = 10_000;

function measureStartup(): number {
  const start = performance.now();
  let state = INITIAL_STATE;

  for (let index = 0; index < 100; index += 1) {
    state = inputDigit(state, '5');
    state = performOperation(state, '+');
    state = inputDigit(state, '3');
    state = calculate(state);
  }

  return performance.now() - start;
}

function measureLogicThroughput(): number {
  const start = performance.now();

  for (let index = 0; index < ITERATIONS; index += 1) {
    let state = inputDigit(INITIAL_STATE, '9');
    state = performOperation(state, '×');
    state = inputDigit(state, '9');
    state = calculate(state);
  }

  return performance.now() - start;
}

describe('performance', () => {
  it('bootstraps calculator logic in under 200ms', () => {
    const elapsed = measureStartup();
    expect(elapsed).toBeLessThan(200);
  });

  it('handles high-frequency input under 500ms for 10k chains', () => {
    const elapsed = measureLogicThroughput();
    expect(elapsed).toBeLessThan(500);
  });
});
