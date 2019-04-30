// helper to capitalize just the first letter of a word
const capitalize = (string) => {
  // sets any string to all lower case
  string = string.toLowerCase();
  // returns the first index of a word  and set it upper case
  // add the rest of the word 
  return string[0].toUpperCase() + string.slice(1, string.length);
};

module.exports = {
  capitalize
};