import { getAllHighScoreUsers } from '../apis';

export function createLeaderboard(leaderboardElem) {
  //for right sidebar
  const personalBestLvl = document.querySelector('[data-personal-best-lvl]');
  const personalBestCombo = document.querySelector(
    '[data-personal-best-combo]'
  );
  const personalBestScoreElem = document.querySelector(
    '[data-personal-best-score]'
  );

  // Retrieve values from local storage
  const storedPersonalBestLvl = localStorage.getItem('lion-best-lvl');
  const storedPersonalBestCombo = localStorage.getItem('lion-best-combo');
  const storedPersonalBestScore = localStorage.getItem('lion-high-score');

  // Check if values exist in local storage before updating the elements
  if (storedPersonalBestLvl !== null) {
    personalBestLvl.textContent = storedPersonalBestLvl;
  }

  if (storedPersonalBestCombo !== null) {
    personalBestCombo.textContent = storedPersonalBestCombo;
  }

  if (storedPersonalBestScore !== null) {
    personalBestScoreElem.textContent = storedPersonalBestScore;
  }

  getAllHighScoreUsers().then((data) => {
    function getSuffix(number) {
      const lastDigit = number % 10;
      if (number === 11 || number === 12 || number === 13) {
        return 'th';
      } else if (lastDigit === 1) {
        return 'st';
      } else if (lastDigit === 2) {
        return 'nd';
      } else if (lastDigit === 3) {
        return 'rd';
      } else {
        return 'th';
      }
    }

    // Map data to HTML elements and append to container
    data.users.forEach((item, index) => {
      const rowElement = document.createElement('tr');
      rowElement.classList.add('leaderboard-row');

      // Create and append the "Rank" cell
      const rankCell = document.createElement('td');
      rankCell.classList.add('leaderboard-rank-item');
      const indexSuffix = getSuffix(index + 1);
      rankCell.textContent = `${index + 1}${indexSuffix}`;
      rowElement.appendChild(rankCell);

      // Create and append the "Score" cell
      const scoreCell = document.createElement('td');
      scoreCell.classList.add('leaderboard-score-item');
      scoreCell.textContent = `${item.score}`;
      rowElement.appendChild(scoreCell);

      // Create and append the "Name" cell
      const nameCell = document.createElement('td');
      nameCell.classList.add('leaderboard-name-item');
      nameCell.textContent = `${item.username}`;
      rowElement.appendChild(nameCell);

      // Append the entire row to the body
      leaderboardElem.appendChild(rowElement);
    });
  });
}
