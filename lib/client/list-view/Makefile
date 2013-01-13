
build: components index.js
	@component build --dev

components: component.json
	@component install --dev

template: ./templates/list.jade ./templates/share.jade
	echo -ne "var jade = require('jade-runtime');\nmodule.exports = " > ./templates/list.js
	cat ./templates/list.jade | jade -c -D > template.tmp
	cat template.tmp >> ./templates/list.js
	
	echo -ne "var jade = require('jade-runtime');\nmodule.exports = " > ./templates/share.js
	cat ./templates/share.jade | jade -c -D > template.tmp
	cat template.tmp >> ./templates/share.js

	echo -ne "var jade = require('jade-runtime');\nmodule.exports = " > ./templates/collaborator.js
	cat ./templates/collaborator.jade | jade -c -D > template.tmp
	cat template.tmp >> ./templates/collaborator.js

	echo -ne "var jade = require('jade-runtime');\nmodule.exports = " > ./templates/action-tooltip.js
	cat ./templates/action-tooltip.jade | jade -c -D > template.tmp
	cat template.tmp >> ./templates/action-tooltip.js




	rm template.tmp
	

clean:
	rm -fr build components template.js

.PHONY: clean
