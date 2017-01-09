#include "music.h"

namespace Game {
    Music::Music(const std::string & path) {
        Mix_Music * music = Mix_LoadMUS(path.c_str());
        if(music == NULL) {
            throw "Unable to load music " + path;
        }
        _music = std::unique_ptr<Mix_Music, decltype(& Mix_FreeMusic)>(music, Mix_FreeMusic);
    }

    void Music::play() {
        Mix_PlayMusic(_music.get(), -1);
    }

    void Music::stop() {
        Mix_HaltMusic();
    }

    float Music::volume() const {
        return static_cast<float>(Mix_VolumeMusic(-1)) / MIX_MAX_VOLUME;
    }

    void Music::volume(float amt) {
        Mix_VolumeMusic(static_cast<int>(amt * MIX_MAX_VOLUME));
    }
}
