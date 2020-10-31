install:
	npm install

start:
	npm run start

dev:
	npm run dev

build:
	rm -rf dist
	npm run build-frontend
	npm run build-backend
	npm run build-configs

lint:
	npx eslint .

test:
	npm run test

watch:
	npx jest --watch