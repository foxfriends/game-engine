#include "input.h"

namespace Game {
    Input::iterator Input::begin() {
        return ++iterator();
    }

    Input::iterator Input::end() {
        return iterator();
    }

    Input::iterator::iterator() : _event{ Event::None } {}
    Input::iterator::iterator(const SDL_Event && event) {
        // TODO: actually parse SDL events
        switch(event.type) {
        case SDL_KEYDOWN:
            _event.type = Event::KeyDown;
            _event.data = { event.key.keysym.scancode };
            break;
        case SDL_KEYUP:
            _event.type = Event::KeyUp;
            _event.data = { event.key.keysym.scancode };
            break;
        case SDL_MOUSEBUTTONDOWN:
            _event.type = Event::MouseDown;
            _event.data = { event.button.button };
            break;
        case SDL_MOUSEBUTTONUP:
            _event.type = Event::MouseUp;
            _event.data = { event.button.button };
            break;
        case SDL_MOUSEMOTION:
            // TODO: implement
            break;
        case SDL_QUIT:
            _event.type = Event::Quit;
            _event.data = {};
            break;
        }
    }
    Input::iterator::iterator(const iterator & o) {
        _event = o._event;
    }

    Input::iterator & Input::iterator::operator = (const iterator & o) {
        auto c = iterator(o);
        std::swap(_event, c._event);
        return *this;
    }

    bool Input::iterator::operator == (const iterator & o) const {
        if(_event.type != o._event.type) return false;
        if(_event.data.size() != o._event.data.size()) return false;
        for(unsigned int i = 0; i < _event.data.size(); ++i) {
            if(_event.data[i] != o._event.data[i]) return false;
        }
        return true;
    }

    bool Input::iterator::operator != (const iterator & o) const {
        return !(*this == o);
    }

    Input::iterator & Input::iterator::operator ++ () {
        SDL_Event event;
        if(SDL_PollEvent(&event)) {
            iterator c = iterator(std::move(event));
            swap(*this, c);
        } else {
            _event = Event{ Event::None };
        }
        return *this;
    }

    Event Input::iterator::operator * () const {
        return _event;
    }
}
