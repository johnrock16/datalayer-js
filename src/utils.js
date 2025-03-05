export function getObjectByPath(path, root) {
  const keys = path.split(/\.|\[|\]/).filter(Boolean);

  let result = root;
  for (let key of keys) {
    if (result !== undefined && result !== null) {
      const index = Number(key);
      if (!isNaN(index) && Array.isArray(result)) {
        result = result[index];
      } else {
        result = result[key];
      }
    } else {
      return undefined;
    }
  }

  return result;
}

export function setObjectByPath(path, value, root) {
  const keys = path.split(/\.|\[|\]/).filter(Boolean);

  let result = root;
  for (let i = 0; i < keys.length - 1; i++) {
    let key = keys[i];

    const index = Number(key);
    if (!isNaN(index) && Array.isArray(result)) {

      if (result[index] === undefined) {
        result[index] = {};
      }
      result = result[index];
    } else {
      if (result[key] === undefined) {
        result[key] = {};
      }
      result = result[key];
    }
  }

  const lastKey = keys[keys.length - 1];
  const index = Number(lastKey);
  if (!isNaN(index) && Array.isArray(result)) {
    result[index] = value;
  } else {
    result[lastKey] = value;
  }
}

export function extractKeys(obj, path = "") {
  let keys = [];

  if (Array.isArray(obj)) {
    if (obj.length > 0) {
      keys.push(...extractKeys(obj[0], path + "[]"));
    }
  } else if (typeof obj === "object" && obj !== null) {
    for (let key in obj) {
      let newPath = path ? `${path}.${key}` : key;
      keys.push(...extractKeys(obj[key], newPath));
    }
  } else {
    keys.push(path);
  }

  return keys;
}

export function objectRunFunctionInDeep(obj, handle) {
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

export function normalizeString(str) {
  if (/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(str)) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, '-');
}
