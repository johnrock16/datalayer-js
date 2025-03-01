function getObjectByPath(path, root) {
  const keys = path.split('.');

  let result = root;
  for (let key of keys) {
    if (result !== undefined && result !== null) {
      result = result[key];
    } else {
      return undefined;
    }
  }

  return result;
}

function dataLayerFunctions(eventDetails) {
  const state = {
    previousFunctionReturn: null
  };

  const setState = (key, data, overridePreviousFunctionReturn = true) => {
    state[key] = data;
    if (overridePreviousFunctionReturn) {
      state.previousFunctionReturn = data;
    }
  }

  const getData = (canSetState = true) => {
    const obj = {};
    const eventDetailsLocal = state.data ? state.data : eventDetails;

    const getProcessedValue = (detailValue, state, detail) => {
      if (typeof detailValue === 'string') {
        if (detailValue.indexOf('$') === 0) {
          return state?.data?.[detail] ? state.data[detail] : getObjectByPath(detailValue.split('$')[1], window);
        }

        if (detailValue.indexOf('c__') === 0) {
          const path = detailValue.split('__');
          return state?.data?.[detail] ? state.data[detail] : getObjectByPath(path[1], state);
        }
      }

      return detailValue;
    };

    const deepProcess = (value, state) => {
      if (Array.isArray(value)) {
        return value.map((item) => deepProcess(item, state));
      }

      if (typeof value === 'object' && value !== null) {
        const processedObj = {};
        Object.keys(value).forEach((key) => {
          processedObj[key] = deepProcess(value[key], state);
        });
        return processedObj;
      }

      return getProcessedValue(value, state);
    };

    Object.keys(eventDetailsLocal).forEach((detail) => {
      obj[detail] = deepProcess(eventDetailsLocal[detail], state);
    });

    if (canSetState) {
      setState('getData', obj);
    }

    return obj;
  };

  // const getData = (canSetState = true) => {
  //   const obj = {};

  //   Object.keys(eventDetails).forEach((detail) => {
  //     obj[detail] = eventDetails[detail];
  //     if (typeof eventDetails[detail] === 'string' && eventDetails[detail].indexOf('$') === 0) {
  //       obj[detail] = state?.data?.[detail] ? state.data[detail] : getObjectByPath(eventDetails[detail].split('$')[1], window);
  //     } else if (typeof eventDetails[detail] === 'string' && eventDetails[detail].indexOf('c__') === 0) {
  //       const path = eventDetails[detail].split('__');
  //       obj[detail] = state?.data?.[detail] ? state.data[detail] : getObjectByPath(path[1], state);
  //     }
  //   });

  //   if (canSetState) {
  //     setState('getData', obj);
  //   }
  //   return obj;
  // }

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
    if (state.previousFunctionReturn) {
      const obj = objectRunFunctionInDeep(state.previousFunctionReturn, normalizeString);
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

  return {
    pushData,
    getData,
    formatString,
    checkIsTested,
    retrieveFromEndpoint,
    retrieveProductItem
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
      "page_location": "$location.href",
      "page_path": "$location.pathname",
      "page_title": "$document.title",
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
  }
}

window.document.addElement('body', createElement('body'));
window.document.addElement('.productCard', createElement('div'));

Object.keys(DATALAYER_TEMPLATE).forEach((templateKey) => {
  const template = DATALAYER_TEMPLATE[templateKey];
  const element = template.target === 'document' ? window.document : window.document.getElementById(template.target);

  const functionsToExecute = () => {
    const functionToExecute = dataLayerFunctions(template.eventDetails);
    template.executeList.forEach((execute) => {
      functionToExecute[execute]();
    })
  };

  element.addEventListener(template.trigger, () => {
    functionsToExecute();
  });

  element.triggerEvent(template.trigger);
  console.log(JSON.stringify(window.dataLayer[window.dataLayer.length - 1]));
});


