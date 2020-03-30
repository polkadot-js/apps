// Copyright 2017-2020 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BlockNumber, Extrinsic } from '@polkadot/types/interfaces';

import React from 'react';
import styled from 'styled-components';
import { registry } from '@polkadot/react-api';
import { AddressMini, Call, Column, Expander, LinkExternal, Table } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  blockNumber?: BlockNumber;
  className?: string;
  label?: React.ReactNode;
  value?: Extrinsic[] | null;
}

function getEra ({ era }: Extrinsic, blockNumber?: BlockNumber): [number, number] | null {
  if (blockNumber && era.isMortalEra) {
    const mortalEra = era.asMortalEra;

    return [mortalEra.birth(blockNumber.toNumber()), mortalEra.death(blockNumber.toNumber())];
  }

  return null;
}

function Extrinsics ({ className, blockNumber, label, value }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <Column className={className}>
      <Table>
        <Table.Head>
          <th className='start'><h1>{label || t('extrinsics')}</h1></th>
        </Table.Head>
        <Table.Body empty={t('No pending extrinsics are in the queue')}>
          {value?.map((extrinsic, index): React.ReactNode => {
            const { meta, method, section } = registry.findMetaCall(extrinsic.callIndex);
            const era = getEra(extrinsic, blockNumber);

            return (
              <tr key={`extrinsic:${index}`}>
                <td className='relative overflow'>
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
                  <Expander
                    summary={`${section}.${method} (#${formatNumber(index)})`}
                    summaryMeta={meta}
                  >
                    <Call
                      className='details'
                      mortality={
                        era
                          ? blockNumber
                            ? t('mortal, valid from #{{startAt}} to #{{endsAt}}', {
                              replace: {
                                endsAt: formatNumber(era[1]),
                                startAt: formatNumber(era[0])
                              }
                            })
                            : t('mortal')
                          : t('immortal')
                      }
                      tip={extrinsic.tip?.toBn()}
                      value={extrinsic}
                      withHash
                    />
                  </Expander>
                  {
                    extrinsic.isSigned
                      ? <LinkExternal data={extrinsic.hash.toHex()} type='extrinsic' />
                      : null
                  }
                </td>
              </tr>
            );
          })}
        </Table.Body>
      </Table>
    </Column>
  );
}

export default React.memo(styled(Extrinsics)`
  .explorer--BlockByHash-header {
    position: absolute;
    top: 0.75rem;
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
