// Copyright 2017-2025 @polkadot/app-js authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AppProps as Props } from '@polkadot/react-components/types';

import React from 'react';

import Playground from './Playground.js';

function JsApp (props: Props): React.ReactElement<Props> {
  return <Playground {...props} />;
}

export default React.memo(JsApp);
