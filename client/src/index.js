const app = require('./app');

const port = '3000';

app.listen(port, () => {
  console.log(`Client is listening on port ${port}`);
});
