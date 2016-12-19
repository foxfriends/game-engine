#ifndef __DEMO_OBJ_SPLASH_H__
#define __DEMO_OBJ_SPLASH_H__

#include "../../engine.h"

namespace Demo {
    class SplashAnimation : public Game::Object, public Game::Drawable {
        int _fade = 0;
        int _duration = 4 * Game::SECOND;
        int _peak = 1 * Game::SECOND;
        float _alpha() const;
    public:
        virtual void step() override;
        virtual void draw(Game::Draw & draw) const override;
    };
};

#endif
