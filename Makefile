install:
	npm install

test:
	npm test

test-coverage:
	npm test -- --coverage

lint:
	npx eslint .

.PHONY: test
