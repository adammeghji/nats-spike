# nats-spike

I was curious to see if a NATS queue could be used to dispatch API requests across different backends.  This would allow you to have 1 thin API layer which proxies requests into a queue, which would be consumed, handled, and replied by individual services agnostic of their language, framework, or implementation decisions.

In this example, we have:
 1. a central NATS server using `gnatsd`
 2. a thin HTTP API exposed via port 3000 that responds to `GET /`
 3. 1 x NodeJS consumer which handles responses to `GET /`
 4. 2 x Ruby consumers which handle responses to `GET /`

Some advantages:
 - Encourages flexibility with which service is consuming from the queues.  In this example, both NodeJS and Ruby consumers are handling the same request.  If we ever wanted to refactor this endpoint, or replace it with a more performant solution, you could have it consume from the queue simultaneously as the others, without needing to do a hard cutover for all requests hitting that route.
 - 1 central NATS cluster replaces the need for N internal services to have their own load balancers

## Usage

1. `docker-compose up` to bring up the stack
2. `siege -d 0.1 -n 100 -c1 http://localhost:3000/` to issue an onslaught of HTTP requests
3. HTTP requests will be accepted by the API, put on the NATS queue, and consumed by all backends (NodeJS + Ruby)

