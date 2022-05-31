# Basic Screen Logger

HbbTV terminals have no `console` object to print messages for debugging. However, during development, you may want to be able to visualise state information of your HbbTV app; for example to see if everything works as expected or to find the cause for unexpected behaviour. This repository provides a basic logging utility, which prints log messages to the graphical user interface of your app. It achieves this by appending log messages to a `<div>` container, which it appends to the `<body>` element of the app's document. There are plenty of other ways to implement screen loggers. This utility may help you debug your HbbTV app right away and may be a starting point and inspiration for you to develop your own more elaborate logging solution.

## Installation

The utility comprises a JavaScript script and a CSS stylesheet for basic styling of the log messages.

For _adding the stylesheet_ you have two options:

- Add the stylesheet to your app's document `<link rel="stylesheet" href="logger.css" />`
- Append the code to any of the CSS files in your document

For _adding the JavaScript_ you have two options:

- Add the script to your app's document `<script type="text/javascript" src="main.js"></script>`
- Copy and paste the code to your main javascript file.

There should be no interference with members of your script, as the code in the logging script is scoped in a closure. The only object that the script will make available on global scope is the `Logger` object.

## Usage

The `Logger` object exposes all the features you need to instantiate loggers, write log messages and to set global logging configurations.

### Create loggers and write log messages

_Example 1:_ **Instantiate logger and write log message**

Create instances of `Logger` with the new operator.

```javascript
var logger = new Logger();
logger.log("A simple log message");

// Will print:
// 1. This is a simple log message
```

_Example 2_: **Arguments of the log methods**

Logging methods of `Logger` can handle arguments of type `string` or `number`. You can pass as many arguments as you like. `Logger` will concatenate them with a single space delimiter.

```javascript
var product = "apple";
var quantity = 1;
logger.log("Customer bought", quantity, product);

// Will print:
// 1. Customer bought 1 apple
```

_Example 3:_ **Add a tag name to your logger**

You can pass an optional tag name that, if set, will prefix all log messages of that logger instance. You could, for example, create instances of `Logger` per class or per module, which may help keeping track of where in your code the log line has been invoked.

```javascript
var logger = new Logger("basic-logger");
logger.log("A simple log message");

// Will print:
// 1. [basic-logger]: A simple log message
```

_Example 4:_ **Use multiple instances of Logger**

All instances of logger which print to the same `div` container in your app's document.

```javascript
var CarFactory = (function () {
  var factoryLogger = new Logger("factory-logger");
  var carLogger = new Logger("car-logger");

  var Car = function (numDoors) {
    this.numDoors = numDoors;
    carLogger.log("Car has", numDoors, "doors");
  };

  return {
    createCar: function (numDoors) {
      factoryLogger.log("Creating new car");
      return new Car(numDoors);
    },
  };
})();

CarFactory.createCar(4);

// Will print:
// 1. [factory-logger]: Creating new car
// 2. [car-logger]: Car has 4 doors
```

_Example 5:_ **Make use of different log levels**

Instances of `Logger` provide logging methods for different levels of importance of log messages. Log messages are prefixed with the respective log level. Following log levels are supported (sorted from low to high importance): `VERBOSE`, `DEBUG`, `INFO`, `WARN`, `ERROR`.

```javascript
var logger = new Logger("log-level-demo");
logger.log("A log message");
logger.verbose("A verbose log message");
logger.debug("A debug message");
logger.info("An info message");
logger.warn("A warning");
logger.error("An error message");

// Will print:
// 1. [log-level-demo]: A log message
// 2. [log-level-demo]: VERBOSE: A verbose log message
// 3. [log-level-demo]: DEBUG: A debug message
// 4. [log-level-demo]: INFO: An info message
// 5. [log-level-demo]: WARN: A warning
// 6. [log-level-demo]: ERROR: An error message
```

_Example 6_: **Styling of log messages**

For different log levels, logger adds different classes to elements in the document that represent log messages. By default, the font color of log and debug messages is black. Verbose messages appear in gray, info messages in green, warnings in orange and error messages in red. You can change the appearance of log messages by changing the default style definition in the `logger.css` stylesheet:

```css
.logger .verbose {
  color: gray;
}

.logger .debug {
  color: black;
}

.logger .info {
  color: green;
}

.logger .warn {
  color: orange;
}

.logger .error {
  color: red;
}
```

_Example 7_: **Clear log**

To clear the log run:

```javascript
Logger.clear();
```

### Visibility of the logs

By default, all log messages that reach the default *verbosity level* `DEBUG` will be appended to the container element for log messages. By default, this container will only be visible in the UI if a log message is written that reaches the default *trigger level* `ERROR`. Section [Configuration](configuration) explains how you can change the trigger and verbosity levels.

Logs written with `logger.log()` trigger the logger's visibility at trigger level `DEBUG`. Theyquantity are captured at verbosity level `DEBUG` or lower.

You can also programmatically show and hide the log:

```javascript
Logger.show(); // This will show the logger
Logger.hide(); // This will hide the logger
Logger.toggle(); // This will change the current visibility state
```

These methods could for example be invoked by key event handlers. This allows you, for example, to toggle the log container's visibility with the press of a button on the remote.

### Configuration

The global `Logger` object exposes the `Config` object which you can use to configure the logger. Values in the below example are the default config values:

```javascript
// If set true all log messages are prefixed with a line number.
Logger.Config.lineCountActive = true;
 
// To prevent screen overflow, Logger removes older log messages
// from the log container if the maximum number of log lines
// is exceeded.
Logger.Config.maxLines = 15;
 
// The log level that triggers visibility of the logger
Logger.Config.triggerLevel = Logger.Level.ERROR;
 
// Threshold that a log message’s log level needs reach in order
// to appear in the log container
Logger.Config.verbosityLevel = Logger.Level.DEBUG;
```
