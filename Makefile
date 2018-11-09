all: build

.PHONY: build
build:
	@truffle migrate

.PHONY: start/testrpc
start/testrpc:
	@ganache-cli -m "raise fold coral resemble gather program legend regular rival learn vivid trust"

.PHONY: deploy
deploy:
	@truffle deploy

.PHONY: deploy/rinkeby
deploy/rinkeby:
	@truffle deploy --network=rinkeby

.PHONY: test
test:
	@truffle test
