#ifndef __DEMO_ROOM_HOME_H__
#define __DEMO_ROOM_HOME_H__

#include <vector>
#include <string>

#include "../../engine.h"

namespace Demo {
    class RmHome : public Game::Room {
    public:
        RmHome();
        void start() override;
    };
}

#endif
