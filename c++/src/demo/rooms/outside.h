#ifndef __DEMO_ROOM_OUTSIDE_H__
#define __DEMO_ROOM_OUTSIDE_H__

#include <vector>
#include <string>

#include "../../engine.h"

namespace Demo {
    class RmOutside : public Game::Room {
    public:
        RmOutside();
        void start() override;
    };
}

#endif
