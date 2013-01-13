install:
	npm install

build: install
	@make -C ./lib/client build

.PHONY: install 
