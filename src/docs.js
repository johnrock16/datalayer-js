const { extractKeys } = require('./utils');

function createDocs(template, docs, dataLayerResults) {
  const fs = require('fs');
  const path = require('path');
  let docString = '# Datalayer  \n';
  docString += '## Table of content  \n';

  Object.keys(template).forEach((key) => {
    docString += `- [${key}](#${key})  \n`;
  });

  Object.keys(template).forEach((key) => {
    const eventDetailsKeys = extractKeys(template[key].eventDetails);
    docString += `## ${key}  \n`;
    docString += `${template[key].docs.description}  \n`
    docString += `**pages:** ${template[key].docs.pages}  \n`
    docString += `**Element target:** ${template[key].target}  \n`;
    docString += `**trigger datalayer:** ${template[key].trigger}  \n`;
    docString += `**Functions to execute:**  ${template[key].executeList.map((executeItem) => `${executeItem}`).join(', ')}   \n`
    docString += `### Event:  \n`
    docString += `${eventDetailsKeys.map((key) => `**${key.replaceAll('.', ' -> ').replaceAll('[]', ' (List)')}**: ${docs.eventDetails[key]}  \n`).join('')}`
    docString += `#### Template:  \n`
    docString += "```json   \n"
    docString += `${JSON.stringify(template[key].eventDetails, null, 2)}  \n`
    docString += "```  \n"
    docString += `#### Result:  \n`
    docString += "```json   \n"
    docString += `${JSON.stringify(dataLayerResults[key], null, 2).substring(0, 4000)}  \n`
    docString += "```  \n"
  });


  createMarkdownFile('datalayer', docString)

  function createMarkdownFile(filename, content) {
    if (!filename.endsWith('.md')) {
      filename += '.md';
    }

    const filePath = path.join(__dirname, filename);
    const dirPath = path.dirname(filePath);

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    fs.writeFile(filePath, content, (err) => {
      if (err) {
        console.error('Error writing file:', err);
      } else {
        console.log(`File ${filename} created successfully at ${filePath}`);
      }
    });
  }
}

module.exports = {
  createDocs
}
