import { getObjectByPath, setObjectByPath } from './utils.js';

export function dataLayerFunctions(eventReference, templateReference, windowReference) {
  const template = templateReference;
  const eventDetails = template.eventDetails;
  const event = eventReference;
  const window = windowReference;
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

  const isJSONString = (str) => {
    if (typeof str !== 'string') return false;
    str = str.trim();
    return (
      (str.startsWith('{') && str.endsWith('}')) ||
      (str.startsWith('[') && str.endsWith(']'))
    );
  }

  const getProcessedValue = (detailValue, state, index) => {
    if (typeof detailValue === 'string') {
      if (detailValue.indexOf('w__') === 0) {
        return getObjectByPath(detailValue.split('w__')[1], window);
      }
      if (detailValue.indexOf('e__') === 0) {
        let objectByPath = getObjectByPath(detailValue.split('e__')[1].split('?')[0], state.event)
        if (isJSONString(objectByPath)) {
          try {
            objectByPath = JSON.parse(objectByPath);
          } catch (error) {
            console.error(error);
          }
        }
        const modifier = detailValue.split('e__')[1].split('?.')[1];
        if (modifier) {
          objectByPath = getObjectByPath(modifier, objectByPath);
        }
        return objectByPath;
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

  const createArrayTemplate = () => {
    const [path] = template?.parameters.createArrayTemplate[0];
    const itemTemplate = getObjectByPath(path, eventDetails);
    setObjectByPath(path, state[state.previousFunctionReturn.name].map(() => itemTemplate[0]), eventDetails);
    template?.parameters.createArrayTemplate.shift();
  }


  return {
    state,
    template,
    eventDetails,
    window,
    setState,
    pushData,
    getData,
    createArrayTemplate
  }
}

export function createDataLayerManager(event, template, window, helpers) {
  window.dataLayer = window.dataLayer || [];
  const dataLayerManager = dataLayerFunctions(event, template, window);

  const combinedDataLayerFunctions = helpers.reduce((accumulator, module) => {
    const moduleFunctions = module(dataLayerManager);
    return { ...accumulator, ...moduleFunctions };
  }, { ...dataLayerManager });
  return combinedDataLayerFunctions;
}

export function createAndStartDataLayerManager(dataLayerTemplate, dataLayerHelpers) {
  Object.keys(dataLayerTemplate).forEach((templateKey) => {
    const template = dataLayerTemplate[templateKey];
    const elements = template.target === 'document' ? [window.document] : window.document.querySelectorAll(template.target);

    const functionsToExecute = (event) => {
      const dataLayerManager = createDataLayerManager(event, template, window, dataLayerHelpers);
      template.executeList.forEach((execute) => {
        dataLayerManager[execute]();
      })
    };
    elements.forEach((element) => {
      element.addEventListener(template.trigger, functionsToExecute);
    })
  });
}
