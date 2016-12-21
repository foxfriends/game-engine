#include "pause-menu.h"
#include "../objects/pause-menu.h"

namespace Demo {
    RmPauseMenu::RmPauseMenu() : Room{ 4 } {}

    void RmPauseMenu::start() {
        spawn<PauseMenu>();
    }
}
