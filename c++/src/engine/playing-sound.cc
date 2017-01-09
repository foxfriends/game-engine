#include "playing-sound.h"
#include "sound.h"

namespace Game {
    PlayingSound::PlayingSound(const Sound & sound) : _sound{ sound } {
        _channel = Mix_PlayChannel(-1, _sound._chunk.get(), 0);
        Mix_Volume(_channel, MIX_MAX_VOLUME);
    }

    void PlayingSound::stop() {
        Mix_HaltChannel(_channel);
    }

    float PlayingSound::volume() const {
        return static_cast<float>(Mix_Volume(_channel, -1)) / MIX_MAX_VOLUME;
    }

    void PlayingSound::volume(float amt) {
        Mix_Volume(_channel, static_cast<int>(amt * MIX_MAX_VOLUME));
    }
}
