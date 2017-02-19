#include "struct.h"
#include <cmath>

namespace Game {
    Position::Position(int x, int y) noexcept : x{ x }, y{ y } {}
    Position::operator SDL_Point() const { return { x, y }; }
    Position Position::operator + (const Position & r) const { return { x + r.x, y + r.y }; }
    Position Position::operator - (const Position & r) const { return { x - r.x, y - r.y }; }
    bool Position::operator == (const Position & r) const { return x == r.x && y == r.y; }
    bool Position::operator | (const Rectangle & r) const { return x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h; }
    bool Position::operator | (const Circle & c) const { return std::pow(x - c.x, 2) + std::pow(y - c.y, 2) < c.r * c.r; }

    Dimension::Dimension(int w, int h) noexcept : w{ w }, h{ h } {}
    Dimension Dimension::infinite() { return { INT_MAX, INT_MAX }; }
    Dimension::operator SDL_Point() const { return { w, h }; }
    Dimension Dimension::operator + (const Dimension & r) const { return { w + r.w, h + r.h }; }
    bool Dimension::operator == (const Dimension & r) const { return w == r.w && h == r.h; }

    Rectangle::Rectangle(int x, int y, int w, int h) noexcept : Position{ x, y }, Dimension{ w, h } {}
    Rectangle::Rectangle(const Position & p, const Dimension & d) noexcept : Position{ p }, Dimension{ d } {}
    Rectangle::operator SDL_Rect() const { return { x, y, w, h }; }
    Rectangle Rectangle::operator + (const Position & r) const { return { x + r.x, y + r.y, w, h }; }
    Rectangle Rectangle::operator + (const Dimension & r) const { return { x, y, w + r.w, h + r.h }; }
    bool Rectangle::operator == (const Rectangle & r) const { return x == r.x && y == r.y && w == r.w && h == r.h; }
    bool Rectangle::operator | (const Rectangle & r) const {
        return std::abs((r.x + r.w / 2) - (x + w / 2)) < (r.w + w) / 2 && std::abs((r.y + r.h / 2) - (y + h / 2)) < (r.h + h) / 2;
    }
    bool Rectangle::operator | (const Circle & c) const { return c | *this; }

    Circle::Circle(int x, int y, int r) noexcept : Position{ x, y }, r{ r } {}
    Circle::Circle(const Position & p, int r) noexcept : Position{ p }, r{ r } {}
    Circle Circle::operator + (const Position & p) const { return {x + p.x, y + p.y, r}; }
    bool Circle::operator == (const Circle & c) const { return x == c.x && y == c.y && r == c.r; }
    bool Circle::operator | (const Rectangle & r) const {
        const int
            dx = std::abs(x - (r.y + r.w / 2)),
            dy = std::abs(y - (r.x + r.h / 2));
        if (dx > r.w / 2 + this->r) { return false; }
        if (dy > r.h / 2 + this->r) { return false; }
        if (dx <= r.w / 2) { return true; }
        if (dy <= r.h / 2) { return true; }
        const int c = std::pow(dx - r.w / 2, 2) + std::pow(dy - r.h / 2, 2);
        return c <= std::pow(this->r, 2);
    }
    bool Circle::operator | (const Circle & c) const {
        return std::pow(x - c.x, 2) + std::pow(y - c.y, 2) <= std::pow(r + c.r, 2);
    }
}
