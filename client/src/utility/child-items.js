import StateSingleton from '../game-state';

export function createChildItems(elementName, parent) {
  const element = document.createElement('div');
  element.dataset[`${elementName}`] = true;
  element.classList.add(
    `${elementName}-item-cloud`,
    `${elementName}-cloud-item-asset`
  );
  element.id = Math.random().toString(16).slice(2);

  parent.append(element);
}
