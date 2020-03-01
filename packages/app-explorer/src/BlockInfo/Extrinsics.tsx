// Copyright 2017-2020 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BlockNumber, Extrinsic } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import styled from 'styled-components';
import { registry } from '@polkadot/react-api';
import { AddressMini, Call, Column, LinkExternal } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import translate from '../translate';

interface Props extends I18nProps {
  blockNumber?: BlockNumber;
  label?: React.ReactNode;
  value?: Extrinsic[] | null;
}

function renderExtrinsic (props: Props, extrinsic: Extrinsic, index: number): React.ReactNode {
  const { blockNumber, t } = props;
  const { meta, method, section } = registry.findMetaCall(extrinsic.callIndex);
  const isMortal = extrinsic.era.isMortalEra;
  let eraEnd;
  let eraStart;

  if (blockNumber && isMortal) {
    const mortalEra = extrinsic.era.asMortalEra;

    eraEnd = mortalEra.death(blockNumber.toNumber());
    eraStart = mortalEra.birth(blockNumber.toNumber());
  }

  return (
    <article key={`extrinsic:${index}`}>
      <div className='header'>
        <h3>
          {section}.{method}&nbsp;(#{formatNumber(index)})
        </h3>
        {extrinsic.isSigned && (
          <div className='explorer--BlockByHash-header'>
            <div>
              <AddressMini value={extrinsic.signer} />
            </div>
            <div className='explorer--BlockByHash-nonce'>
              {t('index')} {formatNumber(extrinsic.nonce)}
            </div>
          </div>
        )}
      </div>
      <details>
        <summary>{meta?.documentation.join(' ') || t('Details')}</summary>
        <Call
          className='details'
          mortality={
            isMortal
              ? blockNumber
                ? t('mortal, valid from #{{startAt}} to #{{endsAt}}', {
                  replace: {
                    endsAt: formatNumber(eraEnd),
                    startAt: formatNumber(eraStart)
                  }
                })
                : t('mortal')
              : t('immortal')
          }
          tip={extrinsic.tip.toBn()}
          value={extrinsic}
          withHash
        />
      </details>
      {
        extrinsic.isSigned
          ? <LinkExternal data={extrinsic.hash.toHex()} type='extrinsic' />
          : null
      }
    </article>
  );
}

function Extrinsics (props: Props): React.ReactElement<Props> {
  const { className, label, t, value } = props;

  return (
    <Column
      className={className}
      emptyText={t('No pending extrinsics are in the queue')}
      headerText={label || t('extrinsics')}
    >
      {value?.map((extrinsic, index): React.ReactNode => {
        try {
          return renderExtrinsic(props, extrinsic, index);
        } catch (error) {
          console.error(error);

          return props.t('Unable to render extrinsic');
        }
      })}
    </Column>
  );
}

export default translate(styled(Extrinsics)`
  .explorer--BlockByHash-header {
    position: absolute;
    top: 0.25rem;
    right: 0.75rem;
  }

  .explorer--BlockByHash-nonce {
    font-size: 0.75rem;
    margin-left: 2.25rem;
    margin-top: -0.625rem;
    opacity: 0.45;
    text-align: left;
  }
`);
