// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

export default function classes (...classNames: Array<mixed>): string {
  return classNames
    .filter((className) => className)
    .join(' ');
}
