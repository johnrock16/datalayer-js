import {objectRunFunctionInDeep, normalizeString} from '../../../src/utils.js';

export function productHelpers(manager) {
  const { state, setState, abortPushData, template, eventDetails, window } = manager;

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
    const productCardElements = state.event.target.querySelectorAll('.product-card');
    const products = [];
    productCardElements.forEach((productCardElement) => {
      if (productCardElement.dataset.product) {
        try {
          const product = JSON.parse(productCardElement.dataset.product)
          if (product) {
            products.push({
              name: product.name,
              id: product.id,
              brand: product.brand,
              category: product.category,
              variant: product.variant,
              price: product.price
            });
          }
        } catch (error) {
         console.error(error);
        }
      }
    })
    if (products.length > 0) {
      setState('retrieveProductItems', products);
    }
  }

  return ({
    formatString,
    checkIsTested,
    retrieveFromEndpoint,
    retrieveProductItems,
  });
}
