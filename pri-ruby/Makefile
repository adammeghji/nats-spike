SHELL=/bin/bash

run:
	@bundle check || bundle --path .bundle/
	@bundle exec filewatcher --restart --immediate "**/*.rb" "bundle exec ruby server.rb"
