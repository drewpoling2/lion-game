import { UserErrors } from '../../server/common/errors';

//adds new high score
const handleNewHighScore = async (username, score) => {
  try {
    const response = await fetch('http://localhost:3001/scores/new-high', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        score: score,
      }),
    });

    if (!response.ok) {
      // Check if the response status is not OK (e.g., 4xx or 5xx)
      const errorData = await response.json();
      if (errorData.type === UserErrors.NO_USER_FOUND) {
        alert('ERROR: No user found');
      } else {
        alert('ERROR: Something went wrong');
      }
    } else {
      alert('Registration Completed! Now login.');
    }
  } catch (error) {
    // Handle other errors (e.g., network issues)
    console.log('handleNewHighScore error', error);
  }
};

const getAllHighScores = async () => {
  try {
    const response = await fetch('http://localhost:3001/scores/users');

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('getAllHighScores error', error);
  }
};

const getAllHighScoreUsers = async () => {
  try {
    const response = await fetch('http://localhost:3001/scores/users');

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.log('getAllHighScoreUsers error', error);
  }
};

const checkIfNewHighScore = async (score) => {};

export { handleNewHighScore, getAllHighScoreUsers, checkIfNewHighScore };
