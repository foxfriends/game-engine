#include "sprite.h"

namespace Game {
    Sprite::Sprite(TexturePage & page, const std::vector<int> & frames, const std::string & name)
        : Rectangle{ 0, 0, page[frames[0]].w, page[frames[0]].h }, _page{ page }, _frames{ frames }, _name{ name } {}

    int Sprite::frame() const { return _frame; }
    void Sprite::frame(int f) { _frame = f; }

    TexturePage & Sprite::texture() const { return _page; }
    Rectangle Sprite::src() const { return _page[_frame]; };
    Rectangle Sprite::dest() const { return *this; }
}
