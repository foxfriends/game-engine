#include "sprite.h"

namespace Game {
    Sprite::Sprite(TexturePage & page, const std::vector<int> & frames, const std::string & name)
        : Rectangle{ 0, 0, page[frames[0]].w, page[frames[0]].h }, _page{ page }, _frames{ frames }, _name{ name } {}

    float Sprite::frame() const {
        return _frame;
    }

    float Sprite::frame(float f) {
        if(f >= _frames.size()) {
            f -= _frames.size();
        } else if(f < 0) {
            f += _frames.size();
        }
        return _frame = f;
    }

    TexturePage & Sprite::texture() const { return _page; }
    const std::string & Sprite::name() const { return _name; }
    Rectangle Sprite::src() const { return _page[_frames[static_cast<int>(_frame)]]; };
    Rectangle Sprite::dest() const { return *this; }
}
