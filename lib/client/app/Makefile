
#build: components index.js
build: components
	@component build -o ../../../public/ -n app --dev

components: component.json
	@component install --dev

clean:
	rm -fr build components template.js
	rm -fr ../../../public/{app.js,app.css}

.PHONY: clean
