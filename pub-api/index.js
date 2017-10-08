/*****************************************************************************/
// Configuration
/*****************************************************************************/

// web server
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// queue
const NATS = require('nats');
const nats = NATS.connect('nats://ruser:T0pS3cr3t@gnatsd:4222');

/*****************************************************************************/
// Type Definitions
/*****************************************************************************/
const protobuf = require('protobufjs');
let models = {};
protobuf.load("./proto/user.proto").then((root) => {
  models.User = root.lookupType("types.User");
  models.CreateUserRequest = root.lookupType("types.CreateUserRequest");
  models.CreateUserResponse = root.lookupType("types.CreateUserResponse");
});

/*****************************************************************************/
// Helpers
/*****************************************************************************/
const validateModel = (res, model, attributes) => {
  let errMsg = model.verify(attributes);
  if (errMsg) {
    res.status(422).send({"errors": errMsg});
    return false;
  }
};
const encodeModel = (model, attributes) => {
  return model.encode(model.create(attributes)).finish();
};

/*****************************************************************************/
// REST API
/*****************************************************************************/
app.post('/users', function (req, res) {

  // parse request parameters into User attributes
  let user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName
  };

  // validate the parameters according to our Protobuf types
  if (validateModel(res, models.User, user) == false) {
    // return the 422 Unexpected Entity
    return;
  }

  // since valid, put a CreateUserRequest message on the bus
  let buffer = encodeModel(models.CreateUserRequest, {
    user: user
  });

  nats.requestOne('api.accounts.createUser', buffer, {}, 1000, (response) => {
    let createUserResponse = null;

    // handle simple timeout scenarios
    if (response.code && response.code === NATS.REQ_TIMEOUT) {
      res.status(504).send({"errors": "timeout: api.accounts.createUser"});
      return;

    // with a response ..
    } else {

      // decode the response into its CreateUserResponse
      try {
        buffer = new Buffer(response, 'binary')
        createUserResponse = models.CreateUserResponse.decode(buffer);
      } catch (e) {
        if (e instanceof protobuf.util.ProtocolError) {
          res.status(500).send({"errors": 'ProtocolError'});
          return;
        } else {
          res.status(500).send({"errors": 'Unknown Error'});
          return;
        }
      }

      // since valid, respond to REST API consumer with a 201 Created
      res.status(201).send({
        id: createUserResponse.id}
      );
      return;
    }
  });
});

app.listen(3000, () => {
  console.log('API listening on port 3000!');
});
