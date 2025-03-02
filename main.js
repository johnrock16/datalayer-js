function getObjectByPath(path, root) {
  const keys = path.split(/\.|\[|\]/).filter(Boolean);

  let result = root;
  for (let key of keys) {
    if (result !== undefined && result !== null) {
      const index = Number(key);
      if (!isNaN(index) && Array.isArray(result)) {
        result = result[index];
      } else {
        result = result[key];
      }
    } else {
      return undefined;
    }
  }

  return result;
}

function setObjectByPath(path, value, root) {
  const keys = path.split(/\.|\[|\]/).filter(Boolean);

  let result = root;
  for (let i = 0; i < keys.length - 1; i++) {
    let key = keys[i];

    const index = Number(key);
    if (!isNaN(index) && Array.isArray(result)) {

      if (result[index] === undefined) {
        result[index] = {};
      }
      result = result[index];
    } else {

      if (result[key] === undefined) {
        result[key] = {};
      }
      result = result[key];
    }
  }


  const lastKey = keys[keys.length - 1];
  const index = Number(lastKey);
  if (!isNaN(index) && Array.isArray(result)) {
    result[index] = value;
  } else {
    result[lastKey] = value;
  }
}

function dataLayerFunctions(event, template) {
  const eventDetails = template.eventDetails;
  const state = {
    event: event,
    previousFunctionReturn: null
  };

  const setState = (key, data, overridePreviousFunctionReturn = true) => {
    state[key] = data;
    if (overridePreviousFunctionReturn) {
      state.previousFunctionReturn = {name:key ,state: data}
    }
  }

  const getData = (canSetState = true) => {
    const obj = {};
    const eventDetailsLocal = state.data ? state.data : eventDetails;

    const getProcessedValue = (detailValue, state, index) => {
      if (typeof detailValue === 'string') {
        if (detailValue.indexOf('w__') === 0) {
          return getObjectByPath(detailValue.split('w__')[1], window);
        }
        if (detailValue.indexOf('e__') === 0) {
          return getObjectByPath(detailValue.split('e__')[1], state.event);
        }
        if (detailValue.indexOf('c__') === 0) {
          const path = detailValue.split('__');
          if (index !== null) {
            path[1] = path[1].replace('[]', `[${index}]`);
          }
          const obj = getObjectByPath(path[1], state);
          return obj;
        }
      }

      return detailValue;
    };

    const deepProcess = (value, state, index = null) => {
      if (Array.isArray(value)) {
        return value.map((item, i) => deepProcess(item, state, i));
      }

      if (typeof value === 'object' && value !== null) {
        const processedObj = {};
        Object.keys(value).forEach((key) => {
          processedObj[key] = deepProcess(value[key], state, index);
        });
        return processedObj;
      }
      return getProcessedValue(value, state, index);
    };

    Object.keys(eventDetailsLocal).forEach((detail) => {
      obj[detail] = deepProcess(eventDetailsLocal[detail], state);
    });

    if (canSetState) {
      setState('getData', obj);
    }

    return obj;
  };

  const pushData = () => {
    const data = getData(false);
    window.dataLayer.push(data);
  }

  function normalizeString(str) {
    if (/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(str)) {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, '').toLowerCase();
    }
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, '-');
  }

  function objectRunFunctionInDeep(obj, handle) {
    if (Array.isArray(obj)) {
      return obj.map(item => objectRunFunctionInDeep(item, handle));
    }

    if (typeof obj === 'object' && obj !== null) {
      const normalizedObj = {};
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          normalizedObj[key] = objectRunFunctionInDeep(obj[key], handle);
        }
      }
      return normalizedObj;
    }

    if (typeof obj === 'string') {
      return handle(obj);
    }

    return obj;
  }

  const formatString = () => {
    if (state.previousFunctionReturn?.state) {
      const obj = objectRunFunctionInDeep(state.previousFunctionReturn?.state, normalizeString);
      setState('data', obj);
    }
  }

  const checkIsTested = () => {
    setState('checkIsTested', true);
  }

  const retrieveFromEndpoint = () => {
    setState('retrieveFromEndpoint', {
      callback: true,
      userID: '768103821926'
    });
  }

  const retrieveProductItem = () => {
    setState('retrieveProductItem', {
      name: "Cool Shirt",
      id: "8321098316",
      brand: "Crowthes",
      category: "Apparel",
      variant: "Blue",
      price: 19.99
    });
  }

  const retrieveProductItems = () => {
    const product = {
      name: "Cool Shirt",
      id: "8321098316",
      brand: "Crowthes",
      category: "Apparel",
      variant: "Blue",
      price: 19.99
    }
    const product2 = {
      name: "Cool Hat",
      id: "1698748832",
      brand: "Crowthes Master",
      category: "Apparel",
      variant: "Blues",
      price: 27.87
    }
    setState('retrieveProductItems', [
      {...product},
      {...product2}
    ]);
  }

  const createArrayTemplate = () => {
    const [path] = template?.parameters.createArrayTemplate[0];
    const itemTemplate = getObjectByPath(path, eventDetails);
    setObjectByPath(path, state[state.previousFunctionReturn.name].map(() => itemTemplate[0]), eventDetails);
    template?.parameters.createArrayTemplate.shift();
  }

  return {
    pushData,
    getData,
    formatString,
    checkIsTested,
    retrieveFromEndpoint,
    retrieveProductItem,
    retrieveProductItems,
    createArrayTemplate
  }
}

