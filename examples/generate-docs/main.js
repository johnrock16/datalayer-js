import DATALAYER_TEMPLATE from './templates/datalayer/datalayer.json' with {type: 'json'};
import DOCS from './templates/docs/docs.json' with {type: 'json'};
import { productHelpers } from './helpers/productHelpers.js';
import { createDocs } from '../../src/docs.js';
import { simulateAllEvents } from './mock/helpers/frontElements.js';


const DATALAYER_TEMPLATE_ORIGINAL = JSON.parse(JSON.stringify(DATALAYER_TEMPLATE));
const dataLayerResults = simulateAllEvents(DATALAYER_TEMPLATE, [productHelpers]);

createDocs(DATALAYER_TEMPLATE_ORIGINAL, DOCS, dataLayerResults);
