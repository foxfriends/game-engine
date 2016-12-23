'use strict';
import { Room, override } from '../../engine';
import SplashScreen from '../objects/splash-screen';

class Splash extends Room {
  @override
  start() {
    super.spawn(SplashScreen);
  }
};

export default Splash;
