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
        float _frame = 0;
        std::string _name;
    public:
        Sprite(TexturePage & page, const std::vector<int> & frames, const std::string & name);

        float frame() const;
        float frame(float f);

        TexturePage & texture() const;
        const std::string & name() const;
        Rectangle src() const;
        Rectangle dest() const;
    };
}

#endif
