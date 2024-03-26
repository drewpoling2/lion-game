import { getAllHighScoreUsers } from '../apis';

export function sortLeaderboard(data) {
  return data.users.sort((a, b) => {
    return parseInt(b.score, 10) - parseInt(a.score, 10);
  });
}

export function getSuffix(number) {
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
let fallbackData = {
  users: [
    { username: 'jim', score: '0000710' },
    { username: 'alice', score: '0000715' },
    { username: 'bob', score: '0000720' },
    { username: 'emma', score: '0000708' },
    { username: 'john', score: '0000725' },
    { username: 'sarah', score: '0000718' },
    { username: 'michael', score: '0000722' },
    { username: 'lisa', score: '0000712' },
    { username: 'david', score: '0000716' },
    { username: 'emily', score: '0000721' },
    { username: 'chris', score: '0000713' },
    { username: 'olivia', score: '0000719' },
    { username: 'matthew', score: '0000724' },
    { username: 'jessica', score: '0000709' },
    { username: 'ryan', score: '0000717' },
    { username: 'lauren', score: '0000723' },
    { username: 'andrew', score: '0000711' },
    { username: 'amanda', score: '0000726' },
    { username: 'nathan', score: '0000714' },
    { username: 'hannah', score: '0000727' },
    { username: 'joshua', score: '0000710' },
    { username: 'samantha', score: '0000728' },
    { username: 'kevin', score: '0000707' },
    { username: 'natalie', score: '0000729' },
    { username: 'justin', score: '0000706' },
  ],
};

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

  const sortedData = sortLeaderboard(fallbackData);

  // Map data to HTML elements and append to container
  sortedData.forEach((item, index) => {
    const rowElement = document.createElement('tr');
    rowElement.classList.add('leaderboard-row-parent');
    rowElement.id = `leaderboard-row-${index + 1}`;

    // Create and append the "Rank" cell
    const rankCell = document.createElement('td');
    rankCell.classList.add('leaderboard-rank-item', 'leaderboard-row');
    const indexSuffix = getSuffix(index + 1);
    rankCell.textContent = `${index + 1}${indexSuffix}`;
    rowElement.appendChild(rankCell);

    // Create and append the "Score" cell
    const scoreCell = document.createElement('td');
    scoreCell.classList.add('leaderboard-score-item', 'leaderboard-row');
    scoreCell.textContent = `${item.score}`;
    rowElement.appendChild(scoreCell);

    // Create and append the "Name" cell
    const nameCell = document.createElement('td');
    nameCell.classList.add('leaderboard-name-item', 'leaderboard-row');
    nameCell.textContent = `${item.username}`;
    rowElement.appendChild(nameCell);

    // Append the entire row to the body
    leaderboardElem.appendChild(rowElement);
  });

  // getAllHighScoreUsers().then((data) => {
  //   const sortedData = sortLeaderboard(data ? data : fallbackData);

  //   // Map data to HTML elements and append to container
  //   sortedData.forEach((item, index) => {
  //     const rowElement = document.createElement('tr');
  //     rowElement.classList.add('leaderboard-row');
  //     rowElement.id = `leaderboard-row-${index + 1}`;

  //     // Create and append the "Rank" cell
  //     const rankCell = document.createElement('td');
  //     rankCell.classList.add('leaderboard-rank-item');
  //     const indexSuffix = getSuffix(index + 1);
  //     rankCell.textContent = `${index + 1}${indexSuffix}`;
  //     rowElement.appendChild(rankCell);

  //     // Create and append the "Score" cell
  //     const scoreCell = document.createElement('td');
  //     scoreCell.classList.add('leaderboard-score-item');
  //     scoreCell.textContent = `${item.score}`;
  //     rowElement.appendChild(scoreCell);

  //     // Create and append the "Name" cell
  //     const nameCell = document.createElement('td');
  //     nameCell.classList.add('leaderboard-name-item');
  //     nameCell.textContent = `${item.username}`;
  //     rowElement.appendChild(nameCell);

  //     // Append the entire row to the body
  //     leaderboardElem.appendChild(rowElement);
  //   });
  // });
}
