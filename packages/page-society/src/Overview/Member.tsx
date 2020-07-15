// Copyright 2017-2020 @polkadot/app-society authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveSocietyMember } from '@polkadot/api-derive/types';

import React, { useEffect, useRef, useState } from 'react';
import { AddressSmall, Icon, Modal, Tag } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';

import drawCanary from '../draw/canary';
import { useTranslation } from '../translate';

interface Props {
  className?: string;
  isHead?: boolean;
  value: DeriveSocietyMember;
}

const CANVAS_STYLE = {
  display: 'block',
  margin: '0 auto'
};

function Member ({ className = '', isHead, value: { accountId, strikes } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canInk] = useState(api.genesisHash.eq('0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe'));
  const [isInkShowing, toggleInk] = useToggle();

  useEffect((): void => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');

      if (ctx) {
        drawCanary(ctx, accountId);
      }
    }
  });

  return (
    <tr className={className}>
      <td className='address'>
        <AddressSmall value={accountId} />
      </td>
      <td>
        {isHead && (
          <Tag
            color='green'
            hover={t<string>('Current society head, exempt')}
            label={t<string>('society head')}
          />
        )}
      </td>
      <td className='all'>&nbsp;</td>
      <td className='number'>
        {strikes.toString()}
      </td>
      <td>
        {canInk && (
          <>
            <Icon
              icon='pen-nib'
              onClick={toggleInk}
            />
            {isInkShowing && (
              <Modal
                header={t('design samples')}
                size='large'
              >
                <Modal.Content>
                  <canvas
                    height={525}
                    ref={canvasRef}
                    style={CANVAS_STYLE}
                    width={800}
                  />
                </Modal.Content>
                <Modal.Actions
                  cancelLabel={t<string>('Close')}
                  onCancel={toggleInk}
                />
              </Modal>
            )}
          </>
        )}
      </td>
    </tr>
  );
}

export default React.memo(Member);
