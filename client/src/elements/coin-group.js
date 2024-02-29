import { worldElem } from '../elements-refs';
import { setCustomProperty } from '../utility/updateCustomProperty';
import { randomNumberBetween } from './coin';

export function createColumnOfCoins(row, collectable) {
  let delay = 0; // Initial delay
  const numColumns = Math.floor(Math.random() * 4) + 3; // Number of columns to create
  const columnDelay = 300; // Delay between each column creation

  for (let j = 0; j < numColumns; j++) {
    setTimeout(() => {
      for (let i = 0; i < row; i++) {
        // Create a coin element for each row
        const coinElement = document.createElement('div');

        coinElement.dataset.coin = true;
        coinElement.dataset.type = collectable.type;
        coinElement.dataset.locked = 'false';
        coinElement.dataset.isLocking = 'false';
        coinElement.dataset.isMagnetSpeedFactor = randomNumberBetween(1.3, 2.4);
        coinElement.dataset.isLockingDuration = randomNumberBetween(100, 300);
        coinElement.dataset.points = collectable.points;
        if (
          collectable.type === 'red-gem' ||
          collectable.type === 'blue-gem' ||
          collectable.type === 'green-gem'
        ) {
          coinElement.dataset.gem = true;
        }

        coinElement.classList.add(
          collectable.type,
          'collectable',
          'move-bottom',
          'column'
        );
        coinElement.id = Math.random().toString(16).slice(2);

        const elementIndex = i === 0 ? i + 1 : (i + 1) / 2;
        const indexBottomFactor = elementIndex * 15;
        // Calculate the bottom position for the current row
        const bottomPosition = 10 + indexBottomFactor; // Adjust the increment as needed

        // Set the initial position of the coin
        coinElement.style.position = 'absolute';
        setCustomProperty(coinElement, '--left', 100);
        setCustomProperty(coinElement, '--bottom', bottomPosition); // Set bottom position

        // Append the coin element to the world container
        worldElem.appendChild(coinElement);
      }
    }, delay);
    delay += columnDelay; // Increment the delay for the next column
  }
}

export function createArrowOfCoins(column, collectable) {
  console.log('hit2', column);
  const numColumns = column; // Number of columns in the triangle
  let columnDelay = 0; // Initial delay for the first column
  const coinDelay = 300; // Delay between each coin creation

  for (let i = 0; i < numColumns; i++) {
    const numCoinsInColumn = numColumns - i; // Number of coins in the current column
    let rowDelay = 0; // Initial delay for the first coin in the column
    for (let j = 0; j < numCoinsInColumn; j++) {
      setTimeout(() => {
        const coinElement = document.createElement('div');

        coinElement.dataset.coin = true;
        coinElement.dataset.type = collectable.type;
        coinElement.dataset.locked = 'false';
        coinElement.dataset.isLocking = 'false';
        coinElement.dataset.isMagnetSpeedFactor = randomNumberBetween(1.3, 2.4);
        coinElement.dataset.isLockingDuration = randomNumberBetween(100, 300);
        coinElement.dataset.points = collectable.points;
        if (
          collectable.type === 'red-gem' ||
          collectable.type === 'blue-gem' ||
          collectable.type === 'green-gem'
        ) {
          coinElement.dataset.gem = true;
        }

        coinElement.classList.add(
          collectable.type,
          'collectable',
          'move-bottom',
          'arrow'
        );
        coinElement.id = Math.random().toString(16).slice(2);

        const elementIndex = j === 0 ? j + 1 : (j + 1) / 2;
        const indexBottomFactor = elementIndex * 15;
        // Calculate the bottom position for the current row
        const bottomPosition = 10 + indexBottomFactor; // Adjust the increment as needed

        // Set the initial position of the coin
        coinElement.style.position = 'absolute';
        setCustomProperty(coinElement, '--left', 100);
        setCustomProperty(coinElement, '--bottom', bottomPosition); // Set bottom position

        // Append the coin element to the world container
        worldElem.appendChild(coinElement);
      }, columnDelay + rowDelay);

      rowDelay += coinDelay; // Increment the delay for the next row within the column
    }

    columnDelay += coinDelay; // Increment the delay for the next column
  }
}

export function createDiagonalOfCoins(column, collectable) {
  console.log('hit3', column);
  const numColumns = column; // Number of columns in the triangle
  let columnDelay = 0; // Initial delay for the first column
  const coinDelay = 300; // Delay between each coin creation

  for (let i = 0; i < numColumns; i++) {
    let rowDelay = 0; // Initial delay for the first coin in the column
    for (let j = 0; j < 1; j++) {
      setTimeout(() => {
        const coinElement = document.createElement('div');

        coinElement.dataset.coin = true;
        coinElement.dataset.type = collectable.type;
        coinElement.dataset.locked = 'false';
        coinElement.dataset.isLocking = 'false';
        coinElement.dataset.isMagnetSpeedFactor = randomNumberBetween(1.3, 2.4);
        coinElement.dataset.isLockingDuration = randomNumberBetween(100, 300);
        coinElement.dataset.points = collectable.points;
        if (
          collectable.type === 'red-gem' ||
          collectable.type === 'blue-gem' ||
          collectable.type === 'green-gem'
        ) {
          coinElement.dataset.gem = true;
        }

        coinElement.classList.add(
          collectable.type,
          'collectable',
          'move-bottom',
          'arrow'
        );
        coinElement.id = Math.random().toString(16).slice(2);

        const elementIndex = i === 0 ? i + 1 : i + 1;
        const indexBottomFactor = elementIndex * 7;
        // Calculate the bottom position for the current row
        const bottomPosition = 10 + indexBottomFactor; // Adjust the increment as needed

        // Set the initial position of the coin
        coinElement.style.position = 'absolute';
        setCustomProperty(coinElement, '--left', 100);
        setCustomProperty(coinElement, '--bottom', bottomPosition); // Set bottom position

        // Append the coin element to the world container
        worldElem.appendChild(coinElement);
      }, columnDelay + rowDelay);

      rowDelay += coinDelay; // Increment the delay for the next row within the column
    }

    columnDelay += coinDelay; // Increment the delay for the next column
  }
}
