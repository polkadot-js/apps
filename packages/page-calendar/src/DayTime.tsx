// Copyright 2017-2022 @polkadot/app-calendar authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';

function DayTime (): React.ReactElement {
  const [now, setNow] = useState(new Date());

  useEffect((): () => void => {
    const intervalId = setInterval(() => setNow(new Date()), 1000);

    return (): void => {
      clearInterval(intervalId);
    };
  }, []);

  return <>{now.toLocaleTimeString().split(':').slice(0, 2).join(':')}</>;
}

export default React.memo(DayTime);
