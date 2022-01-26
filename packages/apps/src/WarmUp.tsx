// Copyright 2017-2022 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';

function WarmUp (): React.ReactElement {
  const { api, isApiReady } = useApi();
  const indexes = useCall<unknown>(isApiReady && api.derive.accounts?.indexes);
  const registrars = useCall<unknown>(isApiReady && api.query.identity?.registrars);
  const issuance = useCall<unknown>(isApiReady && api.query.balances?.totalIssuance);
  const historyDepth = useCall<unknown>(isApiReady && api.query.staking?.historyDepth);
  const [hasValues, setHasValues] = useState(false);

  useEffect((): void => {
    setHasValues(!!historyDepth || !!indexes || !!issuance || !!registrars);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`apps--api-warm ${hasValues.toString()}`} />
  );
}

export default React.memo(WarmUp);
