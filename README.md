# testcafe-reporter-tap-reporter-tap
[![Build Status](https://travis-ci.org/willscripted/testcafe-reporter-tap-reporter-tap.svg)](https://travis-ci.org/willscripted/testcafe-reporter-tap-reporter-tap)

This is the **tap-reporter-tap** reporter plugin for [TestCafe](http://devexpress.github.io/testcafe).

<p align="center">
    <img src="https://raw.github.com/willscripted/testcafe-reporter-tap-reporter-tap/master/media/preview.png" alt="preview" />
</p>

## Install

```
npm install testcafe-reporter-tap-reporter-tap
```

## Usage

When you run tests from the command line, specify the reporter name by using the `--reporter` option:

```
testcafe chrome 'path/to/test/file.js' --reporter tap-reporter-tap
```


When you use API, pass the reporter name to the `reporter()` method:

```js
testCafe
    .createRunner()
    .src('path/to/test/file.js')
    .browsers('chrome')
    .reporter('tap-reporter-tap') // <-
    .run();
```

## Author
Will O&#39;Brien 
