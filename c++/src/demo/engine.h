#ifndef __DEMO_ENGINE_H__
#define __DEMO_ENGINE_H__

#include "../engine/engine.h"

namespace Demo {
    class Engine : public Game::Engine {
    public:
        Engine();
        virtual void start() override;
    };
}

#endif
