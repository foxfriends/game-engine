#include "sound.h"
#include "playing-sound.h"

namespace Game {
    Sound::Sound(const std::string & path) {
        if(path != "") {
            Mix_Chunk * chunk = Mix_LoadWAV(path.c_str());
            if(chunk == NULL) {
                throw "Unable to load sound " + path;
            }
            _chunk = std::unique_ptr<Mix_Chunk, decltype(& Mix_FreeChunk)>(chunk, Mix_FreeChunk);
        }
    }

    PlayingSound Sound::play() {
        return PlayingSound(*this);
    }
}
