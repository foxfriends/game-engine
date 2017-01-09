#include "engine.h"
#include "game-utility.h"
#include "drawable.h"
#include "object.h"
#include "event.h"
#include <fstream>
#include <json.hpp>
using nlohmann::json;

namespace Game {
    Engine::Engine(const std::string & title, const Dimension & size, const std::string & cfg) : _utilities{ std::make_unique<GameUtility>(*this) }, _size{ size } {
        // start up SDL here
        if(SDL_Init(SDL_INIT_EVERYTHING) < 0) {
            throw "Initialization error";
        }
        if(IMG_Init(IMG_INIT_PNG) ^ IMG_INIT_PNG) {
            throw "Image initialization error";
        }
        if(TTF_Init() < 0) {
            throw "TTF initialization error";
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
        _draw = std::make_unique<Draw>(*_renderer, size);
        if(cfg != "") {
            std::string resdir = cfg.substr(0, cfg.rfind('/') + 1);
            if(resdir == cfg) { resdir = ""; }
            std::ifstream fin{ cfg };
            json config;
            try {
                fin >> config;
            } catch( ... ) {
                throw "Invalid JSON from " + cfg;
            }
            // TODO: robust file resolution, URL cleaning
            for(auto font = config["fonts"].begin(); font != config["fonts"].end(); ++font) {
                load_font(font.key(), resdir + font.value()[0].get<std::string>(), font.value()[1].get<int>());
            }
            std::map<std::string, std::string> sources;
            for(auto tp = config["texture-pages"].begin(); tp != config["texture-pages"].end(); ++tp) {
                sources[tp.key()] = resdir + tp.value().get<std::string>();
            }
            _texture = std::make_unique<TextureManager>(*_renderer, sources);
            for(auto tm = config["tile-maps"].begin(); tm != config["tile-maps"].end(); ++tm) {
                _tilemaps[tm.key()] = resdir + tm.value().get<std::string>();
            }
            for(auto sound = config["sounds"].begin(); sound != config["sounds"].end(); ++sound) {
                // TODO: do something with these
            }
        }
    }

    Engine::~Engine() {
        SDL_Quit();
    }

    void Engine::load_font(const std::string & name, const std::string & path, int size) {
        _draw->load_font(name, path, size);
    }

    void Engine::close_font(const std::string & name) {
        _draw->close_font(name);
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
        _draw->clear();
        for(unsigned int i = 0; i < _rooms.size(); ++i) {
            _draw->view(_views.at(i));
            for(auto &o : _objects.at(i)) {
                if(auto d = dynamic_cast<const Drawable *>(o.get())) {
                    d->draw(*_draw);
                }
            }
            _rooms.at(i)->draw(*_draw);
            _draw->render();
        }
        _draw->present();
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
                _delete_rooms.clear();
                _delete_objects.clear();
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
        return *_utilities;
    }

    TextureManager & Engine::texture() const {
        return *_texture;
    }

    SDL_Renderer * Engine::renderer() {
        return _renderer.get();
    }

    std::string Engine::tilemap(const std::string & name) const {
        if(_tilemaps.count(name) == 0) {
            throw "No tilemap named " + name + " exists";
        }
        return _tilemaps.at(name);
    }
}