const window = {
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

function createElement(id) {
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

const DATALAYER_TEMPLATE = {
  "page_view": {
    "target": "document",
    "trigger": "DOMContentLoaded",
    "executeList": ["checkIsTested", "retrieveFromEndpoint", "getData", "formatString", "pushData"],
    "eventDetails": {
      "event": "page_view",
      "page_location": "w__location.href",
      "page_path": "w__location.pathname",
      "page_title": "w__document.title",
      "custom_tested": "c__checkIsTested",
      "custom_callback": "c__retrieveFromEndpoint.callback",
      "custom_user": "c__retrieveFromEndpoint.userID",
    },
    "docs": {
      "description": "An event that detects when a page is viewed",
      "pages": "All pages",
    },
  },
  "view_item" : {
    "target": ".productCard",
    "trigger": "DOMContentLoaded",
    "executeList": ["retrieveProductItem", "getData", "formatString", "pushData"],
    "eventDetails": {
      "event": "view_item",
      "ecommerce": {
        "items": [{
          "item_name": 'c__retrieveProductItem.name',
          "item_id": 'c__retrieveProductItem.id',
          "item_brand": 'c__retrieveProductItem.brand',
          "item_category": 'c__retrieveProductItem.category',
          "item_variant": 'c__retrieveProductItem.variant',
          "price": 'c__retrieveProductItem.price'
        }]
      }
    },
    "docs": {
      "description": "An event to detects when a product item is viewed",
      "pages": "All pages with products",
    },
  },
  "view_items" : {
    "target": ".productCard",
    "trigger": "DOMContentLoaded",
    "executeList": ["retrieveProductItems", "createArrayTemplate", "createArrayTemplate", "getData", "formatString", "pushData"],
    "parameters": {
      "createArrayTemplate": [['ecommerce.items'], ['ecommerceSpecial.items']]
    },
    "eventDetails": {
      "event": "view_items",
      "ecommerce": {
        "items": [{
          "item_name": "c__retrieveProductItems[].name",
          "item_id": 'c__retrieveProductItems[].id',
          "item_brand": 'c__retrieveProductItems[].brand',
          "item_category": 'c__retrieveProductItems[].category',
          "item_variant": 'c__retrieveProductItems[].variant',
          "price": 'c__retrieveProductItems[].price'
        }]
      },
      "ecommerceSpecial": {
        "items": [{
          "item_name": 'c__retrieveProductItems[].name',
          "item_id": 'c__retrieveProductItems[].id',
          "item_brand": 'c__retrieveProductItems[].brand',
          "item_category": 'c__retrieveProductItems[].category',
          "item_variant": 'c__retrieveProductItems[].variant',
          "price": 'c__retrieveProductItems[].price'
        }]
      }
    },
    "docs": {
      "description": "An event to detects when a product list is viewed",
      "pages": "All pages with products",
    },
  }
}
const DATALAYER_TEMPLATE_ORIGINAL = JSON.parse(JSON.stringify(DATALAYER_TEMPLATE));
const datalayerResults = {};

window.document.addElement('body', createElement('body'));
window.document.addElement('.productCard', createElement('div'));

Object.keys(DATALAYER_TEMPLATE).forEach((templateKey) => {
  const template = DATALAYER_TEMPLATE[templateKey];
  const element = template.target === 'document' ? window.document : window.document.getElementById(template.target);

  const functionsToExecute = (event) => {
    const functionToExecute = dataLayerFunctions(event, template);
    template.executeList.forEach((execute) => {
      functionToExecute[execute]();
    })
  };

  element.addEventListener(template.trigger, functionsToExecute);

  element.triggerEvent(template.trigger);
  datalayerResults[templateKey] = window.dataLayer[window.dataLayer.length - 1];
  console.log(JSON.stringify(window.dataLayer[window.dataLayer.length - 1], null, 2));
});



// Docs
const DOCS = {
  "eventDetails": {
    "event": "The event name you want to use. | **string**",
    "page_location": "The full URL of the current page | **string**",
    "page_path": "The path of the current page | **string**",
    "page_title": "The title of the current page | **string**",
    "custom_tested": "A boolean indicating if the function tested has been tested | **boolean**",
    "custom_callback": "A callback function response | **boolean**",
    "custom_user": "The unique ID of the user | **number**",
    "ecommerce.items[].item_name": "Product name | **string**",
    "ecommerce.items[].item_id": "Product id | **number**",
    "ecommerce.items[].item_brand": "The product brand | **string**",
    "ecommerce.items[].item_category": "The product category | **string**",
    "ecommerce.items[].item_variant": "The product variant | **string**",
    "ecommerce.items[].price": "The product price | **number**",
    "ecommerceSpecial.items[].item_name": "Product name | **string**",
    "ecommerceSpecial.items[].item_id": "Product id | **number**",
    "ecommerceSpecial.items[].item_brand": "The product brand | **string**",
    "ecommerceSpecial.items[].item_category": "The product category | **string**",
    "ecommerceSpecial.items[].item_variant": "The product variant | **string**",
    "ecommerceSpecial.items[].price": "The product price | **number**"
  }
}

createDocs();

function createDocs() {
  const fs = require('fs');
  const path = require('path');
  let docString = '# Datalayer  \n';
  docString += '## Table of content  \n';

  Object.keys(DATALAYER_TEMPLATE_ORIGINAL).forEach((key) => {
    docString += `- [${key}](#${key})  \n`;
  });

  Object.keys(DATALAYER_TEMPLATE_ORIGINAL).forEach((key) => {
    const eventDetailsKeys = extractKeys(DATALAYER_TEMPLATE_ORIGINAL[key].eventDetails);
    docString += `## ${key}  \n`;
    docString += `${DATALAYER_TEMPLATE_ORIGINAL[key].docs.description}  \n`
    docString += `**pages:** ${DATALAYER_TEMPLATE_ORIGINAL[key].docs.pages}  \n`
    docString += `**Element target:** ${DATALAYER_TEMPLATE_ORIGINAL[key].target}  \n`;
    docString += `**trigger datalayer:** ${DATALAYER_TEMPLATE_ORIGINAL[key].trigger}  \n`;
    docString += `**Functions to execute:**  ${DATALAYER_TEMPLATE_ORIGINAL[key].executeList.map((executeItem) => `${executeItem}`).join(', ')}   \n`
    docString += `### Event:  \n`
    docString += `${eventDetailsKeys.map((key) => `**${key}**: ${DOCS.eventDetails[key]}  \n`).join('')}`
    docString += `#### Template:  \n`
    docString += "```json   \n"
    docString += `${JSON.stringify(DATALAYER_TEMPLATE_ORIGINAL[key].eventDetails, null, 2)}  \n`
    docString += "```  \n"
    docString += `#### Example:  \n`
    docString += "```json   \n"
    docString += `${JSON.stringify(datalayerResults[key], null, 2).substring(0, 4000)}  \n`
    docString += "```  \n"
  });


  createMarkdownFile('datalayer', docString)

  function createMarkdownFile(filename, content) {
    // Ensure the filename ends with .md
    if (!filename.endsWith('.md')) {
      filename += '.md';
    }

    const filePath = path.join(__dirname, filename);
    const dirPath = path.dirname(filePath);  // Get the directory of the file

    // Ensure the directory exists, or create it
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Write content to the markdown file
    fs.writeFile(filePath, content, (err) => {
      if (err) {
        console.error('Error writing file:', err);
      } else {
        console.log(`File ${filename} created successfully at ${filePath}`);
      }
    });
  }
}


function extractKeys(obj, path = "") {
  let keys = [];

  if (Array.isArray(obj)) {
      if (obj.length > 0) {
          keys.push(...extractKeys(obj[0], path + "[]"));
      }
  } else if (typeof obj === "object" && obj !== null) {
      for (let key in obj) {
          let newPath = path ? `${path}.${key}` : key;
          keys.push(...extractKeys(obj[key], newPath));
      }
  } else {
      keys.push(path);
  }

  return keys;
}