# Simple Calculator

A lightning-fast, iOS-style calculator built with React Native (Expo), TypeScript, and Zustand.

## Features

- iOS-inspired layout with orange operators, gray numbers, and dark function keys
- Addition, subtraction, multiplication, division, percentage, sign toggle, and AC/C clear
- Chain calculations (`5 + 3 = 8`, then `+ 2 = 10`)
- Comma formatting, 15-digit limit, decimal guard, and graceful division-by-zero handling
- Button press animations with automatic fallback when startup interactions are slow
- Portrait-only layout with safe-area support
- Error boundary for runtime failures
- Unit, component, and performance tests

## Tech Stack

- Expo SDK 54
- React Native 0.81
- TypeScript
- Zustand
- Jest + React Native Testing Library

## Project Structure

```text
src/
  components/     UI (display, keypad, buttons, error boundary)
  store/          Zustand store wired to pure calculator logic
  utils/          Calculator state machine + formatting helpers
  theme/          Light/dark palette
  hooks/          Animation fallback hook
__tests__/        Unit, component, and performance tests
```

## Setup

### Prerequisites

- Node.js 20+
- npm
- Expo Go on a device/simulator, or Xcode/Android Studio for native builds

### Install

```bash
npm install
```

### Run

```bash
npm start
```

Then press:

- `i` for iOS simulator
- `a` for Android emulator
- Scan the QR code with Expo Go on a physical device

Platform shortcuts:

```bash
npm run ios
npm run android
npm run web
```

## Testing

```bash
npm test
npm run test:coverage
npm run typecheck
```

## Performance

See [PERFORMANCE.md](./PERFORMANCE.md) for startup and logic throughput metrics.

Target: sub-200ms perceived startup on modern devices. The app uses selector-based Zustand subscriptions to avoid unnecessary re-renders.

## Calculator Behavior Notes

- **AC/C**: `C` clears the current entry; a second press clears any pending operation.
- **Percentage**: divides the current display value by 100.
- **Errors**: division by zero and invalid results show `Error`; press `AC` to reset.
- **Formatting**: display values are comma-separated; internal math keeps raw numeric strings.

## License

Private project.
