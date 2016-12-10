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
        std::shared_ptr<TexturePage> _texpage;
        std::vector<TexturePage::Key> _frames;
        int _frame;
    public:
        Sprite(const std::shared_ptr<TexturePage> &tp, const std::initializer_list<int> &frames);
        virtual ~Sprite();
    };
};



#endif
