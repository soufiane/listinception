
build: components index.js
	@component build --dev

components: component.json
	@component install --dev

template:
	echo -ne "var jade = require('jade-runtime');\nmodule.exports = " > ./templates/error.js
	cat ./templates/error.jade | jade -c -D > template.tmp
	cat template.tmp >> ./templates/error.js
	

	rm template.tmp
	

clean:
	rm -fr build components template.js

.PHONY: clean
