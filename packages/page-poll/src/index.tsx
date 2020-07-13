// Copyright 2017-2020 @polkadot/app-poll authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Balance, BlockNumber } from '@polkadot/types/interfaces';
import { ITuple } from '@polkadot/types/types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
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
  const [opt10m, setOpt10m] = useState(false);
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
  const options: [string, string, boolean, (value: boolean) => void][] = [
    [t('No change'), t('No change from the original 2017 sale definitions; will mean a total of 10m DOT from genesis.'), opt10m, setOpt10m],
    [t('Split of 10x'), t('Split of 10x from the original sale; will mean a total of 100m DOT from genesis. Apparent DOT price would be 10x lower.'), opt100m, setOpt100m],
    [t('Split of 100x'), t('Split of 100x from the original sale; will mean a total of 1b DOT from genesis. Apparent DOT price would be 100x lower.'), opt1b, setOpt1b],
    [t('Split of 1000x'), t('Split of 1,000x from the original sale; will mean a total of 10b DOT from genesis. Apparent DOT price would be 1000x lower.'), opt10b, setOpt10b]
  ];
  const hasValue = opt10m || opt100m || opt1b || opt10b;

  /* eslint-disable react/jsx-max-props-per-line */

  return (
    <main className={className}>
      <div className='pollContainer'>
        <h1>{t('denomination vote')}</h1>
        <article className='keepAlive'>
          <p><Trans key='poll1'>The Polkadot DOT denomination vote: Seventy-two hours after the DOT token becomes transferable, the most popular option from this poll will decide the denomination used for the DOT token.</Trans></p>
          <p><Trans key='poll2'>This is an <a href='https://en.wikipedia.org/wiki/Approval_voting' rel='noreferrer' target='_blank'>approval vote</a>. There are four options and you may select any combination of them. The most popular of the four will be selected as the final DOT denomination three days after DOT token transfers are enabled.</Trans></p>
          <p><Trans key='poll2'>Please see the <a href='https://medium.com/polkadot-network/the-first-polkadot-vote-1fc1b8bd357b' rel='noreferrer' target='_blank'>Medium article </a> for more information</Trans></p>
          <div className={`options ${canVote ? 'canVote' : ''}`}>
            {options.map(([label, desc, value, onChange], index) =>
              <Columar
                is60
                key={index}
              >
                <Columar.Column className='option'>
                  <div className='optionName'>{label}</div>
                  <div className='optionDesc'>{desc}</div>
                  <Toggle
                    className='pollToggle'
                    isDisabled={!canVote}
                    label={
                      canVote
                        ? value
                          ? t<string>('Aye, I support this')
                          : t<string>('Nay, I do not support this')
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
                  isDisabled={!hasValue}
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
    max-width: 60rem;
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
      margin-bottom: 0.75rem;
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
    margin: 2.2rem 0 0 0;
    text-align: right;

    .ui--Progress {
      margin-bottom: 0.5rem;
    }
  }
`);
