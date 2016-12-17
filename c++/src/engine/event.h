#ifndef __GAME_EVENT_H__
#define __GAME_EVENT_H__

#include <vector>

namespace Game {
    struct Event {
        enum Type {
            None,
            GameStart,
            RoomStart,
            KeyDown,
            KeyUp,
            MouseDown,
            MouseUp,
            MouseMove,
            StepStart,
            Step,
            StepEnd,
            RoomEnd,
            GameEnd
        };
        Type type;
        std::vector<int> data;
    };
};

#endif
