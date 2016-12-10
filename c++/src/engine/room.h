#ifndef __GAME_ROOM_H__
#define __GAME_ROOM_H__

#include <memory>
#include <vector>

#include "object.h"
#include "event.h"

namespace Game {
    class Room {
        std::vector<std::unique_ptr<Object>> _objects;
    public:
        virtual ~Room() = 0;
        // start the room
        virtual void start();
        // process an event
        virtual void proc(const Event &event);
        // draw all objects
        virtual void draw(Draw &draw);
        // end the room
        virtual void end();
    };
};

#endif
