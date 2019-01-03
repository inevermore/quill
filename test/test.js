/**
 * @param {string[]} logs
 * @return {string[]}
 */
const reorderLogFiles = function(logs) {
  const digits = [];
  const letters = [];
  logs.forEach(item => {
    const subArr = item.split(' ');
    if (!Number.isNaN(Number(subArr[1]))) {
      digits.push(item);
    } else if (letters.length === 0) {
      letters.push(item);
    } else {
      const l = letters.length - 1;
      for (let i = 1; i < l; i += 1) {
        const cur = letters[i]
          .split(' ')
          .slice(1)
          .join('');
        if (subArr.slice(1).join('') < cur) {
          letters.splice(i, 0, item);
          break;
        }
      }
    }
  });
  return letters.concat(digits);
};
reorderLogFiles([]);
