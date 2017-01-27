#ifndef __GAME_UTILITY_H__
#define __GAME_UTILITY_H__

#include "struct.h"
#include "room.h"
#include "tilemap.h"

namespace Game {
    class Collider;
    class Engine;
    class Object;
    class Sound;

    class GameUtility {
        Engine &_eng;
    public:
        GameUtility(Engine &eng);

        // viewport
        Rectangle view() const;
        void view(const Rectangle & v, bool constrain = true);
        void view(const Position & v, bool constrain = true);

        // room utilities
        template<typename T>
        void room_goto();
        template<typename T>
        void room_overlay();
        void room_close();

        // input
        bool mousestate(int button);
        bool keystate(int key);

        // game state
        void end();
        void restart();

        // sound / music
        Sound & sound(const std::string & name);
        void music(const std::string & name);
        void stop_music();

        // objects
        template<typename T, typename ... Args>
        T * spawn(Args ... args);

        template<typename T>
        std::vector<T *> find();

        void destroy(Object & who);
        template<typename T>
        void destroy();

        // any (including room)
        bool collides(const Rectangle & where);
        // specific collider
        template<typename T>
        T * collides(const Rectangle & where);
        // a specific instance
        Collider * collides(const Rectangle & where, Collider & who);
        // the room only
        bool collides_room(const Rectangle & where);

        // sprites (is this necessary? should it be internal?)
        std::unique_ptr<Sprite> make_sprite(const std::string & name);
    };

    template<typename T>
    void GameUtility::room_goto() {
        std::unique_ptr<Room> rm = std::make_unique<T>();
        rm->attach(&_eng);
        auto d = _eng.size();
        Rectangle newview{ 0, 0, d.w, d.h };
        int prevId = -1, nextId = -1;
        if(!_eng._rooms.empty()) {
            prevId = _eng._rooms.back()->id;
            nextId = rm->id;
            // end the previous room
            _eng.proc(Event{ Event::RoomEnd, { prevId, nextId } });
            _eng._rooms.back()->end();
            _eng._delete_rooms.emplace_back(std::move( _eng._rooms.back() ));
            _eng._rooms.back() = std::move( rm );
            _eng._views.back() = newview;
        } else {
            _eng._rooms.emplace_back(std::move( rm ));
            _eng._objects.emplace_back();
            _eng._views.emplace_back(newview);
        }

        // TODO: figure out asynchronous loading
        //       is this something to do with threads??

        _eng._rooms.back()->load();
        _eng.proc(Event{ Event::RoomLoad, { prevId, nextId } });
        // start the next room
        _eng._rooms.back()->start();
        _eng.proc(Event{ Event::RoomStart, { prevId, _eng._rooms.back()->id } });
    }

    template<typename T>
    void GameUtility::room_overlay() {
        std::unique_ptr<Room> rm = std::make_unique<T>();
        rm->attach(&_eng);
        auto s = rm->size();
        _eng._rooms.emplace_back(std::move( rm ));
        _eng._objects.emplace_back();
        _eng._views.emplace_back(0, 0, s.w, s.h);
        _eng._rooms.back()->start();
        _eng.proc(Event{ Event::RoomStart, { -1, _eng._rooms.back()->id } });
    }

    template<typename T, typename ... Args>
    T * GameUtility::spawn(Args ... args) {
        return _eng.spawn<T>(args ...);
    }

    template<typename T>
    std::vector<T *> GameUtility::find() {
        return _eng._rooms.back()->find<T>();
    }
    template<typename T>
    void GameUtility::destroy() {
        return _eng._rooms.back()->destroy<T>();
    }

    template<typename T>
    T * GameUtility::collides(const Rectangle &where) {
        auto room = _eng._rooms.back()->collides<T>(where);
        if(room) {
            return room;
        } else {
            for(auto &o : _eng._objects.back()) {
                if(auto b = dynamic_cast<T *>(o.get())) {
                    if(b->collides(where)) {
                        return b;
                    }
                }
            }
        }
        return nullptr;
    }
}
#endif
