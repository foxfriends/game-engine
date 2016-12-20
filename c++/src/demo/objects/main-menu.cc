#include "main-menu.h"

namespace Demo {
    MainMenu::MainMenu() : Menu {{
        {"New Game", [this] () { game().restart(); } },
        {"Continue", [this] () { game().restart(); } }
    }} {}
}
