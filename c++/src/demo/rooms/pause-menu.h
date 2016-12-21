#ifndef __DEMO_ROOM_PAUSE_MENU_H__
#define __DEMO_ROOM_PAUSE_MENU_H__

#include "../../engine.h"

namespace Demo {
    class RmPauseMenu : public Game::Room {
    public:
        RmPauseMenu();
        virtual void start() override;
    };
}

#endif
