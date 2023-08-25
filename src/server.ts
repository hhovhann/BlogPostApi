import { PORT } from "./constants/post/post.constants";
import app from "./app";

app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
