###############################################################################
# Configuration
###############################################################################
ENV['APP_ENV'] ||= 'development'

require 'nats/client'
require 'pry' if ENV['APP_ENV'] == 'development'

###############################################################################
# Type Definitions
###############################################################################
require './proto/ruby/user_pb.rb'

###############################################################################
# Subscribers
###############################################################################
NATS.start(servers: [ENV['NATS_URL']]) do
  puts "Ruby Server [#{ENV['APP_ENV']}]: Listening to channel \"api\""
  NATS.subscribe('api.accounts.createUser', queue: 'api.requests') do |msg, reply|
    request = Types::CreateUserRequest.decode(msg)
    user = request.user
    puts "Ruby Server: created #{user.first_name} #{user.last_name}"

    message = Types::CreateUserResponse.new(
      id: rand(10_000),
      success: true
    )

    NATS.publish(reply, Types::CreateUserResponse.encode(message))
  end
end
