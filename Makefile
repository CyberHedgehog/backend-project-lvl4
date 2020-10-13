install:
	npm install

start-backend:
	npx nodemon --exec npx babel-node server/bin/server.js

start-frontend:
	npx webpack-dev-server

start:
	npm run start

debug:
	DEBUG=app npx gulp run

build:
	npm run build-frontend
	npm run build-backend

lint:
	npx eslint .

test:
	npm run test

watch:
	npx jest --watch