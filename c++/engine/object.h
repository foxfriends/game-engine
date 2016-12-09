#ifndef __GAME_OBJECT_H__
#define __GAME_OBJECT_H__

#include <memory>
#include <vector>

namespace Game {
  class Object {
  public:
    virtual ~Object() = 0;
    // potential events to trigger (in step-chronological order)
    virtual void roomstart();
    virtual void stepstart();

    virtual void keydown(const int which);
    virtual void mousedown(const int which);

    virtual void mousemove(const Position &where);
    virtual void step();

    virtual void keyup(const int which);
    virtual void mouseup(const int which);

    virtual void stepend();
    virtual void roomend();
  };
};

#endif
