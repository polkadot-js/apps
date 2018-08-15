// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Section, SectionItems } from '@polkadot/params/types';
import { SectionVisibilityAll } from '../util/types';

import isUndefined from '@polkadot/util/is/undefined';
import isNull from '@polkadot/util/is/null';

function anyMethodToDisplay <T> (methods: SectionItems<T, any>) {
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

export function shouldDisplaySection<T> (section: Section<T, any, any>, type: SectionVisibilityAll) {
  if (isUndefined(section)) {
    return false;
  }

  const methods = section[type];

  return !section.isDeprecated && !section.isHidden && anyMethodToDisplay(methods);
}
