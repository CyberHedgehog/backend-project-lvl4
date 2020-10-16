install:
	npm install

start:
	npm run start

dev:
	npm run dev

build:
	npm run build-frontend
	npm run build-backend

lint:
	npx eslint .

test:
	npm run test

watch:
	npx jest --watch