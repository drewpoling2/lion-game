function toggleElemOn(elem) {
  const classList = elem.classList;
  classList.remove('hide-element');
  classList.add('show-element');
}
function toggleElemOff(elem) {
  const classList = elem.classList;
  classList.add('hide-element');
  classList.remove('show-element');
}

export { toggleElemOff, toggleElemOn };
