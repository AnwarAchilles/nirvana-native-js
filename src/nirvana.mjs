import Core from "./nirvana.core";

/**
 * The `Nirvana` class represents the Nirvana JavaScript environment.
 * It provides various methods and features for configuring and managing the environment.
 * 
 * @class Nirvana
 */
export default class Nirvana {
  /**
   * Configures the environment.
   *
   * @param {Object} environment - An object containing key-value pairs to reconfigure the environment
   */
  static environment(environment) {
    window["NirvanaListen"] = new Map();
    
    // Configure if present in the environment object
    if (environment.configure) {
      Core._configure = new Map([...Core._configure, ...Object.entries(environment.configure)]);
    }

    // Configure provider if present in the environment object
    if (environment.provider) {
      Core._provider = new Map([...Core._provider, ...Object.entries(environment.provider)]);
    }

    // Configure service if present in the environment object
    if (environment.service) {
      Core._service = new Map([...Core._service, ...Object.entries(environment.service)]);
    }

    // Set each provider as a property of the Core class
    Core._provider.forEach((provider, name) => {
      this[name] = provider;
    });

    // Load Service
    Core._service.forEach((Service, name) => {
      if (typeof window[name] === "function") {
        console.log("Nirvana-Service: " + name + "() Already Exists");
      } else {
        window[name] = Service;
      }
    });

    // Set the Core object as a property of the global window object
    window[Core._configure.get("constant")] = this;

    // Set up monitoring if enabled
    if (environment.showMonitor) {
      this.showMonitor = environment.showMonitor;
      this.setupMonitoring();
    }

    // Start listening for issues
    this.monitoring();
  }

  /**
   * Set up the monitoring display.
   */
  static setupMonitoring() {
    // Create a div element for the monitoring display
    let elementMonitor = document.createElement("div");
    elementMonitor.style.position = "fixed";
    elementMonitor.style.bottom = 0;
    elementMonitor.style.padding = "2px 5px";
    elementMonitor.style.maxHeight = "20%";
    elementMonitor.style.width = "100%";
    elementMonitor.style.overflow = "auto";
    elementMonitor.style.fontSize = "12px";
    document.body.append(elementMonitor);

    // Create an unordered list for displaying issues
    let elementIssue = document.createElement("ul");
    elementIssue.setAttribute("nv-monitor", "issue");
    elementIssue.innerHTML = "";
    elementIssue.style.display = "flex";
    elementIssue.style.flexDirection = "column-reverse";
    elementIssue.style.bottom = 0;
    elementIssue.style.padding = 0;
    elementIssue.style.listStyleType = "none";
    elementIssue.style.margin = 0;
    elementMonitor.append(elementIssue);
  }

  /**
   * Generates a component and sets it in the Core.Nest registry.
   *
   * @param {string|object} nameOrComponent - The name of the component or an object representing the component.
   * @param {object} component - An optional object representing the nested component.
   * @return {undefined}
   */
  static component(nameOrComponent, component) {
    let nameComponent = "";
    let classComponent = {};

    // Check if a nested component is provided
    if (component) {
      nameComponent = `${nameOrComponent}${Core._configure.get("separator")}${component.name}`;
      classComponent = component;
    } else {
      // If no nested component is provided, use the name of the component object
      nameComponent = nameOrComponent.name;
      classComponent = nameOrComponent;
    }

    // Check if the component is of type Nirvana and update the component and selector properties
    if (classComponent.__proto__.name === 'Nirvana') {
      classComponent.component = nameComponent;
      classComponent.selector = nameComponent.split(".").map(partName => this.selector('component', partName)).join(" ");
    }

    // Set the component in the Core.Nest registry
    Core._component.set(nameComponent, classComponent);
    return this;
  }

  /**
   * Set a provider for a given name.
   *
   * @param {string} name - The name of the provider.
   * @param {any} provider - The provider to set.
   * @returns {Class} - The current class instance.
   */
  static provider(name, provider) {
    // Set the provider in the Core provider map
    Core._provider.set(name, provider);

    // Set the provider as a property of the current class instance
    this[name] = provider;

    // Return the current class instance
    return this;
  }

  /**
   * Sets a service in the Core service map.
   * (Deprecated)
   */
  static service(service) {
    if (typeof window[service.name] === "function") {
      console.log("Nirvana-Service: " + service + "() Already Exists");
    } else {
      window[service.name] = service;
    }
  }

  /**
   * Stores data in the Core._store map.
   *
   * @param {string} name - The name of the data to be stored.
   * @param {object} data - The data to be stored.
   * @return {Map} The stored data.
   */
  static store(name, data) {
    if (Core._store.has(name)) { // check if the data already exists
      if (data) { // check if new data is provided
        const lastData = Core._store.get(name); // retrieve the existing data
        const newData = new Map(Object.entries(data)); // create a new map from the provided data
        Core._store.set(name, new Map([...lastData, ...newData])); // merge the existing data with the new data and update the map
        return Core._store.get(name); // return the updated data
      } else {
        return Core._store.get(name); // if no new data is provided, return the existing data
      }
    } else {
      if (data) { // check if new data is provided
        Core._store.set(name, new Map(Object.entries(data))); // create a new map from the provided data and store it
        return Core._store.get(name); // return the stored data
      } else {
        Core._store.set(name, new Map()); // if no new data is provided, store an empty map
        return Core._store.get(name); // return the stored data
      }
    }
  }

