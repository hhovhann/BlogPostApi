import app from "./app";

const dotenv = require('dotenv');
dotenv.config()

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
