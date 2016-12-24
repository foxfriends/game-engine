'use strict';

const [SELECTOR, OPTION] = [
  document.querySelector('#selector').content,
  document.querySelector('#selector-option').content
];


function showSelector(options) {
  const selector = document.importNode(SELECTOR, true);
  const optlist = selector.querySelector('#options');
  const pr = new Promise((resolve, reject) => {
    for(let opt of Object.keys(options)) {
      const option = document.importNode(OPTION, true);
      const value = option.querySelector('.value');
      value.textContent = `${opt} (${options[opt]})`;
      value.addEventListener('click', () => resolve([opt, options[opt]]));
      optlist.appendChild(option);
    }
    const cancel = document.importNode(OPTION, true);
    const value = cancel.querySelector('.value');
    value.textContent = 'Cancel';
    value.addEventListener('click', () => reject());
    optlist.appendChild(cancel);
    document.querySelector('#page').appendChild(selector);
  });
  pr.then((...args) => {
    document.querySelector('#page').removeChild(document.querySelector('.selector'));
  }, () => {
    document.querySelector('#page').removeChild(document.querySelector('.selector'));
  });
  return pr;
}

export { showSelector };
