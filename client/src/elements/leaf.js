export function getLeafRects() {
  return [...document.querySelectorAll('[data-leaf]')].map((leaf) => {
    return {
      id: leaf.id,
      rect: leaf.getBoundingClientRect(),
      heart: leaf.dataset.leaf,
    };
  });
}
