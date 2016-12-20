#include "tilemap.h"
#include "texture-manager.h"

#include <cmath>
#include <fstream>
#include <sstream>
#include <json.hpp>
using nlohmann::json;

namespace Game {
    TileMap::TileMap(const std::string & file, TextureManager & texture) : _tm{ texture } {
        std::ifstream fin{ file };
        json data;
        fin >> data;
        _tw = data["meta"]["tw"];
        _th = data["meta"]["th"];

        json & pages = data["meta"]["pages"];
        for(unsigned int i = 0; i < pages.size(); ++i) {
            json & obj = pages[i];
            _texture_pages.emplace_back(obj["name"].get<std::string>());
            _indexmap.emplace_back(obj["min"], obj["max"]);
        }

        for(const std::string & row : data["collisions"]) {
            _collisions.emplace_back();
            for(const char & c : row) {
                _collisions.back().emplace_back(c == '1');
            }
        }
        json images = data["images"];
        for(auto layer = images.begin(); layer != images.end(); ++layer) {
            std::istringstream sin{ layer.key() };
            int depth;
            sin >> depth;
            _images[depth] = layer.value().get<std::vector<std::vector<int>>>();
        }
    }

    const std::vector<std::string> & TileMap::textures() const {
        return _texture_pages;
    }

    Dimension TileMap::size() const {
        return { static_cast<int>(_collisions[0].size()) * _tw, static_cast<int>(_collisions.size()) * _th };
    }

    bool TileMap::collides(const Rectangle & where) const {
        auto s = size();
        const int
            w = s.w,
            h = s.h,
            l = std::max(0, where.x / _tw),
            t = std::max(0, where.y / _th),
            r = std::min(static_cast<int>(std::ceil((where.x + where.w) / _tw)), w),
            b = std::min(static_cast<int>(std::ceil((where.y + where.h) / _th)), h);
        for(int i = t; i < b; ++i) {
            for(int j = l; j < r; ++j) {
                if(_collisions[i][j]) {
                    return true;
                }
            }
        }
        return false;
    }

    std::pair<TexturePage *, Rectangle> TileMap::tile_from_index(int n) const  {
        Rectangle where{ 0, 0, _tw, _th };
        int ind = -1;
        for(unsigned int i = 0; i < _indexmap.size(); ++i) {
            auto & range = _indexmap[i];
            if(range.first <= n && range.second > n) {
                n -= range.first;
                ind = i;
                break;
            }
        }
        if(ind == -1) {
            return {nullptr, where};
        }
        auto & texture = _tm.texture(_texture_pages[ind]);
        auto s = texture.size();
        where.x = _tw * (n % (s.w / _tw));
        where.y = _th * (n / (s.w / _tw));
        return {&texture, where};
    }

    void TileMap::render(SDL_Renderer * ren) {
        auto s = size();
        Rectangle where{0, 0, _tw, _th};
        for(auto layer = _images.begin(); layer != _images.end(); ++layer) {
            where.x = where.y = 0;
            std::unique_ptr<SDL_Texture, decltype(& SDL_DestroyTexture)> image {
                SDL_CreateTexture(ren, SDL_PIXELFORMAT_RGBA8888, SDL_TEXTUREACCESS_TARGET, s.w, s.h),
                SDL_DestroyTexture
            };
            SDL_SetRenderTarget(ren, image.get());
            SDL_SetTextureBlendMode(image.get(), SDL_BLENDMODE_BLEND);
            SDL_SetRenderDrawColor(ren, 0, 0, 0, 0);
            SDL_RenderClear(ren);
            for(auto & row : layer->second) {
                for(int col : row) {
                    auto tex = tile_from_index(col);
                    if(tex.first) {
                        SDL_Rect from = tex.second, to = where;
                        SDL_RenderCopy(ren, *tex.first, &from, &to);
                    }
                    where.x += _tw;
                }
                where.x = 0;
                where.y += _th;
            }
            _layers.emplace(layer->first, std::move( image ));
        }

        SDL_SetRenderTarget(ren, nullptr);
    }

    void TileMap::draw(Draw & draw) const {
        auto s = size();
        Rectangle src{0, 0, s.w, s.h};
        for(auto & layer : _layers) {
            draw.image(layer.second.get(), src, src, layer.first);
        }
    }
}
