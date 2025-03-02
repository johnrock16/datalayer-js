const DATALAYER_TEMPLATE = require('./src/templates/datalayer/datalayer.json');
const DOCS = require('./src/templates/docs/docs.json');
const { dataLayerFunctions } = require('./src/helpers/datalayerFunctions');
const { createDocs } = require('./src/docs');
const { simulateAllEvents } = require('./src/mock/helpers/frontElements');


const DATALAYER_TEMPLATE_ORIGINAL = JSON.parse(JSON.stringify(DATALAYER_TEMPLATE));
const dataLayerResults = simulateAllEvents(DATALAYER_TEMPLATE, dataLayerFunctions);

createDocs(DATALAYER_TEMPLATE_ORIGINAL, DOCS, dataLayerResults);
