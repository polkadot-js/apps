// Copyright 2019 @polkadot/app-generic-asset authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React, { useState } from 'react';
import { Button, CardGrid } from '@polkadot/react-components';
import { withMulti, withObservable } from '@polkadot/react-api';

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
            isPrimary
            label={t('Register Asset')}
            labelIcon='registered'
            onClick={_toggleCreate}
          />
        </Button.Group>
      }
      isEmpty={emptyScreen}
      emptyText={t('No assets found.')}
    >
      {isCreateOpen && (
        <CreateModal
          onClose={_toggleCreate}
          onRegister={_onRegister}
        />
      )}
      {assets && Object.entries(assets).map(([id, name]): React.ReactNode => (
        <AssetCard
          key={id}
          assetId={id}
          name={name}
          onSaveName={_onSaveName}
          onForget={_onForget}
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
