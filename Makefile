install:
	npm install

dev:
	npm run dev

build:
	rm -rf dist
	npm run build-frontend
	npm run build-backend
	npm run build-configs

start:
	npm run start

lint:
	npx eslint .

test:
	npm run test

watch:
	npx jest --watch