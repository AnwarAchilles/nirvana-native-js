/**
 * The core class for Nirvana.
 *
 * @class NirvanaCore
 */
class NirvanaCore {
  /**
   * The version of Nirvana.
   *
   * @static
   * @type {number}
   * @memberof NirvanaCore
   */
  static _version = 3.8;

  /**
   * The configuration settings for the todo list environment.
   *
   * @static
   * @type {Map<string, string>}
   * @memberof NirvanaCore
   */
  static _configure = new Map([
    ["constant", "Nirvana"],
    ["separator", "."],
    ["issueTracking", false]
  ]);

  /**
   * The manifest for the todo list data.
   *
   * @static
   * @type {Map<string, string>}
   * @memberof NirvanaCore
   */
  static _manifest = new Map();

  /**
   * The components for the todo list.
   *
   * @static
   * @type {Map<any, any>}
   * @memberof NirvanaCore
   */
  static _component = new Map();

  /**
   * The providers for the todo list.
   *
   * @static
   * @type {Map<any, any>}
   * @memberof NirvanaCore
   */
  static _provider = new Map();

  /**
   * The services for the todo list.
   *
   * @static
   * @type {Map<any, any>}
   * @memberof NirvanaCore
   */
  static _service = new Map(Object.entries({
    select: ( selector )=> {
      return document.querySelectorAll(selector);
    },
    protect: ( outputFunction ) => {
      try {
        outputFunction();
      }catch(e) {
        console.error(e);
      }
    },
    listen: (condition) => {
      let timeoutId;
      const checkCondition = () => {
        if (!condition()) {
          // If condition is not met, wait and check again
          timeoutId = setTimeout(checkCondition, 10);
        } else {
          // If condition is met, resolve promise
          clearTimeout(timeoutId);
        }
      };
      // Start listening
      checkCondition();
      // Return a promise
      return new Promise((resolve) => {
        resolve();
      });
    },
    inuqueID: (prefix = "") => {
      return `${prefix}${Date.now()}${Math.floor(Math.random() * 100000)}`;
    },
    lowercase: (stringText)=> {
      return stringText.toLowerCase();
    },
    uppercase: (stringText)=>  {
      return stringText.toUpperCase();
    },
    capitalize: (stringText)=> {
      return stringText.charAt(0).toUpperCase() + stringText.slice(1);
    }
  }));

  /**
   * The stores for the todo list.
   *
   * @static
   * @type {Map<any, any>}
   * @memberof NirvanaCore
   */

  static _store = new Map();


  /**
   * Array to store issues.
   *
   * @static
   * @type {Array}
   * @memberof NirvanaCore
   */
  static _issue = new Map();

}