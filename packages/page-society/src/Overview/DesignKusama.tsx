// Copyright 2017-2021 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId } from '@polkadot/types/interfaces';

import React, { useEffect, useRef, useState } from 'react';

import { KUSAMA_GENESIS } from '@polkadot/apps-config';
import { Button, Modal } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';

import drawCanary, { PADD, SIZE } from '../draw/canary';
import { useTranslation } from '../translate';

interface Props {
  accountId: AccountId;
}

const CANVAS_STYLE = {
  display: 'block',
  margin: '0 auto'
};

const HEIGHT = (SIZE * 2) + (PADD * 1);
const WIDTH = (SIZE * 3) + (PADD * 2);

function DesignKusama ({ accountId }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [onKusama] = useState(() => api.genesisHash.eq(KUSAMA_GENESIS));
  const [isShowing, toggleDesign] = useToggle();

  useEffect((): void => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');

      if (ctx) {
        drawCanary(ctx, accountId);
      }
    }
  });

  if (!onKusama) {
    return null;
  }

  return (
    <>
      <Button
        icon='pen-nib'
        onClick={toggleDesign}
      />
      {isShowing && (
        <Modal
          header={t('design samples')}
          size='large'
        >
          <Modal.Content>
            <canvas
              height={HEIGHT}
              ref={canvasRef}
              style={CANVAS_STYLE}
              width={WIDTH}
            />
          </Modal.Content>
          <Modal.Actions
            cancelLabel={t<string>('Close')}
            onCancel={toggleDesign}
          />
        </Modal>
      )}
    </>
  );
}

export default React.memo(DesignKusama);
