// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

// NOTE bs58 characters, no '0', 'O' or 'l'
const regex = new RegExp('^[1-9A-NP-Za-km-z?]*$', '');

module.exports = regex;
