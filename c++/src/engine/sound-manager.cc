#include "sound-manager.h"
#include "sound.h"

namespace Game {
    SoundManager::SoundManager(const std::map<std::string, std::string> & sound_sources, const std::map<std::string, std::string> & music_sources)
        : _s_sources{ sound_sources }, _m_sources{ music_sources } {}

    Sound & SoundManager::sound(const std::string & name) {
        return *_sounds.at(name);
    }

    void SoundManager::music(const std::string & name) {
        if(_current_music == name) { return; }
        if(_current_music != "") {
            _music[_current_music]->stop();
        }
        _current_music = name;
        _music[_current_music]->play();
    }

    void SoundManager::stop_music() {
        if(_current_music != "") {
            _music[_current_music]->stop();
        }
        _current_music = "";
    }

    void SoundManager::load_music(const std::vector<std::string> & names) {
        for(auto & name : names) {
            if(!_music[name]) {
                _music[name] = std::make_unique<Music>(_m_sources[name]);
            }
            ++_m_references[name];
        }
    }
    void SoundManager::load_sound(const std::vector<std::string> & names) {
        for(auto & name : names) {
            if(!_sounds[name]) {
                _sounds[name] = std::make_unique<Sound>(_s_sources[name]);
            }
            ++_s_references[name];
        }
    }
    void SoundManager::purge_music(const std::vector<std::string> & names) {
        for(auto & name : names) {
            if(_music[name]) {
                if(!--_m_references[name]) {
                    if(name == _current_music) {
                        stop_music();
                    }
                    _music.erase(name);
                }
            }
        }
    }
    void SoundManager::purge_sound(const std::vector<std::string> & names) {
        for(auto & name : names) {
            if(_sounds[name]) {
                if(!--_s_references[name]) {
                    _sounds.erase(name);
                }
            }
        }
    }
}
