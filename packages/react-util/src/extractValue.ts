export default function extractValueFromObj(valObj) {
  if (typeof valObj !== 'object' || valObj === null) return valObj;
  if (typeof valObj.isValid === 'undefined') return valObj;
  return valObj.isValid ? valObj.value : undefined;
}
