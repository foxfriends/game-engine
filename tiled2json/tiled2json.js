#! /home/cam/code/nvm/versions/node/v7.2.1/bin/node
'use strict';

const fs = require('fs');
const generate = require('./generate');
const promisify = require('./promisify');
const parser = require('xml2json');

generate(function*(node, script, tiled, json) {
  const xml = parser.toJson(yield promisify(fs.readFile)(tiled), {
    object: true,
    coerce: true,
    arrayNotation: true
  });
  const {
    map: [
      {
        width, height,
        tilewidth: tw,
        tileheight: th,
        tileset: tilesets,
        layer: layers
      }
    ]
  } = xml;
  const pages = tilesets.map(({ name, firstgid: min, tilecount }) => ({ name, min, max: min + tilecount }));
  const images = {};
  for(let { name, data: [{ $t: data }] } of layers) {
    images[name] = data.split(',\n').map(r => r.split(',').map(x => +x));
  }
  const collisions = images.collisions
                    ? images.collisions.map(r => r.map(x => x ? '1' : '0').join(''))
                    : (() => {
                      let s = '';
                      for(let j = 0; j < width; ++j) {
                        s += '0';
                      }
                      const v = [];
                      for(let i = 0; i < height; ++i) {
                        v.push(s);
                      }
                      return v;
                    }) ();
  delete images.collisions;
  yield promisify(fs.writeFile)(json, JSON.stringify({
    meta: {
      tw, th, pages
    },
    images,
    collisions
  }));
}, null, ...process.argv);
