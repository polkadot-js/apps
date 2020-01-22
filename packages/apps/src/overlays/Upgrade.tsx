// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { RuntimeVersion } from '@polkadot/types/interfaces';

import React, { useEffect, useState } from 'react';
import { Button } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import BaseOverlay from './Base';

interface Props {
  className?: string;
}

let lastVersion = -1;

export default function Upgrade ({ className }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api, isApiReady, isApiConnected } = useApi();
  const runtimeVersion = useCall<RuntimeVersion>(api.rpc.state.subscribeRuntimeVersion, []);
  const [hasUpgraded, setHasUpgraded] = useState(false);

  useEffect((): void => {
    if (!hasUpgraded && runtimeVersion) {
      const version = runtimeVersion.specVersion.toNumber();

      if (lastVersion === -1) {
        lastVersion = version;
      }

      const newStatus = lastVersion !== version;

      if (newStatus !== hasUpgraded) {
        setHasUpgraded(newStatus);
      }

      lastVersion = version;
    }
  }, [hasUpgraded, runtimeVersion]);

  if (!isApiReady || !isApiConnected || !hasUpgraded || !runtimeVersion) {
    return null;
  }

  const _onReload = (): void => {
    window.location.reload();
  };

  return (
    <BaseOverlay
      className={className}
      icon='users'
      type='info'
    >
      <p>{t(`The runtime has been upgraded to ${runtimeVersion.specVersion.toNumber()}, your current interface would need to be refreshed to take advantage of the new features.`)}</p>
      <p>
        <Button
          icon='refresh'
          label={t('Reload')}
          onClick={_onReload}
        />
      </p>
    </BaseOverlay>
  );
}
