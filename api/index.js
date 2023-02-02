const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const minutesToMs = (n) => (n * 60 * 1000);

const limiter = rateLimit({
	windowMs: minutesToMs(1), // 15 minutes
	max: 50, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "Too much requests, wait a little bit."
})

const app = express();
const port = 8081;
const bodyParser = require("body-parser");
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(limiter);
app.use("/", router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

async function getSteamLink(steamId) {
  const website = 'https://steamcommunity.com/id/';
  try {
    const response = await axios(website + steamId);
    const html = response.data;
    const $ = cheerio.load(html);
    return $('.profile_in_game_joingame > a').attr('href');

  } catch (error) {
    console.log(error, error.message);
    return false;
  }
}

router.post('/get-steam-link', async (request, response) => {
  try {
    console.log(request.body);
    const steamId = request.body.steamId;
    if (!steamId) {
      throw new Error('No steamId passed in the body');
    }
    const steamLink = await getSteamLink(steamId);
    if (steamLink) {
      response.send({
        status: 200,
        message: steamLink
      });
      return;
    }
    response.send({
      status: 400,
      error: 'An error ocurred, verify if you typed your Steam ID correctly, if you have your account set as public or if you are in a Blazblue CF Lobby'
    });
  } catch (error) {
    response.send({
      status: 400,
      error: 'Request malformed'
    })
  }
});