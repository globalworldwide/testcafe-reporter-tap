
.PHONY: test
test:
	yarn run gulp test

.PHONY: preview
preview:
	yarn run gulp preview

.PHONY: publish
publish:
	yarn run publish-please
