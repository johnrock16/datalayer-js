const {getObjectByPath, setObjectByPath, objectRunFunctionInDeep, normalizeString} = require('../utils');

function dataLayerFunctions(event, template, window) {
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


  const getData = (canSetState = true) => {
    const obj = {};
    const eventDetailsLocal = state.data ? state.data : eventDetails;

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

  const formatString = () => {
    if (state.previousFunctionReturn?.state) {
      const obj = objectRunFunctionInDeep(state.previousFunctionReturn?.state, normalizeString);
      setState('data', obj);
    }
  }

  const createArrayTemplate = () => {
    const [path] = template?.parameters.createArrayTemplate[0];
    const itemTemplate = getObjectByPath(path, eventDetails);
    setObjectByPath(path, state[state.previousFunctionReturn.name].map(() => itemTemplate[0]), eventDetails);
    template?.parameters.createArrayTemplate.shift();
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

module.exports = {
  dataLayerFunctions
}
