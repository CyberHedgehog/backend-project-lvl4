install:
	npm install

start:
	npx gulp run

lint:
	npx eslint .

test:
	npm test

watch:
	npx jest --watch