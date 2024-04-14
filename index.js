require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require("dns")
const bodyParser = require("body-parser")

// Basic Configuration
const port = process.env.PORT || 3000;
let urls = []

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post("/api/shorturl", (req, res) => {
  let url = req.body.url
  let urlObject = new URL(url)
  dns.lookup(urlObject.hostname, (e, address, family) => {
    if(e) return res.status(400).json({
      error: "invalid url"
    })
    let index = urls.length
    urls.push({ index: index + 1, value: url })
    return res.json({
      original_url: url,
      short_url: index + 1
    })
  })
})

app.get("/api/shorturl/:index", (req, res) => {
  let index = Number(req.params.index)
  if(index > urls.length) return res.status(400).json({
    error: "invalid url"
  })
  let url = urls[index - 1]
  res.redirect(url.value)
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
