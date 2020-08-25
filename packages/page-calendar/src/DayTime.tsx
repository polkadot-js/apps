// Copyright 2017-2020 @polkadot/app-calendar authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

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
