require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('dns');
const url = require('url');

const app = express();
const urlStore = {};

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/shorturl/:shorturl', (req, res) => {
   let shortUrl = req.params.shorturl;
  res.redirect(urlStore[shortUrl]);
});

app.post('/api/shorturl', async (req, res) => {
  const originalUrl = req.body.url;
  const invalidObj = { error: 'invalid url' };

  try {
    const urlObj = new URL(originalUrl);
    if (urlObj.protocol && urlObj.hostname) {
      const shortUrl = Date.now().toString();
      urlStore[shortUrl] = originalUrl;

      const address = await dns.promises.lookup(urlObj.hostname);
      res.json({ originalUrl, shortUrl });
    } else {
      res.json(invalidObj);
    }
  } catch (err) {
    res.json(invalidObj);
  }
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
