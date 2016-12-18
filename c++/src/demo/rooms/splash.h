#ifndef __DEMO_ROOM_SPLASH_H__
#define __DEMO_ROOM_SPLASH_H__

#include "../../engine.h"

namespace Demo {
    class Splash : public Game::Room {
    public:
        Splash();
        virtual void start() override;
    };
};

#endif
