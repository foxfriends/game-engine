#include "player.h"
#include "../rooms/pause-menu.h"

namespace Demo {
    bool Player::persistent = true;

    void Player::init() {
        sprite("sarah_idle_south");
        sprite().x = 500;
        sprite().y = 400;
    }

    void Player::roomend(int, int next) {
        if(next == 1) { // TODO: recommend making an enum for room ID's
            game().destroy(*this);
        }
    }

    void Player::keydown(int key) {
        if(key == SDL_SCANCODE_P) {
            game().room_overlay<RmPauseMenu>();
        }
    }

    void Player::step() {
        _hsp = _speed * (game().keystate(SDL_SCANCODE_RIGHT) - game().keystate(SDL_SCANCODE_LEFT));
        _vsp = _speed * (game().keystate(SDL_SCANCODE_DOWN) - game().keystate(SDL_SCANCODE_UP));
    }

    void Player::stepend() {
        sprite().x += _hsp;
        while(game().collides_room(bbox()) && _hsp != 0) {
            sprite().x -= _hsp / std::abs(_hsp);
        }
        sprite().y += _vsp;
        while(game().collides_room(bbox()) && _vsp != 0) {
            sprite().y -= _vsp / std::abs(_vsp);
        }
        if(_hsp != 0 || _vsp != 0) {
            if(_hsp != 0) {
                _dir = _hsp > 0 ? "east" : "west";
            } else if(_vsp != 0) {
                _dir = _vsp > 0 ? "south" : "north";
            }
            sprite("sarah_walk_" + _dir);
            sprite().frame(sprite().frame() + 0.2);
        } else {
            sprite("sarah_idle_" + _dir);
        }
        game().view({ position().x + 32, position().y + 32 });
    }

    Game::Position Player::position() const {
        return { sprite().x, sprite().y };
    }

    Game::Rectangle Player::bbox() const {
        return { position().x + 16, position().y + 32, 32, 32 };
    }
};
