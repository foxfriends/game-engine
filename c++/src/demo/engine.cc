#include "engine.h"
#include "rooms/splash.h"

namespace Demo {
    const std::string cfg = "resources/config.json";
    Engine::Engine() : Game::Engine{ "Game", { 1024, 768 }, cfg } {}

    void Engine::start() {
        util().room_goto<RmSplash>();
    }
}
