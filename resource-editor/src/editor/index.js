'use strict';
import './style/index.scss';
import { remote } from 'electron';
import { init as init_tilemap } from './tilemap';
import { init as init_texturepage } from './texture-page';
import { showSelector } from './selector';
import { setProject, getProject } from './project';
import path from 'path';
import fs from 'fs';

const [ START, TILE_MAP, TEXTURE_PAGE ] = [
  document.querySelector('#start').content,
  document.querySelector('#tilemap').content,
  document.querySelector('#texturepage').content
];

const page = document.querySelector('#page');

function clear_start() { }

function refresh() {
  const label = page.querySelector('#current-project');
  label.textContent = getProject().path;
  if(getProject().path === '') {
    label.classList.add('none');
    page.querySelector('#open-texturepage').disabled = true;
    page.querySelector('#open-tilemap').disabled = true;
  } else {
    label.classList.remove('none');
    page.querySelector('#open-texturepage').disabled = false;
    page.querySelector('#open-tilemap').disabled = false;
  }
}

function init_start() {
  page.querySelector('#open-project').addEventListener('click', () => {
    let project, config;
    try {
      [ project ] = remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
        properties: ['openFile']
      });
      config = JSON.parse(fs.readFileSync(project));
    } catch (error) {
      if(!project) return;
      project = '';
      config = {};
      remote.dialog.showErrorBox('Error', 'Not a valid config file');
    }
    setProject(project, config);
    refresh();
  });
  page.querySelector('#goto-texturepage').addEventListener('click', goto.bind(null, TEXTURE_PAGE, null, null));
  page.querySelector('#open-texturepage').addEventListener('click', async () => {
    try {
      const [name, file] = await showSelector(getProject().data['texture-pages']);
      goto(TEXTURE_PAGE, path.resolve(path.dirname(getProject().path), file), name);
    } catch(_) {}
  });
  page.querySelector('#goto-tilemap').addEventListener('click', goto.bind(null, TILE_MAP, null, null));
  page.querySelector('#open-tilemap').addEventListener('click', async () => {
    try {
      const [name, file] = await showSelector(getProject().data['tile-maps']);
      goto(TILE_MAP, path.resolve(path.dirname(getProject().path), file), name);
    } catch(_) {}
  });
  refresh();
  return clear_start;
}

let clear = clear_start;
function goto(where, file, name) {
  page.innerHTML = '';
  page.appendChild(document.importNode(where, true));
  clear();
  switch(where) {
    case START:
      clear = init_start();
      break;
    case TILE_MAP:
      clear = init_tilemap(goto.bind(null, START), file, name);
      break;
    case TEXTURE_PAGE:
      clear = init_texturepage(goto.bind(null, START), file, name);
      break;
  }
}
goto(START);
