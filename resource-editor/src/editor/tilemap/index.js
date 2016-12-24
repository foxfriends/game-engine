'use strict';

import fs from 'fs';
import path from 'path';
import { saveTileMap as save, rename, getProject } from '../project';
import { remote } from 'electron';

let data = {}, canvas = null, ctx = null;
let file = '', name = '', oldname = '', saved = true;
let selectedPage = null, selectedLayer = null;
let width = 300, height = 150;
let textures = {};
let layers = {};
let back = () => {};

async function refresh() {
  document.querySelector('[name="name"]').value = name;
  document.querySelector('[name="tw"]').value = data.meta.tw || 0;
  document.querySelector('[name="th"]').value = data.meta.th || 0;
  document.querySelector('[name="width"]').value = width;
  document.querySelector('[name="height"]').value = height;
  const pagelist = document.querySelector('#texture-pages');
  Array.prototype.forEach.call(pagelist.querySelectorAll('li:not(#tp-adder)'), (li) => {
    li.parentNode.removeChild(li);
  });
  const waiting = [];
  data.meta.pages.forEach((page, index) => {
    const li = document.createElement('LI');
    li.textContent = page.name;
    li.classList.add('clickable');
    if(page === selectedPage) {
      li.classList.add('selected');
    }
    if(!textures[page.name]) {
      textures[page.name] = new Image();
      const { image } = JSON.parse(fs.readFileSync(path.resolve(path.dirname(getProject().path), getProject().data['texture-pages'][page.name])));
      textures[page.name].src = path.resolve(path.dirname(getProject().path), image);
      waiting.push(new Promise((resolve, reject) => textures[page.name].addEventListener('load', () => resolve())));
    }
    li.addEventListener('click', () => {
      if(selectedPage === page) {
        if(remote.dialog.showMessageBox(remote.getCurrentWindow(), { message: `Remove ${page.name}?`, buttons: ['Cancel', 'Ok'] })) {
          for(let layer of Object.keys(data.images)) {
            for(let row of data.images[layer]) {
              row.map(x => page.min <= x && page.max < x ? -1 : x);
            }
          }
          delete data.meta.pages[index];
          delete textures[page.name];
          saved = false;
        }
      } else {
        selectedPage = page;
      }
      refresh();
    });
    pagelist.appendChild(li);
  });
  await Promise.all(waiting);
  const layerlist = document.querySelector('#layers');
  Array.prototype.forEach.call(layerlist.querySelectorAll('li:not(#all)'), (li) => {
    li.parentNode.removeChild(li);
  });
  for(let depth of Object.keys(data.images).map(x => +x)) {
    const li = document.createElement('LI');
    li.textContent = depth;
    li.classList.add('clickable');
    if(depth === selectedLayer) {
      li.classList.add('selected');
    }
    li.addEventListener('click', () => {
      if(selectedLayer === depth) {
        if(remote.dialog.showMessageBox(remote.getCurrentWindow(), { message: `Delete layer ${depth}?`, buttons: ['Cancel', 'Ok'] })) {
          delete data.images[depth];
          delete layers[depth];
          saved = false;
        }
      } else {
        selectedLayer = depth;
      }
      refresh();
    });
    layerlist.appendChild(li);
    if(!layers[depth]) {
      layers[depth] = document.createElement('CANVAS');
      layers[depth].width = width;
      layers[depth].height = height;
      const image = data.images[depth];
      const c = layers[depth].getContext('2d');
      for(let i = 0; i < image.length; ++i) {
        for(let j = 0; j < image[i].length; ++j) {
          let n = image[i][j];
          const [ p ] = data.meta.pages.filter(page => page.min <= n && n < page.max);
          if(!p) { continue; }
          n -= p.min;
          const [ xx, yy ] = [
            data.meta.tw * (n % (textures[p.name].width / data.meta.tw)),
            data.meta.th * Math.floor(n / (textures[p.name].width / data.meta.tw))
          ];
          c.drawImage(textures[p.name], xx, yy, data.meta.tw, data.meta.th, j * data.meta.tw, i * data.meta.th, data.meta.tw, data.meta.th);
        }
      }
    }
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = width;
  canvas.height = height;
  for(let layer of Object.keys(layers).sort((a, b) => a - b)) {
    if(selectedLayer == null || selectedLayer == layer) {
      ctx.drawImage(layers[layer], 0, 0);
    }
  }
  if(document.querySelector('#collision').checked) {
    ctx.fillStyle = 'black';
    ctx.globalAlpha = 0.7;
    let [x, y] = [0, 0];
    for(let row of data.collisions) {
      x = 0;
      for(let col of row) {
        if(+col === 1) {
          ctx.fillRect(x, y, data.meta.tw, data.meta.th);
        }
        x += data.meta.tw;
      }
      y += data.meta.th;
    }
  }
}

function keydown(event) {
  if(event.ctrlKey) {
    switch(event.key) {
      case 's':
        if(name !== oldname) {
          rename(oldname, name);
          oldname = name;
        }
        save(name, file, data);
        saved = true;
        break;
      case 'b':
        if(!saved) {
          switch(remote.dialog.showMessageBox(remote.getCurrentWindow(), { message: `Save unsaved work?`, buttons: ['Cancel', 'No', 'Yes'] })) {
            case 2:
              keydown({ctrlKey: true, key: 's'}); // emulate save
              break;
            case 0:
              return;
          }
        }
        back();
        break;
    }
  }
}

function clear() {
  window.removeEventListener('keydown', keydown);
}

function init(b, f, n) {
  saved = true;
  back = b;
  file = f || '';
  name = oldname = n || '';
  layers = {};
  textures = {};
  selectedPage = selectedLayer = null;
  canvas = page.querySelector('#editor');
  ctx = canvas.getContext('2d');
  data = {
    meta: {
      tw: 32,
      th: 32,
      pages: []
    },
    images: {},
    collisions: []
  };
  if(file) {
    try {
      data = JSON.parse(fs.readFileSync(file));
      width = data.meta.tw * data.collisions[0].length;
      height = data.meta.th * data.collisions.length;
    } catch(error) {
      console.error(error);
      remote.dialog.showErrorBox('Error', 'Not a valid tile map');
    }
  }
  window.addEventListener('keydown', keydown);
  document.querySelector('#all').addEventListener('click', () => { selectedLayer = null; refresh(); })
  Array.prototype.forEach.call(document.querySelectorAll('input'), (input) => {
    input.addEventListener('input', () => {
      saved = false;
    });
  });
  document.querySelector('[name="name"]').addEventListener('input', function() {
    name = this.value;
  });
  document.querySelector('[name="width"]').addEventListener('input', function() {
    width = this.value;
    refresh();
  });
  document.querySelector('[name="height"]').addEventListener('input', function() {
    height = this.value;
    refresh();
  });
  document.querySelector('#collision').addEventListener('click', refresh);
  refresh();
  return clear;
}

export { init };
