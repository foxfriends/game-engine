#ifndef __GAME_POSITION_H__
#define __GAME_POSITION_H__

namespace Game {
  typedef SDL_Point Position;
  typedef SDL_Point Dimension;
  typedef SDL_Rect Rectangle;
  // struct Position {
  //   int x, y;
  //   Position(int x, int y) noexcept
  //     : x{x}, y{y} {}
  //   operator SDL_Point() { return {x,y}; }
  // };
  // struct Dimension {
  //   int w, h;
  //   Position(int w, int h) noexcept
  //     : w{w}, h{h} {}
  // };
  // struct Rectangle : public Position, public Dimension {
  //   Rectangle(int x, int y, int w, int h) noexcept
  //     : Position{x, y}, Dimension{w, h} {}
  //   Rectangle(const Position &p, const Dimension &d) noexcept
  //     : Position{p}, Dimension{d} {}
  //   operator SDL_Rect() { return {x,y,w,h}; }
  // };
};

#endif
