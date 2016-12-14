'use strict';

function loadJSON(url) {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', () => {
      try {
        const data = JSON.parse(req.responseText);
        resolve(data);
      } catch(error) {
        reject(`Invalid JSON received from ${url}`);
      }
    });
    req.send();
  });
}

export default loadJSON;
