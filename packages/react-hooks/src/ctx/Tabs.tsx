// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { IconName } from '@fortawesome/fontawesome-svg-core';

import React from 'react';

interface SectionType {
  icon?: IconName;
  text?: string;
}

export const TabsCtx = React.createContext<SectionType>({});
