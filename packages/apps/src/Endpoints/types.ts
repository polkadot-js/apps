// Copyright 2017-2021 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

export interface Network {
  icon?: string;
  isChild?: boolean;
<<<<<<< HEAD
  isLightClient?: boolean;
=======
  isUnreachable?: boolean;
>>>>>>> 9e22ba0f6c5da47f93d0cab38ec097ad7483753c
  name: string;
  providers: {
    name: string;
    url: string;
  }[]
}

export interface Group {
  header: React.ReactNode;
  isDevelopment?: boolean;
  isSpaced?: boolean;
  networks: Network[];
}
