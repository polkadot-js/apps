// Copyright 2019 @polkadot/app-generic-asset authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';
import { CopyButton } from '@polkadot/react-components';
import Row, { styles, RowProps, RowState } from '@polkadot/react-components/Row';
import { I18nProps } from '@polkadot/react-components/types';

import translate from './translate';

type Props = I18nProps & RowProps & {
  onSaveName: (name: string) => void;
  assetId: string;
}

class AssetRow extends Row<Props, RowState> {
  constructor (props: Props) {
    super(props);

    this.state.name = this.props.defaultName || 'New Asset';
  }

  public render (): React.ReactNode {
    const { className } = this.props;

    return (
      <div
        className={`ui--Row ${className}`}
      >
        <div className='ui--Row-base'>
          <div className='ui--Row-details'>
            {this.renderName()}
            {this.renderAssetId()}
          </div>
          {this.renderButtons()}
        </div>
      </div>
    );
  }

  protected saveName = (): void => {
    const { name } = this.state;
    const { onSaveName } = this.props;

    const trimmedName = name.trim();

    onSaveName(trimmedName);
    this.setState({ isEditingName: false });
  }

  private renderAssetId (): React.ReactNode {
    const { assetId, t } = this.props;

    return (
      <div className='ui--Row-details'>
        <CopyButton value={assetId}>
          <span>{t('Asset ID')}: {assetId}</span>
        </CopyButton>
      </div>
    );
  }
}

export default translate(styled(AssetRow)`${styles}`);
