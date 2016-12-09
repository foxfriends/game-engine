#ifndef __GAME_ENGINE_H__
#define __GAME_ENGINE_H__

#include <memory>

#include "room.h"
#include "object.h"

namespace Game {
  class Engine {
    std::unique_ptr<Room> _room;
    std::vector<std::unique_ptr<Room>> _persisted;
    std::vector<std::unique_ptr<Object>> _objects;
    // set up the game resources
    void init();
    // process the event queue
    void step();
    // redraw the display
    void draw();
    // clean up resources
    void end();
  public:
    virtual ~Engine() = 0;
    // run the game
    void run();
  };
};

#endif
