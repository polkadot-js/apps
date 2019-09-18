// Copyright 2019 @polkadot/app-generic-asset authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React from 'react';

import { I18nProps } from '@polkadot/react-components/types';
import { Button, CardGrid } from '@polkadot/react-components';
import { withMulti, withObservable } from '@polkadot/react-api';

import assetRegistry, { AssetsSubjectInfo } from './assetsRegistry';
import AssetCard from './AssetCard';
import CreateModal from './modals/Create';
import translate from './translate';

type Props = I18nProps & {
  assets?: AssetsSubjectInfo;
};

interface State {
  isCreateOpen: boolean;
}

class Assets extends React.PureComponent<Props, State> {
  public state: State = {
    isCreateOpen: false
  };

  public render (): React.ReactNode {
    const { assets, t } = this.props;
    const { isCreateOpen } = this.state;
    const emptyScreen = !isCreateOpen && (!assets || Object.keys(assets).length === 0);

    return (
      <CardGrid
        buttons={
          <Button.Group>
            <Button
              isPrimary
              label={t('Register Asset')}
              onClick={this.toggleCreate}
            />
          </Button.Group>
        }
        isEmpty={emptyScreen}
        emptyText={t('No assets found.')}
      >
        {isCreateOpen && (
          <CreateModal
            onClose={this.toggleCreate}
            onRegister={this.onRegister}
          />
        )}
        {assets && Object.entries(assets).map(([id, name]): React.ReactNode => (
          <AssetCard
            key={id}
            assetId={id}
            name={name}
            onSaveName={this.onSaveName}
            onForget={this.onForget}
          />
        ))}
      </CardGrid>
    );
  }

  private onRegister = (id: BN, name: string): void => {
    assetRegistry.add(id.toString(), name);
  }

  private toggleCreate = (): void => {
    this.setState(({ isCreateOpen }): State => ({
      isCreateOpen: !isCreateOpen
    }));
  }

  private onSaveName = (id: string, name: string): void => {
    assetRegistry.add(id, name);
  }

  private onForget = (id: string): void => {
    assetRegistry.remove(id);
  }
}

export default withMulti(
  Assets,
  translate,
  withObservable(assetRegistry.subject, { propName: 'assets' })
);
