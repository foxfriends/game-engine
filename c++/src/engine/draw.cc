#include "draw.h"

namespace Game {
    Draw & Draw::rect(const Rectangle & r) {
        return *this;
    }

    Draw & Draw::point(const Position & p) {
        return *this;
    }

    Draw & Draw::sprite(const Sprite & s) {
        return *this;
    }
};
