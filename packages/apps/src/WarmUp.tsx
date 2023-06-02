// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';

function WarmUp (): React.ReactElement {
  const { api, isApiReady } = useApi();
  const indexes = useCall(isApiReady && api.derive.accounts?.indexes);
  const registrars = useCall(isApiReady && api.query.identity?.registrars);
  const issuance = useCall(isApiReady && api.query.balances?.totalIssuance);
  const [hasValues, setHasValues] = useState(false);

  useEffect((): void => {
    setHasValues(!!indexes || !!issuance || !!registrars);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`apps--api-warm ${hasValues.toString()}`} />
  );
}

export default React.memo(WarmUp);
