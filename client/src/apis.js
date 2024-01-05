//gets all users from collection
const getAllHighScoreUsers = async () => {
  try {
    const response = await fetch('http://3.12.120.102:3001/scores/users');

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.log('getAllHighScoreUsers error', error);
  }
};

//insertions instead of delete

//deletes entry by field
const handleDeleteEntry = async (entryField) => {
  try {
    const response = await fetch(
      `http://3.12.120.102:3001/scores/delete-entry/${entryField}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      // Check if the response status is not OK (e.g., 4xx or 5xx)
      const errorData = await response.json();
      if (errorData.type === 'no user found') {
        alert('ERROR: No entry found with the specified ID');
      } else {
        alert('ERROR: Something went wrong');
      }
    }
  } catch (error) {
    // Handle other errors (e.g., network issues)
    console.log('handleDeleteEntry error', error);
  }
};

//sorts all collection data in descending order by score, and deletes last entry by username
const handleSortAndDeleteLastEntry = async () => {
  await getAllHighScoreUsers().then((data) => {
    const sortedData = data.users.sort((a, b) => {
      return parseInt(b.score, 10) - parseInt(a.score, 10);
    });
    handleDeleteEntry(sortedData[sortedData.length - 1].username);
  });
};

//adds new high score
const handleNewHighScore = async (username, score) => {
  try {
    const response = await fetch('http://3.12.120.102:3001/scores/new-high', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        score: score,
      }),
    });
    console.log(response);

    if (!response.ok) {
      console.log('not ok');
      // Check if the response status is not OK (e.g., 4xx or 5xx)
      const errorData = await response.json();
      if (errorData.type === 'username already exists') {
        return console.log('username already exists');
      } else {
        alert('ERROR: Something went wrong');
      }
    } else {
      await handleSortAndDeleteLastEntry();
    }
  } catch (error) {
    // Handle other errors (e.g., network issues)
    console.log('handleNewHighScore error', error);
  }
};

const checkIfNewHighScore = async (score) => {};

export { handleNewHighScore, getAllHighScoreUsers, checkIfNewHighScore };
