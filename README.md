
<h1 align="center">
  <br>
  <img src="https://raw.githubusercontent.com/Techonaut/.github/main/cdn/img/cookieMonsterv2.png" alt="Markdownify" width="200">
  <br>
  Cookie Monster
  <br>
</h1>

<h4 align="center">Controll all data client side with cookie monster. <a href="https://en.wikipedia.org/wiki/HTTP_cookie">Cookie</a>, <a href="https://en.wikipedia.org/wiki/JSON_Web_Token">JWT</a>, <a href="https://en.wikipedia.org/wiki/Base64">Base64</a>, <a href="https://en.wikipedia.org/wiki/Hash_function">Hashing</a>  <h4>

<p align="center">
  <img alt="jsDelivr hits (GitHub)" src="https://img.shields.io/jsdelivr/gh/hy/Techonaut/cookieMonster">
  <a href="https://cdn.jsdelivr.net/gh/Techonaut/cookieMonster/build/cookieMonster.min.js"> <img alt="GitHub file size in bytes" src="https://img.shields.io/github/size/Techonaut/cookieMonster/build/cookieMonster.min.js"> <a/>
  <a href="https://cdn.jsdelivr.net/gh/Techonaut/cookieMonster/build/cookieMonster.min.js"> <img alt="GitHub file size in bytes" src="https://github.com/Techonaut/cookieMonster/actions/workflows/build.yml/badge.svg?style=flat-square"> <a/>
</p>


# CDN
```
https://cdn.jsdelivr.net/gh/Techonaut/cookieMonster@1.0.2/build/cookieMonster.min.js
```

# Usage
### Http Cookie
```js
/*! Http Cookie */

setCookie('Cookie name', 'Cookie Value', '/', 9, 'Lax', true)
// Name        | Value        | Domain    | Path | Expires/Max-age         | Size | Secure | SameSite
// Cookie name | Cookie Value | localhost |  /  | 2022-01-30T01:49:19.000Z |  23  |  true  | lax

getCookie('Cookie name')
// Cookie Value
```
### Json Web Token
```js
/*! Json Web Token */

var header = {
  "alg": "HS256",
  "typ": "JWT"
};

var data = {
  "id": 1337,
  "username": "john.doe"
};

var secret = 'Secret password';

let myjwt = new jwt(header, data, secret);

var unsigned = myjwt.unsigned();
var unsignedParsed = parseJwt(unsigned)
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMzNywidXNlcm5hbWUiOiJqb2huLmRvZSJ9
// {id: 1337, username: 'john.doe'}

var signed = myjwt.signed();
var signedParsed = parseJwt(signed)
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMzNywidXNlcm5hbWUiOiJqb2huLmRvZSJ9.W29iamVjdCBQcm9taXNlXQ
// {id: 1337, username: 'john.doe'}
```
### Hashing
```js
/*! Hashing */

sha256('Hello World')
// a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e

HMAC('Secret', 'Hello Worlds')
// 4+aRrBhBpDHBnrH+JFFYFmMTl+8YeMFEkkloBB/xWkc=
```
### Encoding
```js
/*! Encoding */

base64url('Hello World')
// SGVsbG8gV29ybGQ

encode_utf8('Hello World')
// Hello World

```

# Project tree

```
cookieMonster
├─ build
│  └─ cookieMonster.min.js
├─ LICENSE
├─ README.md
├─ src
│  └─ cookieMonster.js
├─ temp.js
└─ test
   └─ index.html

```