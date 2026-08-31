import { registerRootComponent } from 'expo';
import * as SplashScreen from 'expo-splash-screen';

import App from './App';

SplashScreen.setOptions({
  duration: 0,
  fade: false,
});

SplashScreen.hide();

registerRootComponent(App);
