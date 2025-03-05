import DATALAYER_TEMPLATE from './templates/datalayer/datalayer.json';
import { productHelpers } from './helpers/productHelpers.js';
import { createAndStartDataLayerManager } from '../../src/datalayerManager.js';

createAndStartDataLayerManager(DATALAYER_TEMPLATE, [productHelpers]);
setInterval(() => {
    console.log(window.dataLayer);
}, 5000);
