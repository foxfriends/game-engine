#ifndef __GAME_ENGINE_H__
#define __GAME_ENGINE_H__

#include <SDL.h>
#include <SDL_image.h>
#include <SDL_mixer.h>
#include <memory>
#include <vector>

#include "draw.h"
#include "input.h"
#include "texture-manager.h"
#include "sound-manager.h"
#include "object.h"

namespace Game {
    class Room;
    class GameUtility;
    struct Event;

    class Engine {
        friend class GameUtility;
        std::unique_ptr<Draw> _draw;
        Input _input;
        std::unique_ptr<TextureManager> _texture;
        std::unique_ptr<SoundManager> _sound;
        std::vector<std::unique_ptr<Room>> _rooms;
        std::vector<std::vector<std::unique_ptr<Object>>> _objects;
        std::vector<std::unique_ptr<Room>> _delete_rooms;
        std::vector<std::vector<std::unique_ptr<Object>>> _delete_objects;
        std::vector<Rectangle> _views;
        std::unique_ptr<GameUtility> _utilities;
        std::map<std::string, std::string> _tilemaps;

        typedef void (WindowDeleter) (SDL_Window *);
        std::unique_ptr<SDL_Window, WindowDeleter *> _window{ nullptr, SDL_DestroyWindow };
        typedef void (RendererDeleter) (SDL_Renderer *);
        std::unique_ptr<SDL_Renderer, RendererDeleter *> _renderer{ nullptr, SDL_DestroyRenderer };

        bool _ended, _restart;
        Dimension _size;
        // trigger an event for the whole game
        void proc(const Event& event);
        // set up the game resources
        virtual void start();
        // process the event queue
        void step();
        // redraw the display
        void draw();
        // clean up resources
        virtual void end();
    protected:
        Engine(const std::string & title, const Dimension & size, const std::string & cfg = "");

        // load a TTF into the game
        void load_font(const std::string & name, const std::string & path, int size);
        // remove a font from memory
        void close_font(const std::string & name);
    public:
        virtual ~Engine() = 0;
        // run the game
        int run();

        // current window size
        inline const Dimension & size() const { return _size; }

        // spawn a new object in the room
        template<typename T, typename ... Args>
        void spawn(Args ...args);

        template<typename T>
        std::vector<T *> find() const;
        // destroy an object
        void destroy(Object & who);
        // destroy all objects of a type
        template<typename T>
        void destroy();

        GameUtility & util();

        TextureManager & texture() const;
        SoundManager & sound() const;
        SDL_Renderer * renderer();
        std::string tilemap(const std::string & name) const;
    };

    template<typename T, typename ... Args>
    void Engine::spawn(Args ... args) {
        auto obj = std::make_unique<T>(args ...);
        obj->attach(this);
        obj->init();
        _objects.back().emplace_back(std::move( obj ));

    }

    template<typename T>
    std::vector<T *> Engine::find() const {
        std::vector<T *> found;
        for(auto & o : _objects.back()) {
            if(auto t = dynamic_cast<T *>(o.get())) {
                found.emplace_back(t);
            }
        }
        return found;
    }

    template<typename T>
    void Engine::destroy() {
        for(auto i = _objects.back().begin(); i != _objects.back().end();) {
            if(dynamic_cast<T *>(i->get())) {
                i = _objects.back().erase(i);
            } else {
                ++i;
            }
        }
    }
}


#endif
