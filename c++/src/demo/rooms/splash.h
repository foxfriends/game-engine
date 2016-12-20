#ifndef __DEMO_ROOM_SPLASH_H__
#define __DEMO_ROOM_SPLASH_H__

#include "../../engine.h"

namespace Demo {
    class RmSplash : public Game::Room {
    public:
        RmSplash();
        virtual void start() override;
    };
}

#endif
