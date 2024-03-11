import { worldElem } from '../elements-refs';
import { setCustomProperty } from '../utility/updateCustomProperty';
import { randomNumberBetween } from './coin';

export function createColumnOfCoins(row, collectable) {
  const numColumns = Math.floor(Math.random() * 4) + 3; // Number of columns to create

  for (let j = 0; j < numColumns; j++) {
    for (let i = 0; i < row; i++) {
      // Create a coin element for each row
      const coinElement = document.createElement('div');

      coinElement.dataset.coin = true;
      if (collectable.type && collectable) {
        coinElement.dataset.type = collectable.type;
      } else {
        coinElement.dataset.type = '';
      }
      coinElement.dataset.locked = 'false';
      coinElement.dataset.isLocking = 'false';
      coinElement.dataset.isMagnetSpeedFactor = randomNumberBetween(1.3, 2.4);
      coinElement.dataset.isLockingDuration = randomNumberBetween(100, 300);
      coinElement.dataset.points = collectable.points;
      if (collectable && collectable.type) {
        if (
          collectable.type === 'red-gem' ||
          collectable.type === 'blue-gem' ||
          collectable.type === 'green-gem'
        ) {
          coinElement.dataset.gem = true;
        }
      }

      coinElement.classList.add(
        collectable && collectable.type ? collectable.type : '',
        'collectable',
        'move-bottom',
        'column'
      );
      coinElement.id = Math.random().toString(16).slice(2);

      const leftPosition = j * 5;
      // Calculate the bottom position for the current row
      const bottomPosition = 25 + i * 7; // Adjust the increment as needed

      // Set the initial position of the coin
      coinElement.style.position = 'absolute';
      setCustomProperty(coinElement, '--left', 100 + leftPosition);
      setCustomProperty(coinElement, '--bottom', bottomPosition); // Set bottom position

      // Append the coin element to the world container
      worldElem.appendChild(coinElement);
    }
  }
}

export function createArrowOfCoins(column, collectable) {
  const numColumns = column; // Number of columns in the triangle

  for (let j = 0; j < numColumns; j++) {
    const numCoinsInColumn = numColumns - j; // Number of coins in the current column
    for (let i = 0; i < numCoinsInColumn; i++) {
      const coinElement = document.createElement('div');

      coinElement.dataset.coin = true;
      if (collectable.type && collectable) {
        coinElement.dataset.type = collectable.type;
      } else {
        coinElement.dataset.type = '';
      }
      coinElement.dataset.locked = 'false';
      coinElement.dataset.isLocking = 'false';
      coinElement.dataset.isMagnetSpeedFactor = randomNumberBetween(1.3, 2.4);
      coinElement.dataset.isLockingDuration = randomNumberBetween(100, 300);
      coinElement.dataset.points = collectable.points;
      if (collectable && collectable.type) {
        if (
          collectable.type === 'red-gem' ||
          collectable.type === 'blue-gem' ||
          collectable.type === 'green-gem'
        ) {
          coinElement.dataset.gem = true;
        }
      }

      coinElement.classList.add(
        collectable && collectable.type ? collectable.type : '',
        'collectable',
        'move-bottom',
        'arrow'
      );
      coinElement.id = Math.random().toString(16).slice(2);

      const leftPosition = j * 5;
      // Calculate the bottom position for the current row
      const bottomPosition = 25 + i * 7; // Adjust the increment as needed

      // Set the initial position of the coin
      coinElement.style.position = 'absolute';
      setCustomProperty(coinElement, '--left', 100 + leftPosition);
      setCustomProperty(coinElement, '--bottom', bottomPosition); // Set bottom position

      // Append the coin element to the world container
      worldElem.appendChild(coinElement);
    }
  }
}

export function createDiagonalOfCoins(column, collectable) {
  const numColumns = column; // Number of columns in the triangle

  for (let j = 0; j < numColumns; j++) {
    for (let i = 0; i < 1; i++) {
      const coinElement = document.createElement('div');

      coinElement.dataset.coin = true;
      if (collectable.type && collectable) {
        coinElement.dataset.type = collectable.type;
      } else {
        coinElement.dataset.type = '';
      }
      coinElement.dataset.locked = 'false';
      coinElement.dataset.isLocking = 'false';
      coinElement.dataset.isMagnetSpeedFactor = randomNumberBetween(1.3, 2.4);
      coinElement.dataset.isLockingDuration = randomNumberBetween(100, 300);
      coinElement.dataset.points = collectable.points;
      if (collectable && collectable.type) {
        if (
          collectable.type === 'red-gem' ||
          collectable.type === 'blue-gem' ||
          collectable.type === 'green-gem'
        ) {
          coinElement.dataset.gem = true;
        }
      }

      coinElement.classList.add(
        collectable && collectable.type ? collectable.type : '',
        'collectable',
        'move-bottom',
        'arrow'
      );
      coinElement.id = Math.random().toString(16).slice(2);

      const leftPosition = j * 5;
      // Calculate the bottom position for the current row
      const bottomPosition = 25 + j * 7; // Adjust the increment as needed

      // Set the initial position of the coin
      coinElement.style.position = 'absolute';
      setCustomProperty(coinElement, '--left', 100 + leftPosition);
      setCustomProperty(coinElement, '--bottom', bottomPosition); // Set bottom position

      // Append the coin element to the world container
      worldElem.appendChild(coinElement);
    }
  }
}
