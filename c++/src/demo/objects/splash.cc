#include "splash.h"
#include "../rooms/main-menu.h"
#include <cmath>

namespace Demo {
    float Splash::_alpha() const {
        float amt = std::min(1.0, ((_duration / 2.0) - std::abs(_duration / 2.0 - _fade)) / _peak);
        return std::pow(std::sin(amt * M_PI / 2), 2);
    }

    void Splash::keydown(int) {
        _fade = _duration;
    }

    void Splash::step() {
        ++_fade;
        if(_fade >= _duration) {
            game().room_goto<RmMainMenu>();
        }
    }

    void Splash::draw(Game::Draw & draw) const {
        draw.color(0, 0, 0)
            .alpha(_alpha())
            .rect(Game::Rectangle{ 25, 25, 50, 50 });
    }
}
