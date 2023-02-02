const express = require("express");
const app = express()
const port = 80


app.use(express.static("build"));
app.use(function(req, res, next) {
  console.log("Failed to load " + req.url);
  if (req.accepts('html')) {
    res.send(fs.readFile);
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.json({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});
app.use(function(req, res, next, err) {
  console.error(err);
})
app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})