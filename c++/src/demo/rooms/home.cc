#include "home.h"
#include "outside.h"
#include "../objects/player.h"
#include "../objects/door.h"

namespace Demo {
    RmHome::RmHome() : Room{ 2, { "sarah" }, "home" } {}

    void RmHome::start() {
        if(find<Player>().empty()) {
            spawn<Player>();
        }
        spawn<Door<RmOutside>>(Game::Position{18 * 32, 18 * 32 - 16}, Game::Position{10 * 32 - 16, 8 * 32 - 16});
    }
}
