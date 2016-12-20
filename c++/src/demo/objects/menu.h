#ifndef __DEMO_OBJ_MENU_H__
#define __DEMO_OBJ_MENU_H__

#include <string>
#include <map>
#include <functional>

#include "../../engine.h"

namespace Demo {
    class Menu : public Game::Object, public Game::Drawable {
        unsigned int _cur = 0;
        typedef std::pair<std::string, std::function<void(void)>> Option;
        std::vector<Option> _opts;
    public:
        Menu(const std::vector<Option> & opts);
        virtual void keydown(int key) override;
        virtual void draw(Game::Draw & draw) const override;
    };
}

#endif
