// Copyright 2019 @polkadot/app-generic-asset authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React from 'react';

import { I18nProps } from '@polkadot/ui-app/types';
import { Button, CardGrid } from '@polkadot/ui-app';
import { withMulti, withObservable } from '@polkadot/ui-api';

import assetRegistry, { AssetsSubjectInfo } from './assetsRegistry';
import AssetCard from './AssetCard';
import CreateModal from './modals/Create';
import translate from './translate';

type Props = I18nProps & {
  assets?: AssetsSubjectInfo
};

interface State {
  isCreateOpen: boolean;
}

class Assets extends React.PureComponent<Props, State> {
  public state: State = {
    isCreateOpen: false
  };

  public render(): React.ReactNode {
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
          <AssetCard key={id} assetId={id} name={name}/>
        ))}
      </CardGrid>
    );
  }

  private onRegister = (id: BN, name: string) => {
    assetRegistry.add(id.toString(), name);
  }

  private toggleCreate = (): void => {
    this.setState(({ isCreateOpen }): State => ({
      isCreateOpen: !isCreateOpen
    }));
  }
}

export default withMulti(
  Assets,
  translate,
  withObservable(assetRegistry.subject, { propName: 'assets' })
);
