#include "main-menu.h"
#include "../objects/main-menu.h"

namespace Demo {
    RmMainMenu::RmMainMenu() : Room{ 1 } {}

    void RmMainMenu::start() {
        spawn<MainMenu>();
    }
}
