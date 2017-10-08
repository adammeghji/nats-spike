/*****************************************************************************/
// Configuration
/*****************************************************************************/
const NATS = require('nats');
const server = NATS.connect(process.env.NATS_URL);

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
const encodeModel = (model, attributes) => {
  return model.encode(model.create(attributes)).finish();
};

/*****************************************************************************/
// Subscribers
/*****************************************************************************/
server.subscribe('api.accounts.createUser', {'queue':'api.requests'}, (request, replyTo) => {
  let request_buffer = new Buffer(request, 'binary')
  const createUserRequest = models.CreateUserRequest.decode(request_buffer);
  const user = createUserRequest.user;
  console.log(`NodeJS Server: created ${user.firstName} ${user.lastName}`);

  let response_buffer = encodeModel(models.CreateUserResponse, {
    id: Math.random() * 10000,
    success: true
  });
  server.publish(replyTo, response_buffer);
});
console.log('NodeJS Server #1 Listening to channel "api"')
