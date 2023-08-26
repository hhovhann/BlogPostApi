import { PORT } from "./constants/post/post.constants";
import app from "./app";

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
