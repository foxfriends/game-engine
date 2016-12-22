#ifndef __DEMO_ROOM_OUTSIDE_H__
#define __DEMO_ROOM_OUTSIDE_H__

#include <vector>
#include <string>

#include "../../engine.h"

namespace Demo {
    class RmOutside : public Game::Room {
    public:
        static std::vector<std::string> texture_pages;
        RmOutside();
        void start() override;
    };
}

#endif
