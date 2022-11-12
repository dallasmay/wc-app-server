require("dotenv").config();
const { SERVER_PORT } = process.env;

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const {
  seed,
  registerUser,
  setTeamName,
  getUserInfo,
  setDefaultBracket,
  getGroupStageChoices,
  setGroupChoices,
} = require("./controller");

// ENDPOINTS
app.get("/", (req, res) => {
  res.status(200).send("Please work")
})

app.get("/seed", seed);

app.post("/user", getUserInfo);
app.post("/register", registerUser);
app.post("/team", setTeamName);
app.post("/bracket/default", setDefaultBracket);

app.post("/bracket/group-stage", getGroupStageChoices);
app.post("/bracket/set-group-stage", setGroupChoices);

app.listen(SERVER_PORT, () => {
  console.log(`Server running on port ${SERVER_PORT}`);
});
