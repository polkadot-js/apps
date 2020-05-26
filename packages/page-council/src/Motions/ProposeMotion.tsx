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
        label={t<string>('Propose motion')}
        onClick={toggleOpen}
      />
      {isOpen && (
        <Modal
          header={t<string>('Propose a council motion')}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns>
              <Modal.Column>
                <InputAddress
                  filter={members}
                  help={t<string>('Select the account you wish to make the proposal with.')}
                  label={t<string>('propose from account')}
                  onChange={setAcountId}
                  type='account'
                  withLabel
                />
              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('The council account for the proposal. The selection is filtered by the current members.')}</p>
              </Modal.Column>
            </Modal.Columns>
            <Modal.Columns>
              <Modal.Column>
                <InputNumber
                  className='medium'
                  help={t<string>('The minimum number of council votes required to approve this motion')}
                  isError={!threshold || threshold.eqn(0) || threshold.gtn(members.length)}
                  label={t<string>('threshold')}
                  onChange={_setThreshold}
                  placeholder={t<string>('Positive number between 1 and {{memberCount}}', { replace: { memberCount: members.length } })}
                  value={threshold || new BN(0)}
                />
              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('The desired threshold. Here set to a default of 50%+1, as applicable for general proposals.')}</p>
              </Modal.Column>
            </Modal.Columns>
            <Modal.Columns>
              <Modal.Column>
                <Extrinsic
                  defaultValue={apiDefaultTxSudo}
                  label={t<string>('proposal')}
                  onChange={_setMethod}
                />
              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('The actual proposal to make, based on the selected call and parameters thereof.')}</p>
              </Modal.Column>
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions onCancel={toggleOpen}>
            <TxButton
              accountId={accountId}
              isDisabled={!method || !isThresholdValid}
              label={t<string>('Propose')}
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
