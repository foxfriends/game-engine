#include "splash.h"
namespace Demo {
    void SplashAnimation::step() {}

    void SplashAnimation::draw(Game::Draw & draw) const {
        draw.color(0, 0, 0)
            .rect(Game::Rectangle{ 25, 25, 50, 50 });
    }
};
