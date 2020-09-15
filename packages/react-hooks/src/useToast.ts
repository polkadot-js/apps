// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useContext } from 'react';
import { ToastContext } from '@polkadot/react-components/Toast/Context';

export default function useToast (): {show: (message: string) => void} {
  return useContext(ToastContext);
}
