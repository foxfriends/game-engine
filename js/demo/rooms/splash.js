'use strict';
import { Room } from '../../engine';
import SplashScreen from '../objects/splash-screen';
import { override } from '../../engine';

class Splash extends Room {
  @override
  start() {
    super.spawn(SplashScreen);
  }
};

export default Splash;
