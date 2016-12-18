#include "engine.h"
#include "rooms/splash.h"

namespace Demo {
    Engine::Engine() : Game::Engine{"Game", { 1024, 768 } } {}

    void Engine::start() {
        util().room_goto<Splash>();
    }
}
