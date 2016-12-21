#include "collider.h"

#include <cstdlib>

namespace Game {
    bool Collider::collides(const Rectangle & where) const {
        auto here = bbox();
        auto there = position();
        here.x += there.x;
        here.y += there.y;
        return
            std::abs(here.x - where.x) < (here.w + where.w) / 2 &&
            std::abs(here.y - where.y) < (here.h + where.h) / 2;
    }
}
