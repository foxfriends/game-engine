#ifndef __GAME_POSITION_H__
#define __GAME_POSITION_H__

#include <SDL.h>
#include <climits>

namespace Game {
    struct Position;
    struct Rectangle;
    struct Dimension;
    struct Circle;

    struct Position {
        int x, y;
        Position(int x, int y) noexcept;
        operator SDL_Point() const;
        Position operator + (const Position & r) const;
        Position operator - (const Position & r) const;
        bool operator == (const Position & r) const;
        bool operator | (const Rectangle & r) const;
        bool operator | (const Circle & r) const;
    };
    struct Dimension {
        int w, h;
        Dimension(int w, int h) noexcept;
        static Dimension infinite();
        operator SDL_Point() const;
        Dimension operator + (const Dimension & r) const;
        bool operator == (const Dimension & r) const;
    };
    struct Rectangle : public Position, public Dimension {
        Rectangle(int x, int y, int w, int h) noexcept;
        Rectangle(const Position & p, const Dimension & d) noexcept;
        operator SDL_Rect() const;
        Rectangle operator + (const Position & r) const;
        Rectangle operator + (const Dimension & r) const;
        bool operator == (const Rectangle & r) const;
        bool operator | (const Rectangle & r) const;
        bool operator | (const Circle & r) const;
    };
    struct Circle : public Position {
        int r;
        Circle(int x, int y, int r) noexcept;
        Circle(const Position & p, int r) noexcept;

        Circle operator + (const Position & r) const;
        bool operator == (const Circle & r) const;
        bool operator | (const Rectangle & r) const;
        bool operator | (const Circle & r) const;
    };
}

#endif
