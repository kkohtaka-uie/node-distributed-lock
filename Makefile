MOCHA=./node_modules/mocha/bin/mocha
JSLINT=./node_modules/jslint/bin/jslint.js

test:
	 ${MOCHA} \
		--recursive \
		--reporter spec \
			./test/;

lint:
	find ./lib/ -name "*.js" | xargs ${JSLINT};
	find ./test/ -name "*.js" | xargs ${JSLINT};

.PHONY: test lint
