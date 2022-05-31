(function (global) {
  var Level = {
    VERBOSE: 0,
    DEBUG: 1,
    INFO: 2,
    WARN: 3,
    ERROR: 4,
  };

  var Config = {
    lineCountActive: true,
    maxLines: 15,
    triggerLevel: Level.ERROR,
    verbosityLevel: Level.DEBUG,
  };

  var Console = (function () {
    var container = null;
    var isVisible = false;
    var numLines = 0;

    function createContainer() {
      container = document.createElement("div");
      container.setAttribute("class", "logger");
      document.getElementsByTagName("body")[0].appendChild(container);
    }

    function lineCount() {
      return ++numLines;
    }

    function trim(lineLimit) {
      var limit = typeof lineLimit === "number" ? lineLimit : Config.maxLines;
      while (container.childNodes.length > limit) {
        container.removeChild(container.firstChild);
      }
    }

    return {
      createLogLine: function (message) {
        if (container === null) createContainer();
        var p = document.createElement("p");
        p.innerHTML = Config.lineCountActive ? lineCount() + ". " : "";
        p.innerHTML += message;
        container.appendChild(p);
        trim();
        return p;
      },

      show: function () {
        if (container === null) createContainer();
        isVisible = true;
        container.style.display = "block";
      },

      hide: function () {
        if (container === null) createContainer();
        isVisible = false;
        container.style.display = "none";
      },

      toggle: function () {
        isVisible = !isVisible;
        if (isVisible) {
          Logger.show();
        } else {
          Logger.hide();
        }
      },

      showIfTriggerLevelReached(level) {
        if (level >= Config.triggerLevel) Console.show();
      },

      clear: function () {
        trim(0);
      },
    };
  })();

  var Logger = function (tag) {
    if (typeof tag === "string" && tag) {
      this.tag = "[" + tag + "]: ";
    } else {
      this.tag = "";
    }
  };

  Logger.prototype.__writeLine = function (message) {
    return Console.createLogLine(this.tag + message);
  };

  Logger.prototype.log = function () {
    Console.showIfTriggerLevelReached(Level.DEBUG);
    if (Level.DEBUG >= Config.verbosityLevel) {
      this.__writeLine(stringifyArguments.apply(null, arguments));
    }
  };

  Logger.prototype.verbose = function () {
    Console.showIfTriggerLevelReached(Level.VERBOSE);
    if (Level.VERBOSE >= Config.verbosityLevel) {
      var p = this.__writeLine(
        "VERBOSE: ",
        stringifyArguments.apply(null, arguments)
      );
      p.setAttribute("class", "verbose");
    }
  };

  Logger.prototype.debug = function () {
    Console.showIfTriggerLevelReached(Level.DEBUG);
    if (Level.DEBUG >= Config.verbosityLevel) {
      var p = this.__writeLine(
        "DEBUG: ",
        stringifyArguments.apply(null, arguments)
      );
      p.setAttribute("class", "debug");
    }
  };

  Logger.prototype.info = function () {
    Console.showIfTriggerLevelReached(Level.INFO);
    if (Level.INFO >= Config.verbosityLevel) {
      var p = this.__writeLine(
        "INFO: ",
        stringifyArguments.apply(null, arguments)
      );
      p.setAttribute("class", "info");
    }
  };

  Logger.prototype.warn = function () {
    Console.showIfTriggerLevelReached(Level.WARN);
    if (Level.WARN >= Config.verbosityLevel) {
      var p = this.__writeLine(
        "WARN: ",
        stringifyArguments.apply(null, arguments)
      );
      p.setAttribute("class", "warn");
    }
  };

  Logger.prototype.error = function () {
    Console.showIfTriggerLevelReached(Level.ERROR);
    if (Level.ERROR >= Config.verbosityLevel) {
      var p = this.__writeLine(
        "ERROR: ",
        stringifyArguments.apply(null, arguments)
      );
      p.setAttribute("class", "error");
    }
  };

  function stringifyArguments() {
    var i = 0;
    var str = "";
    for (i; i < arguments.length; i++) {
      str += arguments[i];
      str += i < arguments.length - 1 ? " " : "";
    }
    return str;
  }

  // Export closure members to global scope
  global.Logger = Logger;
  global.Logger.Config = Config;
  global.Logger.Level = Level;
  global.Logger.show = Console.show;
  global.Logger.hide = Console.hide;
  global.Logger.toggle = Console.toggle;
  global.Logger.clear = Console.clear;
})(this);
