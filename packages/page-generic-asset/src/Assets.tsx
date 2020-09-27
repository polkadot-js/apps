// Copyright 2019 @polkadot/app-generic-asset authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { I18nProps } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React, { useState } from 'react';
import { Button, CardGrid } from '@polkadot/react-components';
import { withMulti, withObservable } from '@polkadot/react-api/hoc';

import assetRegistry, { AssetsSubjectInfo } from './assetsRegistry';
import AssetCard from './AssetCard';
import CreateModal from './modals/Create';
import translate from './translate';

type Props = I18nProps & {
  assets?: AssetsSubjectInfo;
};

function Assets ({ assets, t }: Props): React.ReactElement<Props> {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const emptyScreen = !isCreateOpen && (!assets || Object.keys(assets).length === 0);

  const _onForget = (id: string): void => assetRegistry.remove(id);
  const _onRegister = (id: BN, name: string): void => assetRegistry.add(id.toString(), name);
  const _onSaveName = (id: string, name: string): void => assetRegistry.add(id, name);
  const _toggleCreate = (): void => setIsCreateOpen(!isCreateOpen);

  return (
    <CardGrid
      buttons={
        <Button.Group>
          <Button
            icon='registered'
            label={t<string>('Register Asset')}
            onClick={_toggleCreate}
          />
        </Button.Group>
      }
      emptyText={t<string>('No assets found.')}
      isEmpty={emptyScreen}
    >
      {isCreateOpen && (
        <CreateModal
          onClose={_toggleCreate}
          onRegister={_onRegister}
        />
      )}
      {assets && Object.entries(assets).map(([id, name]): React.ReactNode => (
        <AssetCard
          assetId={id}
          key={id}
          name={name}
          onForget={_onForget}
          onSaveName={_onSaveName}
        />
      ))}
    </CardGrid>
  );
}

export default withMulti(
  Assets,
  translate,
  withObservable(assetRegistry.subject, { propName: 'assets' })
);
