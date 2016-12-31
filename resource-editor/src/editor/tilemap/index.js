'use strict';

import fs from 'fs';
import path from 'path';
import { saveTileMap as save, renameTileMap as rename, getProject } from '../project';
import { remote } from 'electron';

let data = {}, canvas = null, ctx = null;
let file = '', name = '', oldname = '', saved = true;
let selectedPage = null, selectedLayer = null, tileIndex = -1;
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
  const collisions = [];
  for(let i = 0; i < height / data.meta.th; ++i) {
    collisions[i] = data.collisions[i] || '';
    while(collisions[i].length !== width / data.meta.tw) {
      collisions[i] += '0';
    }
  }
  data.collisions = collisions;
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
          selectedPage = null;
        }
      } else {
        selectedPage = page;
        tileIndex = page.min;
      }
      refresh();
    });
    pagelist.appendChild(li);
  });
  await Promise.all(waiting);
  const layerlist = document.querySelector('#layers');
  Array.prototype.forEach.call(layerlist.querySelectorAll('li:not(#all):not(#layer-adder)'), (li) => {
    li.parentNode.removeChild(li);
  });
  for(let depth of Object.keys(data.images).map(x => +x).sort((a, b) => b - a)) {
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
          selectedLayer = null;
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
  const res = document.querySelector('#res-view');
  const resctx = res.getContext('2d');
  resctx.clearRect(0, 0, res.width, res.height);
  if(selectedPage) {
    const img = textures[selectedPage.name];
    resctx.strokeStyle = "black";
    let [xx, yy] = [(res.width - data.meta.tw) / 2, (res.height - data.meta.th) / 2];
    resctx.strokeRect(xx, yy, data.meta.tw, data.meta.th);
    const ti = tileIndex - selectedPage.min;
    xx -= ti % Math.floor(img.width / data.meta.tw) * data.meta.tw;
    yy -= Math.floor(ti / Math.floor(img.width / data.meta.tw)) * data.meta.th;
    resctx.drawImage(img, xx, yy);
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

function mousedown(event) {
  const { clientX: xx, clientY: yy } = event;
  let el = document.querySelector('main');
  let { left, top } = el.getBoundingClientRect();
  let [x, y] = [
    Math.floor((xx - left + el.scrollLeft) / data.meta.tw),
    Math.floor((yy - top + el.scrollTop) / data.meta.th)
  ];
  if(x >= 0 && y >= 0 && x < data.collisions[0].length && y < data.collisions.length && selectedLayer !== null && selectedPage !== null) {
    // in bounds of the room
    switch(event.button) {
      case 0: // HACK: this whole thing man am I even trying??
        if(event.shiftKey) {
          const i = data.images[selectedLayer][y][x];
          if(i >= selectedPage.min && i < selectedPage.max) {
            tileIndex = i;
          }
        } else {
          delete layers[selectedLayer];
          data.images[selectedLayer][y][x] = tileIndex;
          refresh();
        }
        break;
      case 2:
        delete layers[selectedLayer];
        data.images[selectedLayer][y][x] = -1;
        refresh();
        break;
    }
    return;
  }
  const cv = document.querySelector('#res-view');
  const box = cv.getBoundingClientRect();
  left = box.left;
  top = box.top;
  [x, y] = [
    Math.floor((xx - left) / data.meta.tw),
    Math.floor((yy - top) / data.meta.th)
  ];
  if(x >= 0 && y >= 0 && x < Math.ceil(cv.width / data.meta.tw)  && y < Math.ceil(cv.height / data.meta.th) && selectedPage !== null) {
    // in bounds of tile selector
    const xoffset = (tileIndex - selectedPage.min) % Math.floor(textures[selectedPage.name].width / data.meta.tw) - Math.floor(cv.width / data.meta.tw / 2);
    const yoffset = Math.floor((tileIndex - selectedPage.min) / Math.floor(textures[selectedPage.name].width / data.meta.tw)) - Math.floor(cv.height / data.meta.th / 2);
    x += xoffset;
    y += yoffset;
    if(x >= 0 && x < textures[selectedPage.name].width / data.meta.tw &&
       y >= 0 && y < textures[selectedPage.name].height / data.meta.th) {
      const ti  = selectedPage.min
                + x
                + y * Math.floor(textures[selectedPage.name].width / data.meta.tw);
      if(ti >= selectedPage.min && ti < selectedPage.max) {
        tileIndex = ti;
        refresh();
      }
    }
  }
}

function clear() {
  window.removeEventListener('keydown', keydown);
  window.removeEventListener('mousedown', mousedown);
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
    collisions: [
      '0000000000',
      '0000000000',
      '0000000000',
      '0000000000',
      '0000000000'
    ]
  };
  width = 320;
  height = 160;
  if(file) {
    try {
      data = JSON.parse(fs.readFileSync(file));
      width = data.meta.tw * data.collisions[0].length;
      height = data.meta.th * data.collisions.length;
    } catch(error) {
      remote.dialog.showErrorBox('Error', 'Not a valid tile map');
    }
  }
  window.addEventListener('keydown', keydown);
  window.addEventListener('mousedown', mousedown);
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
    if(!isNaN(this.value) && this.value !== 0) {
      width = this.value;
      refresh();
    }
  });
  document.querySelector('[name="height"]').addEventListener('input', function() {
    if(!isNaN(this.value) && this.value !== 0) {
      height = this.value;
      refresh();
    }
  });
  document.querySelector('[name="tw"]').addEventListener('input', function() {
    if(!isNaN(this.value) && this.value !== 0) {
      data.meta.tw = this.value;
      refresh();
    }
  });
  document.querySelector('[name="th"]').addEventListener('input', function() {
    if(!isNaN(this.value) && this.value !== 0) {
      data.meta.th = this.value;
      refresh();
    }
  });
  document.querySelector('[name="tp-add"]').addEventListener('keydown', function(event) {
    if(event.key === 'Enter') {
      const name = this.value;
      const pages = getProject().data["texture-pages"];
      if(pages[name]) {
        const { image } = JSON.parse(fs.readFileSync(path.resolve(path.dirname(getProject().path), pages[name])));
        textures[name] = new Image();
        textures[name].src = path.resolve(path.dirname(getProject().path), image);
        let min = 0;
        for(let page of data.meta.pages) {
          min = Math.max(min, page.max);
        }
        textures[name].addEventListener('load', function() {
          const { width, height } = this;
          const count = (width / data.meta.tw) * (height / data.meta.th);
          data.meta.pages.push({
            name: name,
            min: min,
            max: min + count
          });
          refresh();
        });
        this.value = '';
      }
    }
  });
  document.querySelector('[name="layer-add"]').addEventListener('keydown', function(event) {
    if(event.key === 'Enter') {
      const layer = this.value;
      if(!data.images[layer]) {
        data.images[layer] = data.collisions.map(r => r.split('').map(() => -1));
      }
      selectedLayer = layer;
      refresh();
      this.value = '';
    }
  });
  document.querySelector('#collision').addEventListener('click', refresh);
  refresh();
  return clear;
}

export { init };
