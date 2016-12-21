#include "home.h"
#include "../objects/player.h"

namespace Demo {
    std::vector<std::string> RmHome::texture_pages { "sarah" };

    RmHome::RmHome() : Room{ 2, "home" } {}

    void RmHome::start() {
        spawn<Player>();
    }
}
