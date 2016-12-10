#ifndef __GAME_ENGINE_H__
#define __GAME_ENGINE_H__

#include <memory>
#include <vector>

#include "room.h"
#include "object.h"
#include "event.h"

namespace Game {
    class Engine {
        Draw _draw;
        std::unique_ptr<Room> _room;
        std::vector<std::unique_ptr<Object>> _objects;
        // set up the game resources
        void start();
        // process the event queue
        void step();
        // redraw the display
        void draw();
        // clean up resources
        void end();
    public:
        virtual ~Engine() = 0;
        // run the game
        int run();
    };
};

#endif
