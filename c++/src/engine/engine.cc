#include "engine.h"

namespace Game {
    Event transform(const SDL_Event &event) {
        return Event{};
    }

    Engine::~Engine() {}

    void Engine::start() {}

    void Engine::step() {
        SDL_Event event;
        std::vector<Event> events;
        while(SDL_PollEvent(&event)) {
            events.emplace_back(transform(event));
        }
        for(auto &event : events) {
            for(auto &o : _objects) {
                o->proc(event);
            }
            _room->proc(event);
        }
    }

    void Engine::draw() {
        for(auto &o : _objects) {
            o->draw(_draw);
        }
        _room->draw(_draw);
    }

    void Engine::end() {
        if(_room) {
            _room->end();
        }
    }

    int Engine::run() {
        start();
        for(;;) {
            step();
            draw();
        }
        end();
        return 0;
    }
};
