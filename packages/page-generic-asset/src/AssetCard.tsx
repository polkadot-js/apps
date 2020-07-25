// Copyright 2019 @polkadot/app-generic-asset authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useCallback } from 'react';
import { Card, Button } from '@polkadot/react-components';

import AssetRow from './AssetRow';
import { useTranslation } from './translate';

interface Props {
  assetId: string;
  className?: string;
  name: string;
  onSaveName: (id: string, name: string) => void;
  onForget: (id: string) => void;
}

function AssetCard ({ assetId, className = '', name, onForget, onSaveName }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const _onForget = useCallback(
    (): void => onForget(assetId),
    [assetId, onForget]
  );

  const _onSaveName = useCallback(
    (name: string): void => onSaveName(assetId, name),
    [assetId, onSaveName]
  );

  return (
    <Card className={className}>
      <div>
        <AssetRow
          assetId={assetId}
          buttons={(
            <Button
              icon='trash'
              key='forget'
              onClick={_onForget}
              tooltip={t<string>('Forget this asset')}
            />
          )}
          defaultName={name}
          onSaveName={_onSaveName}
        />
      </div>
    </Card>
  );
}

export default React.memo(AssetCard);
