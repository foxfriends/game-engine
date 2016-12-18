#include "splash.h"
#include "../objects/splash.h"

namespace Demo {
    Splash::Splash() : Room{ 0 } {}
    void Splash::start() {
        spawn<SplashAnimation>();
    }
}
