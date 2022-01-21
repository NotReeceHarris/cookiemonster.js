/*!
 * CookieMonster v1.*.* (https://techonaut.tech/)
 * Licensed under GPL-3.0 (https://github.com/Techonaut/cookieMonster/blob/development/LICENSE)
 */

// Version of cookie monster
const COOKIE_MONSTER_VERSION = "1.0.3"

// Enter name space "cookieMonster"
var cookieMonster = {

// Http Cookie 
getCookie: function(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  },
  
  setCookie: function(name, value, path = '/', exdays = (999*999*999), sameSite = 'Lax', secure = false) {
  
    const d = new Date();
  
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
  
    var secure = (secure) ? ";secure" : "";
    document.cookie = name + "=" + value + ";" + expires + ";path=" + path + ";SameSite=" + sameSite + secure;
  },


// Json Web Token
  
  parseJwt: function(encodedToken) {
    var base64Url = encodedToken.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  
    return JSON.parse(jsonPayload);
  },
  
  
  jwt: class {
  
    constructor(header, data, secret) {
      this.header = header
      this.data = data
      this.secret = secret
    }
  
    unsigned() {
      var stringifiedHeader = cookieMonster.encode_utf8(JSON.stringify(header));
      var encodedHeader = cookieMonster.base64url(stringifiedHeader);
  
      var stringifiedData = cookieMonster.encode_utf8(JSON.stringify(data));
      var encodedData = cookieMonster.base64url(stringifiedData);
  
      var token = encodedHeader + "." + encodedData;
  
      return token;
    }
  
    signed() {
      if (this.secret == null) {
        throw 'secret is needed for a signed JWT';
      } else {
        var stringifiedHeader = cookieMonster.encode_utf8(JSON.stringify(header));
        var encodedHeader = cookieMonster.base64url(stringifiedHeader);
  
        var stringifiedData = cookieMonster.encode_utf8(JSON.stringify(data));
        var encodedData = cookieMonster.base64url(stringifiedData);
  
        var token = encodedHeader + "." + encodedData;
  
        var signature = cookieMonster.HMAC(token, secret);
        signature = cookieMonster.base64url(signature);
        var signedToken = token + "." + signature;
  
        return signedToken;
      }
    }
  },

// Encoding
  
  base64url: function(source) {
  
    encodedSource = btoa(source);
    encodedSource = encodedSource.replace(/=+$/, '');
    encodedSource = encodedSource.replace(/\+/g, '-');
    encodedSource = encodedSource.replace(/\//g, '_');
  
    return encodedSource;
  },
  
  encode_utf8: function(s) {
    return unescape(encodeURIComponent(s));
  },
  
  HMAC: async function(key, message) {
    const g = str => new Uint8Array([...unescape(encodeURIComponent(str))].map(c => c.charCodeAt(0))),
      k = g(key),
      m = g(message),
      c = await crypto.subtle.importKey('raw', k, {
        name: 'HMAC',
        hash: 'SHA-256'
      }, true, ['sign']),
      s = await crypto.subtle.sign('HMAC', c, m);
    [...new Uint8Array(s)].map(b => b.toString(16).padStart(2, '0')).join('');
    return btoa(String.fromCharCode(...new Uint8Array(s)))
  },

// Hashing
  
  sha256: function(ascii) {
    function rightRotate(value, amount) {
      return (value >>> amount) | (value << (32 - amount));
    };
  
    var mathPow = Math.pow;
    var maxWord = mathPow(2, 32);
    var lengthProperty = 'length'
    var i, j; // Used as a counter across the whole file
    var result = ''
  
    var words = [];
    var asciiBitLength = ascii[lengthProperty] * 8;
  
    //* caching results is optional - remove/add slash from front of this line to toggle
    // Initial hash value: first 32 bits of the fractional parts of the square roots of the first 8 primes
    // (we actually calculate the first 64, but extra values are just ignored)
    var hash = cookieMonster.sha256.h = cookieMonster.sha256.h || [];
    // Round constants: first 32 bits of the fractional parts of the cube roots of the first 64 primes
    var k = cookieMonster.sha256.k = cookieMonster.sha256.k || [];
    var primeCounter = k[lengthProperty];
    /*/
    var hash = [], k = [];
    var primeCounter = 0;
    //*/
  
    var isComposite = {};
    for (var candidate = 2; primeCounter < 64; candidate++) {
      if (!isComposite[candidate]) {
        for (i = 0; i < 313; i += candidate) {
          isComposite[i] = candidate;
        }
        hash[primeCounter] = (mathPow(candidate, .5) * maxWord) | 0;
        k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
      }
    }
  
    ascii += '\x80' // Append Ƈ' bit (plus zero padding)
    while (ascii[lengthProperty] % 64 - 56) ascii += '\x00' // More zero padding
    for (i = 0; i < ascii[lengthProperty]; i++) {
      j = ascii.charCodeAt(i);
      if (j >> 8) return; // ASCII check: only accept characters in range 0-255
      words[i >> 2] |= j << ((3 - i) % 4) * 8;
    }
    words[words[lengthProperty]] = ((asciiBitLength / maxWord) | 0);
    words[words[lengthProperty]] = (asciiBitLength)
  
    // process each chunk
    for (j = 0; j < words[lengthProperty];) {
      var w = words.slice(j, j += 16); // The message is expanded into 64 words as part of the iteration
      var oldHash = hash;
      // This is now the undefinedworking hash", often labelled as variables a...g
      // (we have to truncate as well, otherwise extra entries at the end accumulate
      hash = hash.slice(0, 8);
  
      for (i = 0; i < 64; i++) {
        var i2 = i + j;
        // Expand the message into 64 words
        // Used below if 
        var w15 = w[i - 15],
          w2 = w[i - 2];
  
        // Iterate
        var a = hash[0],
          e = hash[4];
        var temp1 = hash[7] +
          (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) // S1
          +
          ((e & hash[5]) ^ ((~e) & hash[6])) // ch
          +
          k[i]
          // Expand the message schedule if needed
          +
          (w[i] = (i < 16) ? w[i] : (
            w[i - 16] +
            (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) // s0
            +
            w[i - 7] +
            (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10)) // s1
          ) | 0);
        // This is only used once, so *could* be moved below, but it only saves 4 bytes and makes things unreadble
        var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) // S0
          +
          ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2])); // maj
  
        hash = [(temp1 + temp2) | 0].concat(hash); // We don't bother trimming off the extra ones, they're harmless as long as we're truncating when we do the slice()
        hash[4] = (hash[4] + temp1) | 0;
      }
  
      for (i = 0; i < 8; i++) {
        hash[i] = (hash[i] + oldHash[i]) | 0;
      }
    }
  
    for (i = 0; i < 8; i++) {
      for (j = 3; j + 1; j--) {
        var b = (hash[i] >> (j * 8)) & 255;
        result += ((b < 16) ? 0 : '') + b.toString(16);
      }
    }
    return result;
  },


// Update checker
COOKIE_MONSTER_GET_VERSION: async function () {
  try {
      let res = await fetch('https://api.github.com/repos/Techonaut/cookieMonster/tags');
      return await res.json();
  } catch (error) {
      console.log(error);
  }
},

COOKIE_MONSTER_UPDATE_CHECK: async function() {
  let apiRESPONSE = await cookieMonster.COOKIE_MONSTER_GET_VERSION();
  let html = '';
  apiRESPONSE.forEach(data => {
      if (data.name != COOKIE_MONSTER_VERSION) {
        console.log('%c This Version of cookie clicker is depricated please use the latest release (https://cdn.jsdelivr.net/gh/Techonaut/cookieMonster@' + data.name + '/build/cookieMonster.min.js)', 'color: #da9f83;font-weight: 900;')
      }
  });
},

}

cookieMonster.COOKIE_MONSTER_UPDATE_CHECK()
