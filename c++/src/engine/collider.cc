#include "collider.h"

#include <cstdlib>

namespace Game {
    bool Collider::collides(const Rectangle & where) const {
        auto box = bbox();
        auto here = position();
        return
            std::abs(here.x + box.x - where.x) < (box.w + where.w) / 2 &&
            std::abs(here.y + box.y - where.y) < (box.h + where.h) / 2;
    }
}
