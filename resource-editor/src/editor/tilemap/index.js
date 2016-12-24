'use strict';

import fs from 'fs';
import path from 'path';
import { saveTileMap as save, rename, getProject } from '../project';
import { remote } from 'electron';

let data = {}, canvas = null, ctx = null;
let file = '', name = '', oldname = '', saved = true;
let selectedPage = '', selectedLayer = NaN;
let layers = {};
let back = () => {};

function refresh() {
  document.querySelector('[name="name"]').value = name;
  document.querySelector('[name="tw"]').value = data.meta.tw || 0;
  document.querySelector('[name="th"]').value = data.meta.th || 0;
  const pagelist = document.querySelector('#texture-pages');
  Array.prototype.forEach.call(pagelist.querySelectorAll('li:not(#tp-adder)'), (li) => {
    li.parentNode.removeChild(li);
  });
  data.meta.pages.forEach((page, index) => {
    // TODO: load texture pages from project if they aren't open yet
    const li = document.createElement('LI');
    li.textContent = page.name;
    li.classList.add('clickable');
    if(page === selectedPage) {
      li.classList.add('selected');
    }
    li.addEventListener('click', () => {
      if(selectedPage === page) {
        if(remote.dialog.showMessageBox(remote.getCurrentWindow(), { message: `Remove ${page.name}?`, buttons: ['Cancel', 'Ok'] })) {
          // TODO: remove all references to this page from the image
          // TODO: close the open texture page resource
          delete data.meta.pages[index];
          saved = false;
        }
      } else {
        selectedPage = page;
      }
      refresh();
    });
    pagelist.appendChild(li);
  });
  for(let depth of Object.keys(data.images).map(x => +x)) {
    const li = document.createElement('LI');
    li.textContent = page.name;
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
    pagelist.appendChild(li);
    if(!layers[depth]) {
      layers[depth] = document.createElement('CANVAS');
      const image = data.images[depth];
      const c = layers[depth].getContext('2d');
      for(let i = 0; i < image.length; ++i) {
        for(let j = 0; j < image[i].length; ++j) {
          // TODO: parse tiles out of texture pages once loaded
        }
      }
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
  file = f;
  name = n;
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
    } catch(error) {
      console.error(error);
      remote.dialog.showErrorBox('Error', 'Not a valid tile map');
    }
  }
  window.addEventListener('keydown', keydown);
  Array.prototype.forEach.call(document.querySelectorAll('input'), (input) => {
    input.addEventListener('input', () => {
      saved = false;
    });
  });
  document.querySelector('[name="name"]').addEventListener('input', function() {
    name = this.value;
  });
  refresh();
  return clear;
}

export { init };
