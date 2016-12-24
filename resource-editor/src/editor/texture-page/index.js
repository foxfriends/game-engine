'use strict';

import fs from 'fs';
import path from 'path';
import { saveTexturePage as save, rename, getProject } from '../project';
import { remote } from 'electron';

let data = {}, img = null, canvas = null, ctx = null;
let file = '', name = '', oldname = '', saved = true;
let selectedSprite = '';
let back = () => {};

function refresh() {
  document.querySelector('[name="name"]').value = name;
  document.querySelector('[name="image"]').value = path.basename(data.image) || '';
  document.querySelector('[name="width"]').value = data.width || 0;
  document.querySelector('[name="height"]').value = data.value || 0;
  const spritelist = document.querySelector('#sprites');
  Array.prototype.forEach.call(spritelist.querySelectorAll('li:not(#spr-adder)'), (li) => {
    li.parentNode.removeChild(li);
  });
  for(let sprite of Object.keys(data.sprites)) {
    const li = document.createElement('LI');
    li.textContent = `${sprite} (${data.sprites[sprite].length} frames)`;
    li.classList.add('clickable');
    if(sprite === selectedSprite) {
      li.classList.add('selected');
    }
    li.addEventListener('click', () => {
      if(selectedSprite === sprite) {
        if(remote.dialog.showMessageBox(remote.getCurrentWindow(), { message: `Delete ${sprite}?`, buttons: ['Cancel', 'Ok'] })) {
          delete data.sprites[sprite];
          saved = false;
        }
      } else {
        selectedSprite = sprite;
      }
      refresh();
    });
    spritelist.appendChild(li);
  }
  if(data.image !== '') {
    img = new Image();
    img.src = path.resolve(path.dirname(getProject().path), data.image);
    img.addEventListener('load', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.width = data.width = img.width;
      canvas.height = data.height = img.height;
      ctx.drawImage(img, 0, 0);
    });
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
  canvas = document.querySelector('#editor');
  ctx = canvas.getContext('2d');
  data = {
    image: '',
    width: 0,
    height: 0,
    frames: [],
    sprites: {}
  };
  if(file) {
    try {
      data = JSON.parse(fs.readFileSync(file));
    } catch(error) {
      console.error(error);
      remote.dialog.showErrorBox('Error', 'Not a valid texture page');
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
  document.querySelector('[name="image"]').addEventListener('click', function() {
    const [ file ] = remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
      defaultPath: path.dirname(getProject().path),
      filters: [
        { name: "Images", extensions: ["png"] }
      ],
      properties: ['openFile']
    });
    data.image = path.relative(path.dirname(getProject().path), file);
    refresh();
  });
  refresh();
  return clear;
}

export { init };
