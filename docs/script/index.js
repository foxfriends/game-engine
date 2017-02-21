'use strict';
import 'prismjs/themes/prism.css';
import 'style/index.scss';
import './prism';

let view = sessionStorage.getItem('language-preference') || 'javascript';

// HACK: I think... nothing seems broken though...
document.body.innerHTML = document.body.innerHTML.replace(/\{\{GameObject\}\}/g, '<code data-view="c++" class="language-cpp token class-name">Object</code><code data-view="javascript" class="language-javascript token class-name">GameObject</code>');
document.body.innerHTML = document.body.innerHTML.replace(/\{\{GameEvent\}\}/g, '<code data-view="c++" class="language-cpp token class-name">Event</code><code data-view="javascript" class="language-javascript token class-name">GameEvent</code>');
Prism.highlightAll();

const tochange = document.querySelectorAll('[data-view],[data-hide]');
const tabs = document.querySelectorAll('[data-tab]');
function changeView(which) {
  view = which;
  sessionStorage.setItem('language-preference', view);
  Array.prototype.forEach.call(tochange, (el) => {
    const v = el.getAttribute('data-view');
    const h = el.getAttribute('data-hide');
    if(v === view) {
      el.style.display = '';
    } else if(v) {
      el.style.display = 'none';
    }
    if(h && h === view) {
      el.style.display = 'none';
    } else if(h) {
      el.style.display = '';
    }
  });
  Array.prototype.forEach.call(tabs, (tab) => {
    const v = tab.getAttribute('data-tab');
    if(v === view) {
      tab.classList.add('selected');
    } else {
      tab.classList.remove('selected');
    }
  });
}

changeView(view);

Array.prototype.forEach.call(tabs, (tab) => {
  tab.addEventListener('click', () => {
    changeView(tab.getAttribute('data-tab'));
  });
});
