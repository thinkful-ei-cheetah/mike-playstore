const capitalize = (string) => {
  string = string.toLowerCase();
  return string[0].toUpperCase() + string.slice(1, string.length);
};

module.exports = {
  capitalize
};