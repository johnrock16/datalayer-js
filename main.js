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
    }
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
    }
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
          "item_name": 'c__retrieveProductItems[].name',
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
    }
  }
}

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
  console.log(JSON.stringify(window.dataLayer[window.dataLayer.length - 1]));
});


