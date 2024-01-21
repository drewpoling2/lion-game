export function getHeartRects() {
  return [...document.querySelectorAll('[data-heart]')].map((heart) => {
    return {
      id: heart.id,
      rect: heart.getBoundingClientRect(),
      heart: heart.dataset.heart,
    };
  });
}
