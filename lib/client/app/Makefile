COMPONENT=../../../node_modules/component/bin/component
#build: components index.js
build: components templates
	@$(COMPONENT) build -o ../../../public/ -n app --dev

components: component.json
	@$(COMPONENT) install --dev

templates:
	@make -C ../list-view/ template
	@make -C ../error/ template

clean:
	rm -fr build components template.js
	rm -fr ../../../public/{app.js,app.css}

.PHONY: clean
