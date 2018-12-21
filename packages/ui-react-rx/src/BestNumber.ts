// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BlockNumber } from '@polkadot/types';

import { numberFormat } from './util/index';
import { withObservableDiv } from './with/index';

const Component: React.ComponentType<any> = withObservableDiv('bestNumber')(
  (value?: BlockNumber): string => {
    return value
      ? numberFormat(value)
      : 'unknown';
  },
  { className: 'rx--BestNumber' }
);

export default Component;
