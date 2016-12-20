#include "menu.h"

namespace Demo {
    Menu::Menu(const std::vector<Option> & opts) : _opts { opts } {}

    void Menu::keydown(int key) {
        switch(key) {
            // TODO: don't use SDL scancodes... remap those or something for abstraction
            //       or maybe it's not worth it who knows...
        case SDL_SCANCODE_DOWN:
            _cur = (_cur + 1) % _opts.size();
            break;
        case SDL_SCANCODE_UP:
            _cur = (_cur + _opts.size() - 1) % _opts.size();
            break;
        case SDL_SCANCODE_RETURN:
            _opts.at(_cur).second();
            break;
        }
    }

    void Menu::draw(Game::Draw & draw) const {
        Game::Position where { 64, 128 };
        draw.font("hack");
        draw.alpha(1);
        for(unsigned int i = 0; i < _opts.size(); ++i) {
            auto & opt = _opts[i].first;
            where.y = 128 + 32 * i;
            if(i == _cur) {
                draw.color(0xff, 0, 0);
            } else {
                draw.color(0, 0, 0);
            }
            draw.text(opt, where);
        }
    }
}
