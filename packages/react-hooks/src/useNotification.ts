// Copyright 2017-2020 @canvas-ui/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ActionStatus } from '@canvas-ui/react-components/Status/types';

import { useCallback, useContext } from 'react';
import StatusContext from '@canvas-ui/react-components/Status/Context';

export default function useNotification (): (_: ActionStatus) => void {
  const { queueAction } = useContext(StatusContext);

  return useCallback(
    (action: ActionStatus) => {
      queueAction(action);
    },
    [queueAction]
  );
}
