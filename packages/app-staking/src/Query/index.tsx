// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { BlockNumber } from '@polkadot/types/interfaces';
import { ComponentProps } from '../types';

import React, { useEffect, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Button, InputAddressSimple } from '@polkadot/react-components';

import translate from '../translate';
import Validator from './Validator';

interface Props extends I18nProps, ComponentProps, RouteComponentProps<{}> {
  match: {
    isExact: boolean;
    params: {
      value: string;
    };
    path: string;
    url: string;
  };
}

// const _onQuery = (): void => {
//   if (isValid && value.length !== 0) {
//     window.location.hash = `/explorer/query/${value}`;
//   }
// };

// return (
//   <FilterOverlay className={className}>
//     <Input
//       className='explorer--query'
//       defaultValue={propsValue}
//       isError={!isValid && value.length !== 0}
//       placeholder={t('block hash or number to query')}
//       onChange={_setHash}
//       onEnter={_onQuery}
//       withLabel={false}
//     >
//       <Button
//         icon='play'
//         onClick={_onQuery}
//       />
//     </Input>

function Query ({ bestNumber, className, sessionRewards, stakingOverview, match: { params: { value } }, t }: Props): React.ReactElement<Props> {
  const [startNumber, setStartNumber] = useState<BlockNumber | undefined>();
  const [validatorId, setValidatorId] = useState<string | null>(value || null);

  useEffect((): void => {
    if (bestNumber && !startNumber) {
      setStartNumber(bestNumber);
    }
  }, [bestNumber, startNumber]);

  const _onQuery = (): void => {
    if (validatorId) {
      window.location.hash = `/staking/query/${validatorId}`;
    }
  };

  return (
    <div className={className}>
      <InputAddressSimple
        className='staking--queryInput'
        defaultValue={value}
        help={t('Display overview information for the selected validator, including blocks produced.')}
        label={t('validator to query')}
        onChange={setValidatorId}
        onEnter={_onQuery}
      >
        <Button
          icon='play'
          isDisabled={!validatorId}
          onClick={_onQuery}
        />
      </InputAddressSimple>
      {value && startNumber && stakingOverview && (
        <Validator
          currentIndex={stakingOverview.currentIndex}
          sessionRewards={sessionRewards}
          startNumber={startNumber}
          validatorId={value}
        />
      )}
    </div>
  );
}

export default translate(withRouter(Query));
