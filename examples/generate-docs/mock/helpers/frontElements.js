import { createDataLayerManager } from "../../../../src/datalayerManager.js";

export const window = {
  dataLayer: [],
  document : {
    title: "Google",
    elements: {},
    eventListeners: {},
    getElementById: function(id) {
      console.log(`Called getElementById with id: ${id}`);
      return this.elements[id] || null;
    },
    addElement: function(id, element) {
      this.elements[id] = element;
    },
    addEventListener: function(event, callback) {
      console.log(`Event listener added for event: ${event}`);
      if (!this.eventListeners[event]) {
        this.eventListeners[event] = [];
      }
      this.eventListeners[event].push(callback);
    },
    triggerEvent: function(event) {
      console.log(`Event triggered: ${event}`);
      if (this.eventListeners[event]) {
        this.eventListeners[event].forEach(callback => callback());
      }
    }
  },
  location: {
    href: "https://www.google.com.br/search",
    pathname: "/search",
  }
}

export function createElement(id) {
  return {
    id: id,
    textContent: '',
    listeners: {},
    addEventListener: function(event, callback) {
      console.log(`Event listener added for ${event} on element with id: ${this.id}`);
      if (!this.listeners[event]) {
        this.listeners[event] = [];
      }
      this.listeners[event].push(callback);
    },
    triggerEvent: function(event) {
      console.log(`Event triggered: ${event} on element with id: ${this.id}`);
      if (this.listeners[event]) {
        this.listeners[event].forEach(callback => callback());
      }
    }
  };
}

export function simulateAllEvents(dataLayerTemplate, dataLayerHelpers) {
  const dataLayerResults = {}
  Object.keys(dataLayerTemplate).forEach((templateKey) => {
    const template = dataLayerTemplate[templateKey];
    window.document.addElement(template.target, createElement(template.target === 'body' ? 'body' : 'div'))
    const element = template.target === 'document' ? window.document : window.document.getElementById(template.target);

    const functionsToExecute = (event) => {
      const dataLayerManager = createDataLayerManager(event, template, window, dataLayerHelpers);
      template.executeList.forEach((execute) => {
        dataLayerManager[execute]();
      })
    };

    element.addEventListener(template.trigger, functionsToExecute);

    element.triggerEvent(template.trigger);
    dataLayerResults[templateKey] = window.dataLayer[window.dataLayer.length - 1];
    console.log(JSON.stringify(window.dataLayer[window.dataLayer.length - 1], null, 2));
  });
  return dataLayerResults;
}
