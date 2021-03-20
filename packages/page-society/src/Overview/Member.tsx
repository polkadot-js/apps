// Copyright 2017-2021 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { bool } from '@polkadot/types';
import type { MapMember } from '../types';

import React, { useEffect, useRef, useState } from 'react';

import { KUSAMA_GENESIS } from '@polkadot/apps-config';
import { AddressSmall, Icon, Modal, Tag } from '@polkadot/react-components';
import { useApi, useCall, useToggle } from '@polkadot/react-hooks';

import drawCanary from '../draw/canary';
import { useTranslation } from '../translate';

interface Props {
  className?: string;
  isFounder?: boolean;
  isHead?: boolean;
  isSkeptic?: boolean;
  value: MapMember;
}

const CANVAS_STYLE = {
  display: 'block',
  margin: '0 auto'
};

function Member ({ className = '', value: { isFounder, isHead, isSkeptic, isVoter, member: { accountId, strikes } } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const suspended = useCall<bool>(api.query.society.suspendedMembers, [accountId]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canInk] = useState(() => api.genesisHash.eq(KUSAMA_GENESIS));
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
            label={t<string>('society head')}
          />
        )}
        {isFounder && (
          <Tag
            color='green'
            label={t<string>('society founder')}
          />
        )}
        {isSkeptic && (
          <Tag
            color='yellow'
            label={t<string>('skeptic')}
          />
        )}
        {isVoter && (
          <Tag
            color='blue'
            label={t<string>('voted')}
          />
        )}
        {suspended?.isTrue && (
          <Tag
            color='red'
            label={t<string>('suspended')}
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
