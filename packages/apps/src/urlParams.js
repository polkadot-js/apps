// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

type Params = {
  [string]: string
};

export default function urlParams (): Params {
  if (window.location.search.indexOf('?') !== 0) {
    return {};
  }

  const parts = window.location.search.slice(1).split('&');

  return parts.reduce((params, param) => {
    const [name, value] = param.split('=');

    params[name] = value;

    return params;
  }, {});
}
