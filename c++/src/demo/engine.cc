#include "engine.h"
#include "rooms/splash.h"

namespace Demo {
    Engine::Engine() : Game::Engine{ "Game", { 1024, 768 } } {}

    void Engine::start() {
        load_font("hack14", "resources/fonts/Hack-Regular.ttf", 14);
        util().room_goto<RmSplash>();
    }
}
