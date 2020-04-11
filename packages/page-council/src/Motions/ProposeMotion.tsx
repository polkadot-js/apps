// Copyright 2017-2020 @polkadot/app-council authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsic } from '@polkadot/api/types';

import BN from 'bn.js';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Extrinsic, InputAddress, InputNumber, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

interface Props {
  isMember: boolean;
  members: string[];
}

interface Threshold {
  isThresholdValid: boolean;
  threshold?: BN;
}

function Propose ({ isMember, members }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { apiDefaultTxSudo } = useApi();
  const [isOpen, toggleOpen] = useToggle();
  const [accountId, setAcountId] = useState<string | null>(null);
  const [method, setMethod] = useState<SubmittableExtrinsic<'promise'> | null | undefined>();
  const [{ isThresholdValid, threshold }, setThreshold] = useState<Threshold>({ isThresholdValid: false });

  useEffect((): void => {
    members && setThreshold({
      isThresholdValid: members.length !== 0,
      threshold: new BN(Math.ceil(members.length * 0.5))
    });
  }, [members]);

  const _setMethod = useCallback(
    (method?: SubmittableExtrinsic<'promise'> | null) => setMethod(() => method),
    []
  );

  const _setThreshold = useCallback(
    (threshold?: BN) => setThreshold({
      isThresholdValid: !!threshold?.gtn(0),
      threshold
    }),
    []
  );

  return (
    <>
      <Button
        icon='add'
        isDisabled={!isMember}
        label={t('Propose motion')}
        onClick={toggleOpen}
      />
      {isOpen && (
        <Modal header={t('Propose a council motion')}>
          <Modal.Content>
            <InputAddress
              filter={members}
              help={t('Select the account you wish to make the proposal with.')}
              label={t('propose from account')}
              onChange={setAcountId}
              type='account'
              withLabel
            />
            <InputNumber
              className='medium'
              help={t('The minimum number of council votes required to approve this motion')}
              isError={!threshold || threshold.eqn(0) || threshold.gtn(members.length)}
              label={t('threshold')}
              onChange={_setThreshold}
              placeholder={t('Positive number between 1 and {{memberCount}}', { replace: { memberCount: members.length } })}
              value={threshold || new BN(0)}
            />
            <Extrinsic
              defaultValue={apiDefaultTxSudo}
              label={t('proposal')}
              onChange={_setMethod}
            />
          </Modal.Content>
          <Modal.Actions onCancel={toggleOpen}>
            <TxButton
              accountId={accountId}
              isDisabled={!method || !isThresholdValid}
              label={t('Propose')}
              params={[threshold, method]}
              tx='council.propose'
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(Propose);
