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
app.use((req, res, next) => {
  console.log("This is the req.url", req.url);
  next(req, res, next);
});

app.get("/", (req, res) => {
  res.status(200).send("This is the / route")
})

app.get("/test", (req, res) => {
  res.status(200).send("This the /test route")
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
