install:
	npm install

start:
	npx gulp run

debug:
	DEBUG=app npx gulp run

build:
	npm run build

lint:
	npx eslint .

test:
	npm test

watch:
	npx jest --watch