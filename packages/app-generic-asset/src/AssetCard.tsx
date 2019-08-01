// Copyright 2019 @polkadot/app-generic-asset authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

import { Card } from '@polkadot/ui-app';
import { I18nProps } from '@polkadot/ui-app/types';

import translate from './translate';

type Props = I18nProps & {
  assetId: string;
  name: string;
};

class AssetCard extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { className, assetId, name } = this.props;

    return (
      <Card className={className}>
        <div>
          {name}
        </div>
        <div>
          ID: {assetId}
        </div>
      </Card>
    )
  }
}

export default translate(AssetCard);
