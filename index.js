require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('dns');

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
app.use(express.urlencoded());

app.get('/api/shorturl/:shorturl', (req, res) => {
   let shortUrl = req.params.shorturl;
  // if (urlStore.url) 
  res.redirect(urlStore[shortUrl]);
});

app.post('/api/shorturl', (req, res) => {
  const original_url = req.body.url.replace(/(http:\/\/|https:\/\/)/g, '');

  dns.lookup(original_url, (err, address) => {
    if (err) { 
      console.error(err);
      res.json({error: 'invalid url'}) 
    } else {
      const short_url = Date.now().toString();
      urlStore[short_url] = original_url;
        
      res.json({ original_url , short_url });
    }
  });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
