import {objectRunFunctionInDeep, normalizeString} from '../../../src/utils.js';

export function productHelpers(manager) {
  const { state, setState, template, eventDetails, window } = manager;

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

  return ({
    formatString,
    checkIsTested,
    retrieveFromEndpoint,
    retrieveProductItems,
  });
}
