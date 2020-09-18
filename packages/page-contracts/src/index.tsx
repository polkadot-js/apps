// Copyright 2017-2020 @polkadot/app-contracts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AppProps as Props } from '@polkadot/react-components/types';
import { ComponentProps } from './types';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Route, Switch } from 'react-router';
import { HelpOverlay, Tabs } from '@polkadot/react-components';
import { useAccounts, useContracts, useToggle } from '@polkadot/react-hooks';

import introMd from './md/intro.md';
import store from './store';
import Contracts from './Contracts';
import Codes from './Codes';
import Deploy from './Deploy';
import { useTranslation } from './translate';

function ContractsApp ({ basePath, onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { allAccounts } = useAccounts();
  const { allContracts } = useContracts();
  const [codeHash, setCodeHash] = useState<string | undefined>();
  const [constructorIndex, setConstructorIndex] = useState(0);
  const [isDeployOpen, toggleIsDeployOpen, setIsDeployOpen] = useToggle();
  const [updated, setUpdated] = useState(0);
  const [allCodes, setAllCodes] = useState(store.getAllCode());

  const itemsRef = useRef([
    {
      name: 'code',
      text: t('Code')
    },
    {
      isRoot: true,
      name: 'contracts',
      text: t('Contracts')
    }
  ]);

  const _triggerUpdate = useCallback(
    (): void => {
      setUpdated(Date.now());
      setAllCodes(store.getAllCode());
    },
    []
  );

  const _onShowDeploy = useCallback(
    (codeHash?: string, constructorIndex = 0): () => void =>
      (): void => {
        setCodeHash(codeHash || (allCodes && allCodes[0] ? allCodes[0].json.codeHash : undefined));
        setConstructorIndex(constructorIndex);
        toggleIsDeployOpen();
      },
    [allCodes, toggleIsDeployOpen]
  );

  const _onCloseDeploy = useCallback(
    () => setIsDeployOpen(false),
    [setIsDeployOpen]
  );

  const componentProps = useMemo(
    (): ComponentProps => ({
      accounts: allAccounts,
      basePath,
      contracts: allContracts,
      hasCode: store.hasCode,
      onShowDeploy: _onShowDeploy,
      onStatusChange,
      updated
    }),
    [allAccounts, allContracts, basePath, _onShowDeploy, onStatusChange, updated]
  );

  useEffect(
    (): void => {
      store.on('new-code', _triggerUpdate);
      store.on('removed-code', _triggerUpdate);

      store.loadAll()
        .then((): void => setAllCodes(store.getAllCode()))
        .catch((): void => {
          // noop, handled internally
        });
    },
    [_triggerUpdate]
  );

  return (
    <main className='contracts--App'>
      <HelpOverlay md={introMd as string} />
      <header>
        <Tabs
          basePath={basePath}
          items={itemsRef.current}
        />
      </header>
      <Switch>
        <Route path={`${basePath}/code`}>
          <Codes {...componentProps} />
        </Route>
        <Route exact>
          <Contracts {...componentProps} />
        </Route>
      </Switch>
      {codeHash && (
        <Deploy
          allCodes={allCodes}
          basePath={basePath}
          codeHash={codeHash}
          constructorIndex={constructorIndex}
          isOpen={isDeployOpen}
          onClose={_onCloseDeploy}
          setCodeHash={setCodeHash}
          setConstructorIndex={setConstructorIndex}
        />
      )}
    </main>
  );
}

export default React.memo(ContractsApp);
