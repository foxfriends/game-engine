#include "sprite.h"

namespace Game {
    Sprite::Sprite(const TexturePage & page, const std::vector<int> & frames, const std::string & name)
        : _page{ page }, _frames{ frames }, _name{ name } {}

};
