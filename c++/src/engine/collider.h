#ifndef __GAME_COLLIDER_H__
#define __GAME_COLLIDER_H__

#include "struct.h"

namespace Game {
    class Collider {
    public:
        virtual const Position & position() const = 0;
        virtual const Rectangle & bbox() const = 0;
        bool collides(const Rectangle & where) const;
    };
};

#endif
