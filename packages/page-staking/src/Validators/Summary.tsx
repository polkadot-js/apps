// Copyright 2017-2024 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveStakingOverview } from '@polkadot/api-derive/types';
import type {SortedTargets, ValidatorInfo} from '../types.js';

import React from 'react';

import SummarySession from '@polkadot/app-explorer/SummarySession';
import {AddressSmall, Button, CardSummary, IdentityIcon, styled, SummaryBox} from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate.js';
import {useAccountId, useAccountInfo, useAccounts, useBlockAuthors, useToggle} from '@polkadot/react-hooks'
import Chill from '../models/chill'
import Validate from '../models/validate'
import RegisterNode from '../models/RegisterNode'

interface Props {
  className?: string;
  nominators?: string[];
  stakingOverview?: DeriveStakingOverview;
  targets: ValidatorInfo[];
  onVoteSuccess?: () => Promise<void>;
}

function Summary ({ className = '', stakingOverview, onVoteSuccess, targets
                    // targets: { counterForNominators, nominators, waitingIds }
}: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { lastBlockAuthors, lastBlockNumber } = useBlockAuthors();
  const [isValidateOpen, toggleValidate] = useToggle();
  const [isChillOpen, toggleChill] = useToggle();
  const [isRegister, toggleRegister] = useToggle();
  const { allAccounts } = useAccounts()

  const renderActionButton = () => {
    const targetAccount = targets.find(i => allAccounts.includes(i.account!))

    if (targetAccount) {
      if (stakingOverview && stakingOverview.candidateorDrop[0]?.isChilled) {
        return <Button icon='plus' onClick={toggleValidate} label={t('Candidate')} />
      } else {
        return <Button icon='plus' onClick={toggleChill} label={t('Drop')} />

      }
    } else {
      return <Button className={'register-node'} icon='plus' onClick={toggleRegister} label={t('Register validator')} />
    }
  }

  return (
    <StyledSummaryBox className={className}>
      {/*<section>*/}
      {/*  <CardSummary label={t('validators')}>*/}
      {/*    {stakingOverview*/}
      {/*      ? <>{formatNumber(stakingOverview.validators.length)}&nbsp;/&nbsp;{formatNumber(stakingOverview.validatorCount)}</>*/}
      {/*      : <span className='--tmp'>999 / 999</span>*/}
      {/*    }*/}
      {/*  </CardSummary>*/}
      {/*  <CardSummary*/}
      {/*    className='media--900'*/}
      {/*    label={t('waiting')}*/}
      {/*  >*/}
      {/*    /!*{waitingIds*!/*/}
      {/*    /!*  ? formatNumber(waitingIds.length)*!/*/}
      {/*    /!*  : <span className='--tmp'>99</span>*!/*/}
      {/*    /!*}*!/*/}
      {/*  </CardSummary>*/}
      {/*  <CardSummary*/}
      {/*    className='media--1000'*/}
      {/*    label={*/}
      {/*      counterForNominators*/}
      {/*        ? t('active / nominators')*/}
      {/*        : t('nominators')*/}
      {/*    }*/}
      {/*  >*/}
      {/*    {nominators*/}
      {/*      ? (*/}
      {/*        <>*/}
      {/*          {formatNumber(nominators.length)}*/}
      {/*          {counterForNominators && (*/}
      {/*            <>&nbsp;/&nbsp;{formatNumber(counterForNominators)}</>*/}
      {/*          )}*/}
      {/*        </>*/}
      {/*      )*/}
      {/*      : <span className='--tmp'>999 / 999</span>*/}
      {/*    }*/}
      {/*  </CardSummary>*/}
      {/*</section>*/}
      {/*<section>*/}
      {/*  /!*{(idealStake > 0) && Number.isFinite(idealStake) && (*!/*/}
      {/*  /!*  <CardSummary*!/*/}
      {/*  /!*    className='media--1400'*!/*/}
      {/*  /!*    label={t('ideal staked')}*!/*/}
      {/*  /!*  >*!/*/}
      {/*  /!*    <>{(idealStake * 100).toFixed(1)}{percent}</>*!/*/}
      {/*  /!*  </CardSummary>*!/*/}
      {/*  /!*)}*!/*/}
      {/*  /!*{(stakedFraction > 0) && (*!/*/}
      {/*  /!*  <CardSummary*!/*/}
      {/*  /!*    className='media--1300'*!/*/}
      {/*  /!*    label={t('staked')}*!/*/}
      {/*  /!*  >*!/*/}
      {/*  /!*    <>{(stakedFraction * 100).toFixed(1)}{percent}</>*!/*/}
      {/*  /!*  </CardSummary>*!/*/}
      {/*  /!*)}*!/*/}
      {/*  /!*{(inflation > 0) && Number.isFinite(inflation) && (*!/*/}
      {/*  /!*  <CardSummary*!/*/}
      {/*  /!*    className='media--1200'*!/*/}
      {/*  /!*    label={t('inflation')}*!/*/}
      {/*  /!*  >*!/*/}
      {/*  /!*    <>{inflation.toFixed(1)}{percent}</>*!/*/}
      {/*  /!*  </CardSummary>*!/*/}
      {/*  /!*)}*!/*/}
      {/*</section>*/}
      <section>
        {stakingOverview && (
          <CardSummary label={t('Validator')}>
            {stakingOverview.validatorCount.toString()} &nbsp;/&nbsp; {stakingOverview.validators.length}
          </CardSummary>
        )}
      </section>
      <section>
        <SummarySession />
      </section>

      {/*<section>*/}
      {/*  <CardSummary*/}
      {/*    className='validator--Summary-authors'*/}
      {/*    label={t('Last Block')}*/}
      {/*  >*/}
      {/*    {lastBlockAuthors?.map((author): React.ReactNode => (*/}
      {/*      <IdentityIcon*/}
      {/*        className='validator--Account-block-icon'*/}
      {/*        key={author}*/}
      {/*        value={author}*/}
      {/*      />*/}
      {/*    ))}*/}
      {/*    {lastBlockNumber}*/}
      {/*  </CardSummary>*/}
      {/*</section>*/}
      {/*<section>*/}
      {/*  <CardSummary*/}
      {/*    className='validator--Summary-authors'*/}
      {/*    label={t('Block Producer')}*/}
      {/*  >*/}
      {/*    {lastBlockAuthors?.map((author): React.ReactNode => (*/}
      {/*      <AddressSmall value={author} key={author} />*/}
      {/*    ))}*/}
      {/*  </CardSummary>*/}
      {/*</section>*/}
      <section>
        {renderActionButton()}
      </section>
      {/*<section>*/}
        {/*{*/}
        {/*  hasAccounts ? <span>{*/}
        {/*    targets.find(item => item.account === currentAccount) ? (<span>*/}
        {/*      {stakingOverview && (*/}
        {/*        stakingOverview.CandidateorDrop[0].isChilled ? (*/}
        {/*            <Button*/}
        {/*              icon='plus'*/}
        {/*              onClick={toggleValidate}*/}
        {/*              label={t<string>('Candidate')}*/}
        {/*            />*/}
        {/*          ):*/}
        {/*          <Button*/}
        {/*            icon='plus'*/}
        {/*            onClick={toggleChill}*/}
        {/*            label={t<string>('Drop')}*/}
        {/*          />*/}
        {/*      )}*/}
        {/*    </span>) :*/}
        {/*      <SummarySession setN={setN} />*/}
        {/*  }</span> : <span>*/}
        {/*    <SummarySession setN={setN} />*/}
        {/*  </span>*/}
        {/*}*/}
      {/*  <div>*/}
      {
        isValidateOpen && (
          <Validate
            onClose={toggleValidate}
            validatorId={stakingOverview?.candidateorDrop[0].account + ''}
            onSuccess={onVoteSuccess}
          />
        )
      }
      {isRegister && <RegisterNode onClose={toggleRegister} onSuccess={onVoteSuccess} />}

      {
        isChillOpen && (
          <Chill
            onClose={toggleChill}
            validatorId={stakingOverview?.candidateorDrop[0].account + ''}
            onSuccess={onVoteSuccess}
          />
        )
      }

      {/*  </div>*/}
      {/*</section>*/}
    </StyledSummaryBox>
  );
}

const StyledSummaryBox = styled(SummaryBox)`
  align-items: center;
  .validator--Account-block-icon {
    display: inline-block;
    margin-right: 0.75rem;
    margin-top: -0.25rem;
    vertical-align: middle;
  }

  .validator--Summary-authors {
    .validator--Account-block-icon+.validator--Account-block-icon {
      margin-left: -1.5rem;
    }
  }

  .percent {
    font-size: var(--font-percent-tiny);
  }
  .register-node {
    height: fit-content;
  }
`;

export default React.memo(Summary);
