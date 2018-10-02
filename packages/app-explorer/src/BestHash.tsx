// Copyright 2017-2018 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Header } from '@polkadot/types';

import withObservableDiv from '@polkadot/ui-react-rx/with/observableDiv';

const Component: React.ComponentType<any> = withObservableDiv('newHead')(
  (value?: Header): string | undefined =>
    value
      ? header.hash.toHex()
      : undefined,
  { className: 'explorer--BestHash' }
);

export default Component;
