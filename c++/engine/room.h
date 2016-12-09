#ifndef __GAME_ROOM_H__
#define __GAME_ROOM_H__

#include <memory>
#include <vector>

#include "object.h"
#include "sprite.h"

namespace Game {
  class Room {
    std::vector<std::unique_ptr<Object>> _objects;
    std::vector<std::unique_ptr<Sprite>> _sprites;
    std::vector<std::unique_ptr<Tile>> _tiles;
  public:
    // start the room
    virtual void start() = 0;
    // process event
    virtual void proc(const Event &event);
    // end the room
    virtual void end() = 0;
  };
};

#endif
