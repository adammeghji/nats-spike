require 'nats/client'

puts ARGV.inspect
num = ARGV[0] || 0

NATS.start(servers: ['nats://ruser:T0pS3cr3t@gnatsd:4222']) do
  puts "Ruby Server ##{num} Listening to channel \"api\""
  NATS.subscribe('api', queue: 'api.requests') do |msg, reply|
    puts "Handling #{msg}"
    NATS.publish(reply, "Ruby Server ##{num}: #{msg}-REPLY")
  end
end
