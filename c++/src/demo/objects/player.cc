#include "player.h"

namespace Demo {
    void Player::init() {
        sprite("sarah_idle_south");
        sprite().x = 32;
        sprite().y = 96;
    }

    void Player::roomend(int, int next) {
        if(next == 1) { // TODO: recommend making an enum for room ID's
            game().destroy(*this);
        }
    }

    void Player::step() {
        _hsp = _speed * (game().keystate(SDL_SCANCODE_RIGHT) - game().keystate(SDL_SCANCODE_LEFT));
        _vsp = _speed * (game().keystate(SDL_SCANCODE_DOWN) - game().keystate(SDL_SCANCODE_UP));
    }

    void Player::stepend() {
        sprite().x += _hsp;
        while(game().collides_room(bbox()) && _hsp) {
            std::cout << "A" << std::endl;
            sprite().x -= _hsp / std::abs(_hsp);
        }
        sprite().y += _vsp;
        while(game().collides_room(bbox()) && _vsp) {
            std::cout << "A" << std::endl;
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
    }

    Game::Position Player::position() const {
        return { sprite().x, sprite().y };
    }

    Game::Rectangle Player::bbox() const {
        return { 16, 32, 32, 32 };
    }
};
