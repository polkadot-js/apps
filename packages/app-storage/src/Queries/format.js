// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

export default function format (value: BN | Uint8Array): string {
  if (!value) {
    return 'unknown';
  }

  return value.toString();
}
