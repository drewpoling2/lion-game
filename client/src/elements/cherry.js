export function getCherryRects() {
  return [...document.querySelectorAll('[data-cherry]')].map((cherry) => {
    return {
      id: cherry.id,
      rect: cherry.getBoundingClientRect(),
      cherry: cherry.dataset['cherry'],
    };
  });
}
