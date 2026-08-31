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

## Android Play Store Release

### Splash screen

Android requires a native launch window, but this app is configured to show only a black screen (matching the calculator background) with no logo. It hides instantly on startup, so the main screen appears immediately.

### One-time setup

1. Create a [Google Play Developer](https://play.google.com/console) account ($25 one-time fee).
2. Install EAS CLI and log in:

```bash
npm install -g eas-cli
eas login
```

3. Link the project to EAS (creates an Expo project ID):

```bash
eas build:configure
```

### Build the release (.aab)

Google Play requires an Android App Bundle:

```bash
npm run build:android
```

EAS will prompt you to generate an Android keystore on first build. Save the credentials — you need the same keystore for all future updates.

To test an installable APK locally before uploading:

```bash
eas build --platform android --profile preview
```

### Upload to Google Play

Option A — EAS Submit (recommended):

1. Create a Google Play service account and download its JSON key.
2. Save it as `google-play-service-account.json` in the project root (already gitignored).
3. Run:

```bash
npm run submit:android
```

Option B — Manual upload:

1. Download the `.aab` from the [Expo build dashboard](https://expo.dev/accounts).
2. Upload it in Google Play Console under **Release > Production** (or Internal testing first).

### Privacy policy (required by Google Play)

The policy file is at `docs/privacy-policy.html`. Google Play needs a **public HTTPS URL** for it.

**Option A — GitHub Pages (free)**

1. Push the repo to GitHub.
2. In repo settings, enable **Pages** → source: `main` branch, folder `/docs`.
3. Your link will be:

```text
https://<your-github-username>.github.io/simple-calculator/privacy-policy.html
```

**Option B — Any static host**

Upload `docs/privacy-policy.html` to Netlify, Cloudflare Pages, Firebase Hosting, etc., and use the URL they give you.

Paste that URL in Play Console under **App content → Privacy policy**.

### Play Console checklist

- App name: **Simple Calculator**
- Package name: `com.sibin.calculator`
- Category: Tools
- Content rating questionnaire
- Privacy policy: host `docs/privacy-policy.html` and paste the public URL into Play Console
- Screenshots (phone, 1080×1920 or similar)
- Feature graphic (1024×500)

### Version updates

Before each release, bump in `app.json`:

- `version` — user-facing version (e.g. `1.0.1`)
- `android.versionCode` — integer that must increase every upload (e.g. `2`)

Then run `npm run build:android` again.

## Calculator Behavior Notes

- **AC/C**: `C` clears the current entry; a second press clears any pending operation.
- **Percentage**: divides the current display value by 100.
- **Errors**: division by zero and invalid results show `Error`; press `AC` to reset.
- **Formatting**: display values are comma-separated; internal math keeps raw numeric strings.

## License

Private project.
