#ifndef __DEMO_ROOM_MAIN_MENU_H__
#define __DEMO_ROOM_MAIN_MENU_H__

#include "../../engine.h"

namespace Demo {
    class RmMainMenu : public Game::Room {
    public:
        RmMainMenu();
        virtual void start() override;
    };
}

#endif
