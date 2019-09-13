// Copyright 2019 @polkadot/app-generic-asset authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';

import { Card, Button } from '@polkadot/react-components';
import { I18nProps } from '@polkadot/react-components/types';

import AssetRow from './AssetRow';
import translate from './translate';

type Props = I18nProps & {
  assetId: string;
  name: string;
  onSaveName: (id: string, name: string) => void;
  onForget: (id: string) => void;
};

const Details = styled.div`
`;

class AssetCard extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { className, assetId, name, t } = this.props;

    return (
      <Card className={className}>
        <Details>
          <AssetRow
            isEditable
            assetId={assetId}
            defaultName={name}
            buttons={(
              <Button
                isNegative
                onClick={this.onForget}
                icon='trash'
                key='forget'
                size='small'
                tooltip={t('Forget this asset')}
              />
            )}
            onSaveName={this.onSaveName}
          />
        </Details>
      </Card>
    );
  }

  private onForget = (): void => {
    this.props.onForget(this.props.assetId);
  };

  private onSaveName = (name: string): void => {
    this.props.onSaveName(this.props.assetId, name);
  }
}

export default translate(AssetCard);
