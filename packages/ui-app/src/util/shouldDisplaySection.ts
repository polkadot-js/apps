// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

function anyMethodToDisplay (methods: any) {
  return Object
    .keys(methods)
    .filter((name) => {
      const { isDeprecated, isHidden } = methods[name];

      return !isDeprecated && !isHidden;
    })
    .length !== 0;
}

export function shouldDisplaySection (section: any, methods: any) {
  return !section.isDeprecated && !section.isHidden && anyMethodToDisplay(methods);
}
