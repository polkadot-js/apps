// Copyright 2017-2018 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Header } from '@polkadot/types';

import { withObservableDiv } from '@polkadot/ui-react-rx/with/index';

const Component: React.ComponentType<any> = withObservableDiv('subscribeNewHead')(
  (header?: Header): string | undefined =>
    header
      ? header.hash.toHex()
      : undefined,
  { className: 'explorer--BestHash' }
);

export default Component;
