// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

const noop = (): void => undefined;

export const ToastContext = React.createContext<({show: (message: string) => void})>({ show: noop });
