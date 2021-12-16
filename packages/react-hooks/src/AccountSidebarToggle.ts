// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

type ToggleContext = undefined | (([address, onUpdateName]: State) => void);

type State = [string | null, (() => void) | null];

export const AccountSidebarToggle: React.Context<ToggleContext> = React.createContext<ToggleContext>(undefined);
