#include "splash.h"
#include "../objects/splash.h"

namespace Demo {
    RmSplash::RmSplash() : Room{ 0 } {}

    void RmSplash::start() {
        spawn<Splash>();
    }
}
