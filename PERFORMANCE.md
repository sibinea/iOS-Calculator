# Performance Metrics Report

Measured on: August 10, 2026  
Environment: Node.js Jest runtime (logic + startup simulation)

## Targets

| Metric | Target | Result |
| --- | --- | --- |
| App startup (logic bootstrap) | < 200ms | Pass |
| Calculator logic throughput | 10k chains < 500ms | Pass |
| UI frame rate | 60fps animations | Native driver enabled |
| Re-render control | Minimal keypad updates | Zustand selectors + `React.memo` |

## Automated Benchmarks

Run:

```bash
npm test -- performance.test.ts
```

### Logic Bootstrap

Simulates 100 chained `5 + 3 =` sequences immediately after module load.

- Expected: < 200ms
- Purpose: validates that calculator state transitions stay fast enough for instant interaction

### High-Frequency Input

Runs 10,000 chained `9 × 9 =` sequences.

- Expected: < 500ms
- Purpose: guards against regressions in pure calculation code

## Runtime Optimizations

1. **Pure logic layer** — all math lives in `src/utils/calculatorLogic.ts`, keeping UI renders separate from computation.
2. **Zustand selectors** — display, expression, and clear label use dedicated selectors to limit subscriptions.
3. **Memoized buttons** — `CalculatorButton` is wrapped in `React.memo` with stable press handlers from `useCallback`.
4. **Native-driven animations** — scale/opacity animations use the native driver for 60fps feedback.
5. **Lazy keypad loading** — non-critical keypad UI is lazy-loaded behind a lightweight suspense fallback.
6. **Animation fallback** — if startup interactions exceed 100ms, button animations disable automatically to protect frame time.

## Device Notes

Native startup on physical hardware will vary by device class:

- Modern iPhone / flagship Android: typically instant in Expo Go
- Older devices: lazy keypad + animation fallback reduce jank

For on-device profiling, use React Native Performance Monitor or Xcode Instruments during a release build.
