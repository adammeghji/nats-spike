SHELL=/bin/bash

up:
	@docker-compose up

down:
	@docker-compose down

test:
	curl -X POST -d '{"firstName":"Jane","lastName":"Doe"}' -H "Content-Type: application/json" localhost:3000/users

load-test:
	siege -c50 -t60S -H 'Content-Type: application/json' 'http://localhost:3000/users POST {"firstName":"Jane","lastName":"Doe"}'
