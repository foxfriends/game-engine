#ifndef __GAME_DRAWABLE_H__
#define __GAME_DRAWABLE_H__

#include "draw.h"

namespace Game {
    class Drawable {
    public:
        virtual void draw(Draw &draw) = 0;
    };
};

#endif
