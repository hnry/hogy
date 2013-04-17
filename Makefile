test:
		@mocha -R spec

pack:
		rm -rf package; rm -rf hogy*.tgz; 
		npm pack .

.PHONY: test