#include "pause-menu.h"
#include "../rooms/main-menu.h"
#include <iostream>

namespace Demo {
    PauseMenu::PauseMenu() : Menu {std::vector<Menu::Option>{
        {"Resume", [this] () { game().room_close(); } },
        {"Main Menu", [this] () {
            game().room_close();
            game().room_goto<RmMainMenu>();
        } }
    }} {}
}
