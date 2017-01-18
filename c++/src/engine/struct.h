#ifndef __GAME_POSITION_H__
#define __GAME_POSITION_H__

#include <SDL.h>
#include <climits>

namespace Game {
    struct Position {
        int x, y;
        Position(int x, int y) noexcept : x{ x }, y{ y } {}
        operator SDL_Point() const { return { x, y }; }
        Position operator + (const Position & r) const { return { x + r.x, y + r.y }; };
    };
    struct Dimension {
        int w, h;
        Dimension(int w, int h) noexcept : w{ w }, h{ h } {}
        static Dimension infinite() { return { INT_MAX, INT_MAX }; }
        operator SDL_Point() const { return { w, h }; }
    };
    struct Rectangle : public Position, public Dimension {
        Rectangle(int x, int y, int w, int h) noexcept : Position{ x, y }, Dimension{ w, h } {}
        Rectangle(const Position & p, const Dimension & d) noexcept : Position{ p }, Dimension{ d } {}
        operator SDL_Rect() const { return { x, y, w, h }; }
        Rectangle operator + (const Position & r) const { return { x + r.x, y + r.y, w, h }; };
    };
}

#endif
