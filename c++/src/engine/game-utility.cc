#include "game-utility.h"
#include "collider.h"
#include "sprite.h"

namespace Game {
    GameUtility::GameUtility(Engine & eng) : _eng{ eng } {}

    Rectangle & GameUtility::view() const {
        return _eng._views.back();
    }

    void GameUtility::view(const Position & v, bool constrain) {
        auto s = _eng._views.back();
        view(Rectangle{ v.x - s.w / 2, v.y - s.h / 2, s.w, s.h }, constrain);
    }

    void GameUtility::view(const Rectangle & v, bool constrain) {
        const Dimension &r = _eng._rooms.back()->size();
        Rectangle view = v;
        if(constrain) {
            if(view.w > r.w) {
                view.x = (r.w - view.w) / 2;
            } else if(view.x < 0) {
                view.x = 0;
            } else if(view.x + view.w > r.w) {
                view.x = r.w - view.w;
            }
            if(view.h > r.h) {
                view.y = (r.h - view.h) / 2;
            } else if(view.y < 0) {
                view.y = 0;
            } else if(view.y + view.h > r.h) {
                view.y = r.h - view.h;
            }
        }
        _eng._views.back() = view;
    }

    void GameUtility::room_close() {
        _eng.proc(Event{ Event::RoomEnd, { _eng._rooms.back()->id, -1} });
        _eng._rooms.back()->end();
        _eng._rooms.pop_back();
        _eng._objects.pop_back();
        _eng._views.pop_back();
        if(_eng._rooms.empty()) {
            // TODO: error type?
            throw "You closed the last room... please don't do that";
        }
    }

    void GameUtility::end() { _eng._ended = true; }
    void GameUtility::restart() { end(); _eng._restart = true; }


    bool GameUtility::mousestate(int button) {
        return _eng._input.mousestate(button);
    }

    bool GameUtility::keystate(int key) {
        return _eng._input.keystate(key);
    }

    void GameUtility::destroy(Object & who) {
        _eng._rooms[0]->destroy(who);
    }

    bool GameUtility::collides(const Rectangle & where) const {
        return collides_room(where) || collides<Collider>(where);
    }

    bool GameUtility::collides(const Rectangle & where, const Collider & who) const {
        return who.collides(where);
    }

    bool GameUtility::collides_room(const Rectangle & where) const {
        return _eng._rooms.back()->collides(where);
    }

    std::unique_ptr<Sprite> GameUtility::make_sprite(const std::string & name) {
        return _eng._texture->sprite(name);
    }
}
