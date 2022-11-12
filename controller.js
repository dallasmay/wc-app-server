require("dotenv").config();
const Sequelize = require("sequelize");

const { CONNECTION_STRING } = process.env;

const sequelize = new Sequelize(CONNECTION_STRING, {
  dialect: "postgres",
  dialectOptions: {
    rejectUnauthorized: false,
  },
});

module.exports = {
  seed: (req, res) => {
    sequelize
      .query(
        `CREATE TABLE users (
        id VARCHAR(50) PRIMARY KEY NOT NULL UNIQUE,
        name VARCHAR(100) NOT NULL,
        team_name VARCHAR(100) UNIQUE,
        score INT DEFAULT 0,
        a_is_seen BOOL DEFAULT false,
        b_is_seen BOOL DEFAULT false,
        c_is_seen BOOL DEFAULT false,
        d_is_seen BOOL DEFAULT false,
        e_is_seen BOOL DEFAULT false,
        f_is_seen BOOL DEFAULT false,
        g_is_seen BOOL DEFAULT false,
        h_is_seen BOOL DEFAULT false
    );
        CREATE TABLE countries (
          id SERIAL PRIMARY KEY,
          name VARCHAR(20) NOT NULL UNIQUE,
          abbr VARCHAR(10) NOT NULL UNIQUE,
          fifa_rank INT NOT NULL UNIQUE
        );
        CREATE TABLE brackets (
          id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4 (),
          user_id VARCHAR(50) NOT NULL REFERENCES users(id),
          round VARCHAR(10) NOT NULL,
          group_letter VARCHAR(1) NOT NULL,
          game_number INT,
          country_id INT NOT NULL REFERENCES countries(id),
          position INT NOT NULL,
          UTC_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
        );
        INSERT INTO countries (name, abbr, fifa_rank)
        values ('Argentina', 'ARG', '3'),
        ('Australia', 'AUS', '38'),
        ('Belgium', 'BEL', '2'),
        ('Brazil', 'BRA', '1'),
        ('Cameroon', 'CMR', '43'),
        ('Canada', 'CAN', '41'),
        ('Costa Rica', 'CRC', '31'),
        ('Croatia', 'CRO', '12'),
        ('Denmark', 'DEN', '10'),
        ('Ecuador', 'ECU', '44'),
        ('England', 'ENG', '5'),
        ('France', 'FRA', '4'),
        ('Germany', 'GER', '11'),
        ('Ghana', 'GHA', '61'),
        ('Iran', 'IRN', '20'),
        ('Japan', 'JPN', '24'),
        ('Mexico', 'MEX', '13'),
        ('Morocco', 'MAR', '22'),
        ('Netherlands', 'NED', '8'),
        ('Poland', 'POL', '26'),
        ('Portugal', 'POR', '9'),
        ('Qatar', 'QAT', '50'),
        ('Saudi Arabia', 'KSA', '51'),
        ('Senegal', 'SEN', '18'),
        ('Serbia', 'SRB', '21'),
        ('South Korea', 'KOR', '28'),
        ('Spain', 'ESP', '7'),
        ('Switzerland', 'SUI', '15'),
        ('Tunisia', 'TUN', '30'),
        ('United States', 'USA', '16'),
        ('Uruguay', 'URU', '14'),
        ('Wales', 'WAL', '19');`
      )
      .then(() => res.status(200).send("Db Seeded"))
      .catch((err) => console.log(err));
  },
  registerUser: (req, res) => {
    const { userId, name } = req.body;

    sequelize
      .query(
        `INSERT INTO users (id, name)
    VALUES ('${userId}', '${name}')`
      )
      .then(() => res.status(200).send())
      .catch((err) => console.log(err));
  },
  setTeamName: (req, res) => {
    const { userId, teamName } = req.body;

    sequelize
      .query(
        `UPDATE users
    SET team_name = $1
    WHERE id = $2
    RETURNING team_name`,
        {
          bind: [`${teamName}`, `${userId}`],
        }
      )
      .then((dbRes) => {
        res.status(200).send(dbRes[0][0]);
      })
      .catch((err) => console.log(err));
  },
  getUserInfo: (req, res) => {
    const { userId } = req.body;

    sequelize
      .query(
        `SELECT team_name, score, a_is_seen, b_is_seen, c_is_seen, d_is_seen, e_is_seen, f_is_seen, g_is_seen, h_is_seen FROM users WHERE id = '${userId}'`
      )
      .then((dbRes) => {
        console.log(dbRes);
        res.status(200).send(dbRes[0][0]);
      })
      .catch((err) => console.log(err));
  },
  setDefaultBracket: (req, res) => {
    const { userId } = req.body;

    sequelize
      .query(
        `INSERT INTO brackets (user_id, round, group_letter, country_id, position)
        VALUES ('${userId}', 'group', 'a', '19', '1'),
        ('${userId}', 'group', 'a', '24', '2'),
        ('${userId}', 'group', 'a', '10', '3'),
        ('${userId}', 'group', 'a', '22', '4'),
        ('${userId}', 'group', 'b', '11', '1'),
        ('${userId}', 'group', 'b', '30', '2'),
        ('${userId}', 'group', 'b', '32', '3'),
        ('${userId}', 'group', 'b', '15', '4'),
        ('${userId}', 'group', 'c', '1', '1'),
        ('${userId}', 'group', 'c', '17', '2'),
        ('${userId}', 'group', 'c', '20', '3'),
        ('${userId}', 'group', 'c', '23', '4'),
        ('${userId}', 'group', 'd', '12', '1'),
        ('${userId}', 'group', 'd', '9', '2'),
        ('${userId}', 'group', 'd', '29', '3'),
        ('${userId}', 'group', 'd', '2', '4'),
        ('${userId}', 'group', 'e', '27', '1'),
        ('${userId}', 'group', 'e', '13', '2'),
        ('${userId}', 'group', 'e', '16', '3'),
        ('${userId}', 'group', 'e', '7', '4'),
        ('${userId}', 'group', 'f', '3', '1'),
        ('${userId}', 'group', 'f', '8', '2'),
        ('${userId}', 'group', 'f', '18', '3'),
        ('${userId}', 'group', 'f', '6', '4'),
        ('${userId}', 'group', 'g', '4', '1'),
        ('${userId}', 'group', 'g', '28', '2'),
        ('${userId}', 'group', 'g', '25', '3'),
        ('${userId}', 'group', 'g', '5', '4'),
        ('${userId}', 'group', 'h', '21', '1'),
        ('${userId}', 'group', 'h', '31', '2'),
        ('${userId}', 'group', 'h', '26', '3'),
        ('${userId}', 'group', 'h', '14', '4');
    `
      )
      .then(() => {
        res.status(200).send("Default bracket created for user");
      })
      .catch((err) => {
        console.log(err);
      });
  },
  getGroupStageChoices: (req, res) => {
    const { userId } = req.body;

    // sequelize
    //   .query(
    //     `SELECT group_letter, country_id, position FROM brackets WHERE user_id = '${userId}'`
    //   )
    //   .then((dbRes) => {
    //     res.status(200).send(dbRes);
    //   })
    //   .catch((err) => console.log(err));
    sequelize
      .query(
        `SELECT group_letter, position, name, abbr, fifa_rank, c.id 
          FROM brackets AS b
          INNER JOIN countries AS c
          ON b.country_id = c.id
          WHERE b.user_id = '${userId}'
          ORDER BY group_letter ASC, position ASC`
      )
      .then((dbRes) => {
        res.status(200).send(dbRes);
      })
      .catch((err) => console.log(err));
  },
  setGroupChoices: (req, res) => {
    const { userId, countriesArr } = req.body;
    const groupLetter = countriesArr[0].group_letter;

    sequelize
      .query(
        `DELETE
         FROM brackets
         WHERE user_id = '${userId}' AND group_letter = '${groupLetter}';
         
         INSERT INTO brackets (user_id, round, group_letter, country_id, position)
        VALUES ('${userId}', 'group', '${groupLetter}', '${countriesArr[0].id}', '1'),
        ('${userId}', 'group', '${groupLetter}', '${countriesArr[1].id}', '2'),
        ('${userId}', 'group', '${groupLetter}', '${countriesArr[2].id}', '3'),
        ('${userId}', 'group', '${groupLetter}', '${countriesArr[3].id}', '4');
        
        SELECT group_letter, position, name, abbr, fifa_rank, c.id 
          FROM brackets AS b
          INNER JOIN countries AS c
          ON b.country_id = c.id
          WHERE b.user_id = '${userId}'
          ORDER BY group_letter ASC, position ASC;`
      )
      .then((dbRes) => {
        res.status(200).send(dbRes[0]);
      })
      .catch((err) => console.log(err));
  },
};
