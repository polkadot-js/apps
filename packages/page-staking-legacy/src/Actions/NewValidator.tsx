// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { SortedTargets } from '../types.js';
import type { BondInfo, SessionInfo, ValidateInfo } from './partials/types.js';

import React, { useCallback, useState } from 'react';

import { BatchWarning, Button, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';
import { isFunction } from '@polkadot/util';

import { useTranslation } from '../translate.js';
import BondPartial from './partials/Bond.js';
import SessionKeyPartial from './partials/SessionKey.js';
import ValidatePartial from './partials/Validate.js';

interface Props {
  isInElection?: boolean;
  minCommission?: BN;
  targets: SortedTargets;
}

const NUM_STEPS = 2;

function NewValidator ({ isInElection, minCommission, targets }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [isVisible, toggleVisible] = useToggle();
  const [{ bondTx, controllerId, controllerTx, stashId }, setBondInfo] = useState<BondInfo>({});
  const [{ sessionTx }, setSessionInfo] = useState<SessionInfo>({});
  const [{ validateTx }, setValidateInfo] = useState<ValidateInfo>({});
  const [step, setStep] = useState(1);
  const isDisabled = isInElection || !isFunction(api.tx.utility?.batch);

  const _nextStep = useCallback(
    () => setStep((step) => step + 1),
    []
  );

  const _prevStep = useCallback(
    () => setStep((step) => step - 1),
    []
  );

  const _toggle = useCallback(
    (): void => {
      setBondInfo({});
      setSessionInfo({});
      setValidateInfo({});
      setStep(1);
      toggleVisible();
    },
    [toggleVisible]
  );

  return (
    <>
      <Button
        icon='plus'
        isDisabled={isDisabled}
        key='new-validator'
        label={t('Validator')}
        onClick={_toggle}
      />
      {isVisible && (
        <Modal
          header={t('Setup Validator {{step}}/{{NUM_STEPS}}', {
            replace: {
              NUM_STEPS,
              step
            }
          })}
          onClose={_toggle}
          size='large'
        >
          <Modal.Content>
            {step === 1 && (
              <BondPartial
                minValidatorBond={targets.minValidatorBond}
                onChange={setBondInfo}
              />
            )}
            {controllerId && stashId && step === 2 && (
              <>
                <SessionKeyPartial
                  controllerId={controllerId}
                  onChange={setSessionInfo}
                  stashId={stashId}
                  withFocus
                />
                <ValidatePartial
                  controllerId={controllerId}
                  minCommission={minCommission}
                  onChange={setValidateInfo}
                  stashId={stashId}
                />
              </>
            )}
            <Modal.Columns>
              <BatchWarning />
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions>
            <Button
              icon='step-backward'
              isDisabled={step === 1}
              label={t('prev')}
              onClick={_prevStep}
            />
            {step === NUM_STEPS
              ? (
                <TxButton
                  accountId={stashId}
                  icon='sign-in-alt'
                  isDisabled={!bondTx || !sessionTx || !validateTx}
                  label={t('Bond & Validate')}
                  onStart={_toggle}
                  params={[
                    controllerId === stashId
                      ? [bondTx, sessionTx, validateTx]
                      : [bondTx, sessionTx, validateTx, controllerTx]
                  ]}
                  tx={api.tx.utility.batchAll || api.tx.utility.batch}
                />
              )
              : (
                <Button
                  icon='step-forward'
                  isDisabled={!bondTx}
                  label={t('next')}
                  onClick={_nextStep}
                />
              )}
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(NewValidator);
