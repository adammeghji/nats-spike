var NATS = require('nats');
var express = require('express');
var app = express();
var i = 1;

var nats = NATS.connect('nats://ruser:T0pS3cr3t@gnatsd:4222');

app.get('/', function (req, res) {
  var msg = "MSG-" + i;
  i++;
  nats.requestOne('api', msg, {}, 10, function(response) {
    var body = "a";
    if (response.code && response.code === NATS.REQ_TIMEOUT) {
      body = msg + ': API Request timed out.';
    } else {
      body = msg + ': ' + response;
    }
    console.log(body);
    res.status(200).send(`"${body}"`);
  });
});

app.listen(3000, function () {
  console.log('API listening on port 3000!');
});


// setInterval(function() {
//   var msg = "MSG-" + i;
//   i++;
//   nats.requestOne('api', msg, {}, 10, function(response) {
//     if(response.code && response.code === NATS.REQ_TIMEOUT) {
//       console.log(msg + ': API Request timed out.');
//       return;
//     }
//     console.log(msg + ': ' + response);
//   });
// }, 100);

setInterval(function() {
}, 100);
