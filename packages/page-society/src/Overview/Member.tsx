// Copyright 2017-2020 @polkadot/app-society authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveSocietyMember } from '@polkadot/api-derive/types';

import React, { useEffect, useRef } from 'react';
import { AddressSmall, Icon, Modal, Tag } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
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
      <td className='number top'>
        {strikes.toString()}
      </td>
      <td>
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
                height={500}
                ref={canvasRef}
                style={CANVAS_STYLE}
                width={750}
              />
            </Modal.Content>
            <Modal.Actions onCancel={toggleInk}>
              &nbsp;
            </Modal.Actions>
          </Modal>
        )}
      </td>
    </tr>
  );
}

export default React.memo(Member);
