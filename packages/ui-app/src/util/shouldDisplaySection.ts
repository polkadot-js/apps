// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Section, SectionItems } from '@polkadot/params/types';
import { SectionVisibilityAll } from '../util/types';

import isUndefined from '@polkadot/util/is/undefined';
import isNull from '@polkadot/util/is/null';

// methods: <T extends SectionItems<T>>
function anyMethodToDisplay<SectionItems, K extends keyof SectionItems> (methods: SectionItems[K]) {
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

// section: Section<Storages> or Section<Extrinsics> or Section<Interfaces>
// type: 'public' | 'private'
export function shouldDisplaySection<T extends Section<T>, SectionVisibilityAll extends keyof T> (section: T, type: SectionVisibilityAll) {
  if (isUndefined(section)) {
    return false;
  }

  const methods = section[type];

  return !section.isDeprecated && !section.isHidden && anyMethodToDisplay(methods);
}
