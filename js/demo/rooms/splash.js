'use strict';
import { Room } from '../../src';
import SplashScreen from '../objects/splash-screen';

class Splash extends Room {
  start() {
    super.spawn(SplashScreen);
  }
};

export default Splash;
