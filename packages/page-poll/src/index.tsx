// Copyright 2017-2021 @polkadot/app-poll authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Approvals, Balance, BlockNumber } from '@polkadot/types/interfaces';
import type { ITuple } from '@polkadot/types/types';

import BN from 'bn.js';
import React, { useEffect, useRef, useState } from 'react';
import { Trans } from 'react-i18next';
import styled from 'styled-components';

import { Button, Columar, InputAddress, Progress, Spinner, Tabs, Toggle, TxButton } from '@polkadot/react-components';
import { useApi, useBestNumber, useCallMulti } from '@polkadot/react-hooks';
import { BlockToTime, FormatBalance } from '@polkadot/react-query';
import { BN_MILLION, BN_ONE, BN_ZERO, bnMax, formatBalance, formatNumber } from '@polkadot/util';

import { useTranslation } from './translate';

interface Props {
  basePath: string;
  className?: string;
}

type MultiResult = [Balance | undefined, [Balance, Balance, Balance, Balance] | undefined];

interface Turnout {
  percentage: number;
  voted: BN;
}

const optMulti = {
  defaultValue: [undefined, undefined] as MultiResult
};

function PollApp ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const bestNumber = useBestNumber();
  const [totalIssuance, totals] = useCallMulti<MultiResult>([
    api.query.balances?.totalIssuance,
    api.query.poll.totals
  ], optMulti);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [turnout, setTurnout] = useState<Turnout | null>(null);
  const [opt10m, setOpt10m] = useState(false);
  const [opt100m, setOpt100m] = useState(false);
  const [opt1b, setOpt1b] = useState(false);
  const [opt10b, setOpt10b] = useState(false);
  const [progress, setProgress] = useState<BN[] | undefined>();

  const itemsRef = useRef([{
    isRoot: true,
    name: 'poll',
    text: t<string>('Denomination poll')
  }]);

  useEffect((): void => {
    if (totalIssuance && totals) {
      const max = bnMax(BN_ONE, ...totals);

      setProgress(totals.map((total) => total.mul(BN_MILLION).div(max)));

      api.query.poll.voteOf
        .entries<ITuple<[Approvals, Balance]>>()
        .then((entries): void => {
          const voted = entries.reduce((voted: BN, [, [, balance]]) => voted.iadd(balance), new BN(0));
          const percentage = voted.muln(10_000).div(totalIssuance).toNumber() / 100;

          setTurnout({ percentage, voted });
        })
        .catch(console.log);
    }
  }, [api, totalIssuance, totals]);

  if (!totals || !progress || !bestNumber) {
    return (
      <main className={className}>
        <div className='pollContainer'>
          <Spinner label={t<string>('Retrieving totals...')} />
        </div>
      </main>
    );
  }

  const blocksLeft = (api.consts.poll.end as BlockNumber).sub(bestNumber);
  const canVote = blocksLeft.gt(BN_ZERO);
  const options: [string, string, boolean, (value: boolean) => void][] = [
    [t('No change'), t('No change from the original 2017 sale definitions; will mean a total of 10 million DOT from genesis.'), opt10m, setOpt10m],
    [t('Split of 10x'), t('Split of 10x from the original sale; will mean a total of 100 million DOT from genesis. Apparent DOT price would be 10x lower and apparent account balances 10x higher.'), opt100m, setOpt100m],
    [t('Split of 100x'), t('Split of 100x from the original sale; will mean a total of 1 billion DOT from genesis. Apparent DOT price would be 100x lower and apparent account balances 100x higher.'), opt1b, setOpt1b],
    [t('Split of 1000x'), t('Split of 1000x from the original sale; will mean a total of 10 billion DOT from genesis. Apparent DOT price would be 1000x lower and apparent account balances 1000x higher.'), opt10b, setOpt10b]
  ];
  const hasValue = opt10m || opt100m || opt1b || opt10b;

  /* eslint-disable react/jsx-max-props-per-line */

  return (
    <main className={className}>
      <Tabs
        basePath={basePath}
        items={itemsRef.current}
      />
      <div className='pollContainer'>
        <div className='pollHeader'>
          <h1>{t('denomination vote')}</h1>
          <div className='pollBlocksRight'>
            {turnout && (
              <div>
                <div>{t('{{balance}} voted', { replace: { balance: formatBalance(turnout.voted) } })}</div>
                <div>{t('{{percentage}}% turnout', { replace: { percentage: turnout.percentage.toFixed(2) } })}</div>
              </div>
            )}
            <div>
              {canVote
                ? <BlockToTime value={blocksLeft} />
                : t<string>('Completed')
              }
              <div>#{formatNumber(api.consts.poll.end as BlockNumber)}</div>
            </div>
          </div>
        </div>
        <article className='keepAlive'>
          <p><Trans key='poll1'>The Polkadot DOT denomination vote: Seventy-two hours after the DOT token becomes transferable, the most popular option from this poll will decide the denomination used for the DOT token.</Trans></p>
          <p><Trans key='poll2'>This is an <a href='https://en.wikipedia.org/wiki/Approval_voting' rel='noreferrer' target='_blank'>approval vote</a>. There are four options and you may select any combination of them. The most popular of the four will be selected as the final DOT denomination three days after DOT token transfers are enabled.</Trans></p>
          <p><Trans key='poll3'>Please see the <a href='https://medium.com/polkadot-network/the-first-polkadot-vote-1fc1b8bd357b' rel='noreferrer' target='_blank'>Medium article </a> for more information</Trans></p>
          {canVote && (
            <p className='pollAll'><Trans key='poll4'><b>Please vote for any combination of options</b></Trans></p>
          )}
          <div className={`options ${canVote ? 'canVote' : ''}`}>
            {options.map(([label, desc, value, onChange], index) =>
              <Columar
                is60
                key={index}
              >
                <Columar.Column className='option'>
                  <div className='optionName'>{label}</div>
                  <div className='optionDesc'>{desc}</div>
                  {canVote && (
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
                  )}
                </Columar.Column>
                <Columar.Column>
                  {totals[index].isZero()
                    ? <div className='result' />
                    : (
                      <div className='result'>
                        <FormatBalance value={totals[index]} />
                        <Progress
                          isDisabled={!turnout}
                          total={turnout?.voted}
                          value={totals[index]}
                        />
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
                  tx={api.tx.poll.vote}
                />
              </Button.Group>
            </>
          )}
        </article>
        <div className='pollActions'>
          <ul>
            <li>{t('Any combination of the four options may be approved of by the voter. There is no need to select only one option!')}</li>
            <li>{t('Approving of all or none of the options is equivalent and will not affect the outcome of the poll.')}</li>
            <li>{t('All voters may alter their votes any number of times prior to the close of the poll.')}</li>
            <li>{t('Voting costs nothing other than the transaction fee and can be done from all accounts with a non-zero spendable balance.')}</li>
            <li>{t('Locked funds (e.g. for staking) are counted.')}</li>
            <li>{t('No discretionary lock-voting is in place; all DOT used to vote counts the same.')}</li>
            <li>{t('Voting is made on a per-account basis; a single account must all vote the same way and cannot split its vote.')}</li>
            <li>{t('This vote does not affect any economics of the Polkadot platform. Staking rewards, inflation, effective market capitalisation and the underlying balances of every account remain completely unchanged. It is "merely" about what units we use to denominate the balances into "DOT" for the purpose of display.')}</li>
          </ul>
        </div>
      </div>
    </main>
  );
}

export default React.memo(styled(PollApp)`
  .pollActions {
    opacity: 0.75;
  }

  .pollAll {
    margin-bottom: 0;
    padding: 0.75rem 1rem;
    text-align: center;
  }

  .pollBlocksRight {
    position: absolute;
    right: 0;
    text-align: right;
    opacity: 0.75;
    bottom: 0;

    > div {
      display: inline-block;
      padding: 0 0.75rem;

      &+div {
        border-left: 1px solid #bbb;
      }
    }
  }

  .pollContainer {
    margin: 2rem auto;
    max-width: 60rem;
  }

  .pollHeader {
    position: relative;
  }

  .options {
    margin: 1rem 0;

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
      font-weight: var(--font-weight-normal);
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
    align-items: center;
    display: flex;
    justify-content: flex-end;
    margin: 0;
    text-align: right;

    .ui--FormatBalance {
      font-size: 1.2rem;
      font-weight: var(--font-weight-normal);
      line-height: 1;
    }

    .ui--Progress {
      margin: 0.75rem;
    }
  }
`);
