// Copyright 2017-2021 @polkadot/app-js authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AppProps as Props } from '@polkadot/react-components/types';

import React from 'react';

import Playground from './Playground';

function JsApp (props: Props): React.ReactElement<Props> {
  return <Playground {...props} />;
}

export default React.memo(JsApp);
