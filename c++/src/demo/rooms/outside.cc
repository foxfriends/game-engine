#include "home.h"
#include "outside.h"
#include "../objects/door.h"

namespace Demo {
    RmOutside::RmOutside() : Room{ 3, { "sarah" }, "outside" } {}

    void RmOutside::start() {
        spawn<Door<RmHome>>(Game::Position{10 * 32, 8 * 32 - 16}, Game::Position{18 * 32 - 16, 18 * 32 - 80});
    }
}
