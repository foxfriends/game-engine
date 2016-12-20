#ifndef __GAME_SPRITE_H__
#define __GAME_SPRITE_H__

#include <string>
#include <vector>
#include <memory>

#include <SDL.h>
#include <SDL_image.h>

#include "texture-page.h"

namespace Game {
    class Sprite : public Rectangle {
        TexturePage & _page;
        std::vector<int> _frames;
        int _frame = 0;
        std::string _name;
    public:
        Sprite(TexturePage & page, const std::vector<int> & frames, const std::string & name);

        int frame() const;
        void frame(int n);

        TexturePage & texture() const;
        Rectangle src() const;
        Rectangle dest() const;
    };
}

#endif
