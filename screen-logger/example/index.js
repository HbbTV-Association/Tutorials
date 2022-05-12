window.addEventListener("load", init);

var nav;

function init() {
  var appManager = document.getElementById("applicationManager");
  var appObject = appManager.getOwnerApplication(document);
  if (appObject) {
    appObject.show();

    nav = new NavList(examples, "app");

    rcUtils.setKeyset(rcUtils.MASK_CONSTANT_NAVIGATION);
    rcUtils.registerKeyEventListener();
  }
}

function handleKeyCode(keyCode) {
  switch (keyCode) {
    case VK_UP:
      nav.up();
      break;
    case VK_DOWN:
      nav.down();
      break;
    case VK_ENTER:
      nav.run();
      break;
  }
}

/*
 * Select list element that can be navigated with up and down commands.
 * up() and down() could for example be invoked by key event handlers.
 */
var NavList = function (items, parentId) {
  var i, li;
  var ul = document.createElement("ul");
  this.items = [];
  this.navIndex = 0;

  for (i = 0; i < items.length; i++) {
    li = document.createElement("li");
    li.innerHTML = items[i].name;
    li.run = items[i].func;
    ul.appendChild(li);
    this.items.push(li);
  }
  document.getElementById(parentId).appendChild(ul);
  this.moveFocus();
};

NavList.prototype.up = function () {
  --this.navIndex;
  this.navIndex = this.navIndex < 0 ? this.items.length - 1 : this.navIndex;
  this.moveFocus();
};

NavList.prototype.down = function () {
  ++this.navIndex;
  this.navIndex = this.navIndex >= this.items.length ? 0 : this.navIndex;
  this.moveFocus();
};

NavList.prototype.moveFocus = function () {
  for (var i = 0; i < this.items.length; i++) {
    this.items[i].setAttribute("class", i === this.navIndex ? "focus" : "");
  }
};

NavList.prototype.run = function () {
  this.items[this.navIndex].run();
};

/*
 * List of code examples demoing the usage of Logger
 */
var examples = [
  {
    name: "Simple log message",
    func: function () {
      defaultSettings();
      var logger = new Logger();
      logger.log("A simple log message");
    },
  },
  {
    name: "Arguments of logging methods",
    func: function () {
      defaultSettings();
      var product = "apple";
      var quantity = 1;
      var logger = new Logger();
      logger.log("Customer bought", quantity, product);
    },
  },
  {
    name: "Tagged logger",
    func: function () {
      defaultSettings();
      var logger = new Logger("basic-logger");
      logger.log("A simple log message");
    },
  },
  {
    name: "Multiple loggers",
    func: function () {
      defaultSettings();
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
    },
  },
  {
    name: "verbosityLevel: verbose",
    func: function () {
      oneMessagePerLevel(Logger.Level.VERBOSE, "verbose");
    },
  },
  {
    name: "verbosityLevel: debug",
    func: function () {
      oneMessagePerLevel(Logger.Level.DEBUG, "debug");
    },
  },
  {
    name: "verbosityLevel: info",
    func: function () {
      oneMessagePerLevel(Logger.Level.INFO, "info");
    },
  },
  {
    name: "verbosityLevel: warn",
    func: function () {
      oneMessagePerLevel(Logger.Level.WARN, "warn");
    },
  },
  {
    name: "verbosityLevel: error",
    func: function () {
      oneMessagePerLevel(Logger.Level.ERROR, "error");
    },
  },
  {
    name: "Toggle visibility",
    func: function () {
      Logger.toggle();
    },
  },
  {
    name: "Clear Log",
    func: function () {
      Logger.clear();
    },
  },
];

function oneMessagePerLevel(level, levelName) {
  Logger.Config.triggerLevel = level;
  Logger.Config.verbosityLevel = level;
  var logger = new Logger("log-level-demo");
  logger.log("A log message", "@verbosityLevel", "'" + levelName + "'");
  logger.verbose("Verbose message", "@verbosityLevel", "'" + levelName + "'");
  logger.debug("Debug message", "@verbosityLevel", "'" + levelName + "'");
  logger.info("Info message", "@verbosityLevel", "'" + levelName + "'");
  logger.warn("Warning", "@verbosityLevel", "'" + levelName + "'");
  logger.error("Error message", "@verbosityLevel", "'" + levelName + "'");
}

function defaultSettings() {
  Logger.Config.triggerLevel = Logger.Level.VERBOSE;
  Logger.Config.verbosityLevel = Logger.Level.VERBOSE;
}
