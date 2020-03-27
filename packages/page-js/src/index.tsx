// Copyright 2017-2020 @polkadot/app-js authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps as Props } from '@polkadot/react-components/types';

import React from 'react';

import Playground from './Playground';

function JsApp (props: Props): React.ReactElement<Props> {
  return <Playground {...props} />;
}

export default React.memo(JsApp);
