// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import isUndefined from '@polkadot/util/is/undefined';

// Check if superset contains all elements in subset
export default function arrayContainsArray (superset: Array<any>, subset: Array<any>): boolean {
  if (isUndefined(superset) || isUndefined(subset) || !superset.length || !subset.length) {
    return false;
  }

  return subset.every(function (value: any) {
    return (superset.indexOf(value) >= 0);
  });
}