  /**
   * Load a component by name if it exists in the Core's component registry.
   * 
   * @param {string} name - The name of the component to load.
   * @returns {object|undefined} - The loaded component or undefined if not found.
   */
  static load(name) {
    if (Core._component.has(name)) {
      const component = Core._component.get(name);

      /**
       * Create a new instance of the loaded component.
       * 
       * @param {object} parameter - An object containing parameters for the component.
       * @returns {object} - The resulting component instance.
       */
      component.instance = (parameter) => {
        return new component({ ...parameter });
      };

      return component;
    }
  }

  /**
   * Run a component based on certain conditions.
   * 
   * @param {string} name - The name of the component.
   * @param {object} parameter - An object containing parameters.
   * @returns {object} - The resulting component instance.
   */
  static run(name, parameter) {
    const component = Core._component.get(name);
    const instanceComponent = new component({ ...parameter });

    // Check if the component has a 'state' property in its constructor
    if (instanceComponent.constructor.state) {
      return instanceComponent;
    }

    // Check if the component has a 'component' property
    if (component.component) {
      // Create a CloningComponent with undefined methods
      const CloningComponent = class {};
      const listMethod = Object.getOwnPropertyNames(component.prototype).filter(methodName => typeof instanceComponent[methodName] === 'function');
      listMethod.forEach(methodName => {
        CloningComponent.prototype[methodName] = () => undefined;
      });
      return new CloningComponent();
    }

    // Return the original component instance
    return instanceComponent;
  }

  /**
   * Returns an array of elements that match the given prefix and name.
   *
   * @param {string} prefix - The prefix to match elements.
   * @param {string} [name=''] - The name to match elements (optional, default is an empty string).
   * @param {document} parent - The parent elements for start selector.
   * @returns {Array} - An array of elements that match the given prefix and name.
   */
  static element(prefix, name = '', parent = document.querySelector("body")) {
    // Use the selector method to generate a selector string
    const selector = this.selector(prefix, name);
    
    // Use document.querySelectorAll to find all elements that match the selector
    return parent.querySelectorAll(selector);
  }

  /**
   * Generates a selector based on a prefix and name.
   *
   * @param {string} prefix - The prefix to add to the selector.
   * @param {string} [name=''] - The name to add to the selector. Default is an empty string.
   * @returns {string} The generated selector.
   */
  static selector(prefix, name = '') {
    // Get the lowercase constant value from the configuration
    const constant = Core._configure.get("constant").toLowerCase();

    // Add the prefix to the selector if it is provided
    const prefixer = prefix ? `-${prefix}` : '';

    // Generate the selector based on the prefix and name
    const selector = name ? `[${constant}${prefixer}='${name}']` : `[${constant}${prefixer}]`;

    return selector;
  }

  /**
   * Adds an issue to the Core issue list or returns the entire issue list.
   *
   * @param {string} name - The name of the issue.
   * @param {string} message - The message of the issue.
   * @return {Array} - The entire issue list if no name is provided.
   */
  static issue(name = '', message = '') {
    if (name) {
      Core._issue.set(name, message);
    } else {
      return Core._issue;
    }
    this.monitoring();
  }

  /**
   * Monitors issues and displays them.
   */
  static monitoring() {
    console.clear();
    if (this.showMonitor) {
      this.element("monitor", "issue").item(0).innerHTML = `<li>🚀 Nirvana ${Core._version} running ..</li>`;
      Core._issue.forEach((message, name) => {
        let boxIssue = document.createElement("li");
        name = name.split(":");
        boxIssue.innerHTML = `${name[0]} ⌬ ${name[1]} 𝄖 ${message}`;
        boxIssue.style.borderTop = "1px solid rgba(0,0,0,0.1)";
        this.element("monitor", "issue").item(0).append(boxIssue);
      });
      if (this.element("monitor", "issue").item(0).querySelector("li:nth-child(" + (Core._issue.size + 1) + ")")) {
        this.element("monitor", "issue").item(0).querySelector("li:nth-child(" + (Core._issue.size + 1) + ")").style.backgroundColor = "rgba(100,100,100,0.1)";
      }
    } else {
      console.debug(`🚀 Nirvana ${Core._version} running ..`);
      Core._issue.forEach((message, name) => {
        name = name.split(":");
        console.debug(`${name[0]} ⌬ ${name[1]} 𝄖 ${message}`);
      });
    }
  }

  /**
   * The selected element in the DOM.
   *
   * @type {Element}
   */
  element = document.querySelector("body");

  /**
   * Constructs a new instance of the class.
   */
  constructor() {
    if (this.element.querySelector(this.constructor.selector)) {
      this.constructor.state = true;
      this.element = this.element.querySelector(this.constructor.selector);
    } else {
      Nirvana.issue("Component:" + this.constructor.name, `Element Not Found
        add attribute "${this.constructor.selector}" to element
      `);
    }
  }

  /**
   * Selects elements from the DOM based on the given selector.
   *
   * @param {string} selector - The CSS selector used to select elements.
   * @return {NodeList} - A list of elements that match the selector.
   */
  select(selector) {
    return this.element.querySelectorAll(selector);
  }
}
