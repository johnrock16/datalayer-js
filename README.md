# data-layer-rules

data-layer-rules is a flexible JSON-based system for managing and standardizing your website's data layer events. It allows you to define tracking events, triggers, and execution sequences to ensure consistent data collection for analytics and marketing platforms.

## Features
- Define structured event rules using JSON
- Configure event triggers based on user interactions
- Process and format data before pushing it to your data layer
- Support for custom functions in execution sequences

## How It Works
Each event rule is structured as a JSON object containing:
- `target`: The element that triggers the event
- `trigger`: The condition that activates the event
- `executeList`: A sequence of functions to execute
- `eventDetails`: The data to be pushed to the data layer
- `docs`: Documentation for the event

## Custom Functions
You can create your own custom functions and include them in the `executeList` of an event. These functions allow you to manipulate data, perform additional logic, or interact with external systems before pushing data to the data layer.

For example, if you need to sanitize user inputs or enrich data from an API, you can define a function like `sanitizeInput` and include it in `executeList`:

```json
"executeList": ["getData", "sanitizeInput", "formatString", "pushData"]
```

Your function should be registered in the system and will be executed in the specified order within the event pipeline.

### Implementing Custom Functions
To create a custom function, define it as a helper and pass it to the data layer manager. Below is an example of how to integrate a custom function:

```javascript
import DATALAYER_TEMPLATE from './templates/datalayer/datalayer.json';
import { productHelpers } from './helpers/productHelpers.js';
import { createAndStartDataLayerManager } from '../../src/datalayerManager.js';

createAndStartDataLayerManager(DATALAYER_TEMPLATE, [productHelpers]);
```

Here, `productHelpers` is a set of custom functions that can be executed within `executeList`. Below is an example implementation:

```javascript
import { objectRunFunctionInDeep, normalizeString } from '../../../src/utils.js';

export function productHelpers(manager) {
  const { state, setState } = manager;

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
          const product = JSON.parse(productCardElement.dataset.product);
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
    });
    if (products.length > 0) {
      setState('retrieveProductItems', products);
    }
  }

  return {
    formatString,
    checkIsTested,
    retrieveFromEndpoint,
    retrieveProductItems,
  };
}
```

These functions illustrate how you can process data before pushing it to the data layer. You can define and register your own functions to customize behavior as needed.

## Example Event Rule
```json
{
  "add_to_cart": {
    "target": ".add-to-cart",
    "trigger": "click",
    "executeList": ["stopPropagation", "getData", "formatString", "pushData"],
    "eventDetails": {
      "event": "add_to_cart",
      "ecommerce": {
        "items": [{
          "item_name": "e__target.dataset.product?.name",
          "item_id": "e__target.dataset.product?.id",
          "price": "e__target.dataset.product?.price"
        }]
      }
    },
    "docs": {
      "description": "An event that detects when a product is added to the cart",
      "pages": "All pages with products"
    }
  }
}
```

## Getting Started
1. Define your event rules in JSON format.
2. Implement any necessary custom functions.
3. Integrate the event manager with your website.
4. Monitor and debug data layer events using your analytics tool.

