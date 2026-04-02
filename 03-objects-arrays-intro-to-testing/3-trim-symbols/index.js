/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size === undefined) {
    return string;
  } else if (size === 0) {
    return '';
  }

  let filteredString = '';
  let lastCharacter = '';
  let characterCounter = 0;
  for (let i = 0; i < string.length; i++) {
    if (string[i] !== lastCharacter) {
      lastCharacter = string[i];
      filteredString += string[i];
      characterCounter = 1;
    } else {
      characterCounter++;
      if (characterCounter <= size) {
        filteredString += string[i];
      }
    }
  }

  return filteredString;
}
