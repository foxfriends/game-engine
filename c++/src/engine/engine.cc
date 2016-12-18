#include "engine.h"
#include "gameutil.h"
#include "drawable.h"
#include "object.h"
#include "event.h"

namespace Game {
    Engine::Engine(const std::string & title, const Dimension & size) : _utilities{ std::make_unique<GameUtility>(*this) }, _size{ size } {
        // start up SDL here
        if(SDL_Init(SDL_INIT_EVERYTHING) < 0) {
            throw "Initialization error1";
        }
        if(IMG_Init(IMG_INIT_PNG) ^ IMG_INIT_PNG) {
            throw "Image initialization error";
        }
        SDL_Window * win = SDL_CreateWindow(title.c_str(), SDL_WINDOWPOS_UNDEFINED, SDL_WINDOWPOS_UNDEFINED, size.w, size.h, SDL_WINDOW_SHOWN);
        if(win == nullptr) {
            throw "Couldn't open a window";
        }
        _window = std::unique_ptr<SDL_Window, decltype(& SDL_DestroyWindow)>(win, SDL_DestroyWindow);
        SDL_Renderer * ren = SDL_CreateRenderer(win, -1, SDL_RENDERER_ACCELERATED | SDL_RENDERER_PRESENTVSYNC);
        if(ren == nullptr) {
            throw "Couldn't create renderer";
        }
        _renderer = std::unique_ptr<SDL_Renderer, decltype(& SDL_DestroyRenderer)>(ren, SDL_DestroyRenderer);
        _draw = std::make_unique<Draw>(*_renderer);
    }

    Engine::~Engine() {
        SDL_Quit();
    }

    void Engine::proc(const Event& event) {
        if(!_objects.empty()) {
            for(auto &o : _objects.back()) {
                o->proc(event);
            }
        }
        if(!_rooms.empty()) {
            _rooms.back()->proc(event);
        }
    }

    void Engine::start() {}

    void Engine::step() {
        proc(Event{Event::StepStart});
        for(auto event : _input) {
            if(event.type == Event::Quit) {
                _ended = true;
            }
            proc(event);
        }
        proc(Event{Event::Step});
        proc(Event{Event::StepEnd});
    }

    void Engine::draw() {
        // TODO: make overlay drawing work
        if(!_objects.empty()) {
            for(auto &o : _objects.back()) {
                if(auto d = dynamic_cast<const Drawable *>(o.get())) {
                    d->draw(*_draw);
                }
            }
        }
        if(!_rooms.empty()) {
            _rooms.back()->draw(*_draw);
        }
        _draw->render();
    }

    void Engine::end() {
        if(!_rooms.empty()) {
            _rooms.back()->end();
        }
    }

    int Engine::run() {
        do {
            start();
            if(_rooms.empty()) { throw "You must go to a room when the game starts..."; }
            _restart = false;
            _ended = false;
            proc(Event{Event::GameStart});
            do {
                step();
                draw();
            } while(!_ended);
            proc(Event{Event::GameEnd});
            end();
        } while(_restart);
        return 0;
    }

    void Engine::destroy(Object & who) {
        for(auto i = _objects.back().begin(); i != _objects.back().end(); ++i) {
            if(i->get() == &who) {
                _objects.back().erase(i);
                return;
            }
        }
    }

    GameUtility & Engine::util() {
        return *_utilities.get();
    }
};
