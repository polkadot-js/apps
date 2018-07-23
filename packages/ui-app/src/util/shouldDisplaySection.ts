// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import isUndefined from '@polkadot/util/is/undefined';
import isObject from '@polkadot/util/is/object';
import isNull from '@polkadot/util/is/null';

function anyMethodToDisplay (methods: any) {
  if (isUndefined(methods) || isNull(methods)) {
    return false;
  }

  return Object
    .keys(methods)
    .filter((name) => {
      const { isDeprecated, isHidden } = methods[name];

      return !isDeprecated && !isHidden;
    })
    .length !== 0;
}

export function shouldDisplaySection (section: any, type: string) {
  if (isUndefined(section)) {
    return false;
  }

  const methods = section[type];

  return !section.isDeprecated && !section.isHidden && anyMethodToDisplay(methods);
}
