export const sanitizeObject = obj => {
  const newObj = {};

  Object.keys(obj).forEach(key => {
    if (obj[key]) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};
