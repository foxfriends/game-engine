'use strict';

import { Drawable, GameObject, override, persistent, sprite } from '../../engine';

@persistent
@sprite('player')
class Player extends Drawable(GameObject) {
}

export default Player;
