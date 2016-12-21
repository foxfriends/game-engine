#include "main-menu.h"
#include "../rooms/home.h"

namespace Demo {
    MainMenu::MainMenu() : Menu {std::vector<Menu::Option>{
        {"New Game", [this] () { game().room_goto<RmHome>(); } },
        {"Continue", [this] () { game().restart(); } },
        {"Quit", [this] () { game().end(); } }
    }} {}
}
