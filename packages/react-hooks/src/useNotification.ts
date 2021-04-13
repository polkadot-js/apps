// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// and @canvas-ui/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import StatusContext from '@canvas-ui/react-api/Status/Context';
import { ActionStatus } from '@canvas-ui/react-api/Status/types';
import { useCallback, useContext } from 'react';

export default function useNotification (): (_: ActionStatus) => void {
  const { queueAction } = useContext(StatusContext);

  return useCallback(
    (action: ActionStatus) => {
      queueAction(action);
    },
    [queueAction]
  );
}
