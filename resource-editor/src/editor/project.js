'use strict';

import { remote } from 'electron';
import fs from 'fs';
import path from 'path';

let project = '';
let config = {
  "texture-pages": {},
  "tile-maps": {},
  "fonts": {}
};

function setProject(proj, cfg) { project = proj; config = cfg; }
function getProject() {
  return {
    path: project,
    data: config
  };
}

function saveProject() {
  if(!project) {
    project = remote.dialog.showSaveDialog(remote.getCurrentWindow(), {
      title: 'New Project'
    });
  }
  fs.writeFileSync(project, JSON.stringify(config));
}

function rename(oldname, newname) {
  if(config[newname]) {
    remote.dialog.showErrorBox('Error', 'This name is already taken');
    return;
  }
  if(!config[oldname]) {
    return;
  }
  config[newname] = config[oldname];
  delete config[oldname];
}

function save(what, name, file, data) {
  if(!file) {
    file = remote.dialog.showSaveDialog(remote.getCurrentWindow());
  }
  saveProject();
  config[what][name] = path.relative(path.dirname(project), file);
  saveProject();
  fs.writeFileSync(file, JSON.stringify(data));
}

const saveTexturePage = save.bind(null, 'texture-pages');
const saveTileMap = save.bind(null, 'tile-maps');

export { saveTexturePage, saveTileMap, setProject, getProject, rename };
