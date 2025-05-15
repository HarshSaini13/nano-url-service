const CHARSET =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const BASE = CHARSET.length;

/**
 * Encode a number to base62 string
 * @param {Number} num - Number to encode
 * @returns {String} - Base62 encoded string
 */
const encode = (num) => {
  if (num === 0) return CHARSET[0];

  let str = '';
  while (num > 0) {
    str = CHARSET[num % BASE] + str;
    num = Math.floor(num / BASE);
  }
  return str;
};

/**
 * Decode a base62 string to number
 * @param {String} str - Base62 string to decode
 * @returns {Number} - Decoded number
 */
const decode = (str) => {
  let num = 0;
  for (let i = 0; i < str.length; i++) {
    num = num * BASE + CHARSET.indexOf(str[i]);
  }
  return num;
};

module.exports = {
  encode,
  decode,
};
