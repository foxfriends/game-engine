#ifndef __GAME_POSITION_H__
#define __GAME_POSITION_H__

#include <SDL.h>
#include <climits>

namespace Game {
    typedef SDL_Point Position;
    struct Dimension {
        int w, h;
        Dimension(int w, int h) : w{ w }, h{ h } {}
        static Dimension infinite() { return { INT_MAX, INT_MAX }; }
        operator SDL_Point() { return {w, h}; }
    };
    typedef SDL_Rect Rectangle;
    // struct Position {
    //     int x, y;
    //     Position(int x, int y) noexcept
    //         : x{x}, y{y} {}
    //     operator SDL_Point() { return {x,y}; }
    // };
    // struct Dimension {
    //     int w, h;
    //     Position(int w, int h) noexcept
    //         : w{w}, h{h} {}
    // };
    // struct Rectangle : public Position, public Dimension {
    //     Rectangle(int x, int y, int w, int h) noexcept
    //         : Position{x, y}, Dimension{w, h} {}
    //     Rectangle(const Position &p, const Dimension &d) noexcept
    //         : Position{p}, Dimension{d} {}
    //     operator SDL_Rect() { return {x,y,w,h}; }
    // };
};

#endif
