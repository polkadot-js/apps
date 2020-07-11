// Copyright 2017-2020 @polkadot/app-poll authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Balance, BlockNumber } from '@polkadot/types/interfaces';
import { ITuple } from '@polkadot/types/types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, Columar, InputAddress, Progress, Spinner, Toggle, TxButton } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { FormatBalance, BlockToTime } from '@polkadot/react-query';
import { BN_ONE, BN_ZERO, bnMax, formatNumber } from '@polkadot/util';

import { useTranslation } from './translate';

interface Props {
  className?: string;
}

const DIV = new BN(1_000_000);

function PollApp ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const totals = useCall<ITuple<[Balance, Balance, Balance, Balance]>>(api.query.poll.totals, []);
  const bestNumber = useCall<BlockNumber>(api.derive.chain.bestNumber, []);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [opt10m, setOpt10m] = useState(true);
  const [opt100m, setOpt100m] = useState(false);
  const [opt1b, setOpt1b] = useState(false);
  const [opt10b, setOpt10b] = useState(false);
  const [progress, setProgress] = useState<BN[] | undefined>();

  useEffect((): void => {
    if (totals) {
      const max = bnMax(BN_ONE, ...totals);

      setProgress(totals.map((total) => total.mul(DIV).div(max)));
    }
  }, [totals]);

  if (!totals || !progress || !bestNumber) {
    return <Spinner label={t<string>('Retrieving totals...')} />;
  }

  const blocksLeft = (api.consts.poll.end as BlockNumber).sub(bestNumber);
  const canVote = blocksLeft.gt(BN_ZERO);
  const options: [string, boolean, (value: boolean) => void][] = [
    [t('10 million DOTs; status quo'), opt10m, setOpt10m],
    [t('100 million DOTs; 11 decimals'), opt100m, setOpt100m],
    [t('1 billion DOTs; 10 decimals'), opt1b, setOpt1b],
    [t('10 billion DOTs; 9 decimals'), opt10b, setOpt10b]
  ];

  return (
    <main className={className}>
      <div className='pollContainer'>
        <h1>{t('poll on token decimals')}</h1>
        <article className='keepAlive'>
          <p>{t('This poll is setup to judge the sentiment of the Polkadot token holders in adjusting the number of decimals that is used to identify one full DOT. It does not change the overall supply, but rather just allows for a different representation of the current supply.')}</p>
          <p>{t('You can indicate your vote for any combination of the options laid out below.')}</p>
          <div className={`options ${canVote ? 'canVote' : ''}`}>
            {options.map(([label, value, onChange], index) =>
              <Columar key={index}>
                <Columar.Column className='option'>
                  <div className='optionName'>{label}</div>
                  <Toggle
                    className='pollToggle'
                    isDisabled={!canVote}
                    label={
                      canVote
                        ? value
                          ? t<string>('Aye, I can support this')
                          : t<string>('Nay, I cannot support this')
                        : t<string>('Voting closed')
                    }
                    onChange={onChange}
                    value={canVote && value}
                  />
                </Columar.Column>
                <Columar.Column>
                  {totals[index].isZero()
                    ? <div className='result' />
                    : (
                      <div className='result'>
                        <Progress
                          total={DIV}
                          value={progress[index]}
                        />
                        <FormatBalance value={totals[index]} />
                      </div>
                    )
                  }
                </Columar.Column>
              </Columar>
            )}
          </div>
          {canVote && (
            <>
              <InputAddress
                label={t('vote using my account')}
                onChange={setAccountId}
                type='account'
              />
              <Button.Group>
                <TxButton
                  accountId={accountId}
                  icon='paper-plane'
                  label={t('Vote')}
                  params={[[opt10m, opt100m, opt1b, opt10b]]}
                  tx='poll.vote'
                />
              </Button.Group>
            </>
          )}
        </article>
        <div className='pollBlocksRight'>
          {canVote && <BlockToTime blocks={blocksLeft} />}
          <div>#{formatNumber(api.consts.poll.end as BlockNumber)}</div>
        </div>
      </div>
    </main>
  );
}

export default React.memo(styled(PollApp)`
  .pollBlocksRight {
    padding: 0.5rem 1rem;
    text-align: right;
  }

  .pollContainer {
    margin: 2rem auto;
    max-width: 50rem;
  }

  .options {
    margin: 1.5rem 0 1rem 0;

    .ui--Columnar {
      margin: 0 -1.25rem;
      padding: 0 1.25rem;

      &:nth-child(odd) {
        background: #f9f8f7;
      }

      .ui--Column {
        padding: 1rem 1.5rem;
      }
    }

    .optionName {
      font-size: 1.2rem;
      font-weight: 100;
      line-height: 1;
    }

    .pollToggle {
      margin-top: 0.5rem;
      text-align: right;
    }

    &:not(.canVote) {
      .ui--Toggle {
        opacity: 0;

        .toggle {
          display: none;
        }
      }
    }
  }

  .result {
    margin: 1rem 0 0 0;
    text-align: right;

    .ui--Progress {
      margin-bottom: 0.5rem;
    }
  }
`);
