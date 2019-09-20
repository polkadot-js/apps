// Copyright 2019 @polkadot/app-generic-asset authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Card, Button } from '@polkadot/react-components';
import { I18nProps } from '@polkadot/react-components/types';

import AssetRow from './AssetRow';
import translate from './translate';

interface Props extends I18nProps {
  assetId: string;
  name: string;
  onSaveName: (id: string, name: string) => void;
  onForget: (id: string) => void;
}

function AssetCard ({ className, assetId, name, onForget, onSaveName, t }: Props): React.ReactElement<Props> {
  const _onForget = (): void => onForget(assetId);
  const _onSaveName = (name: string): void => onSaveName(assetId, name);

  return (
    <Card className={className}>
      <div>
        <AssetRow
          isEditable
          assetId={assetId}
          defaultName={name}
          buttons={(
            <Button
              isNegative
              onClick={_onForget}
              icon='trash'
              key='forget'
              size='small'
              tooltip={t('Forget this asset')}
            />
          )}
          onSaveName={_onSaveName}
        />
      </div>
    </Card>
  );
}

export default translate(AssetCard);
