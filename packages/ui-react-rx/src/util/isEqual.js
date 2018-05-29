// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

export default function isEqual <T> (a?: T, b?: T): boolean {
  return JSON.stringify({ test: a }) === JSON.stringify({ test: b });
}
