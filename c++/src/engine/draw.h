#ifndef __GAME_DRAW_H__
#define __GAME_DRAW_H__

#include <string>

#include "struct.h"

// a chained interface for drawing things
namespace Game {
    class Sprite;

    class Draw {
    public:
        Draw &rect(const Rectangle &);
        Draw &point(const Position &);
        Draw &sprite(const Sprite &);
        Draw &text(const std::string &, const Position &);
    };
};

#endif
