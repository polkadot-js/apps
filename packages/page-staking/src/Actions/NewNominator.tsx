// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BondInfo, NominateInfo } from './partials/types';
import { SortedTargets } from '../types';

import React, { useCallback, useState } from 'react';
import { Button, Modal, TxButton } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import BondPartial from './partials/Bond';
import NominatePartial from './partials/Nominate';

interface Props {
  isInElection?: boolean;
  next?: string[];
  targets?: SortedTargets;
  validators?: string[];
}

const EMPTY_NOMS: string[] = [];
const NUM_STEPS = 2;

function NewNominator ({ isInElection, next, targets, validators }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isVisible, toggleVisible] = useToggle();
  const [{ bondOwnTx, bondTx, controllerId, controllerTx, stashId }, setBondInfo] = useState<BondInfo>({});
  const [{ nominateTx }, setNominateInfo] = useState<NominateInfo>({});
  const [step, setStep] = useState(1);

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
      setNominateInfo({});
      setStep(1);
      toggleVisible();
    },
    [toggleVisible]
  );

  return (
    <>
      <Button
        icon='add'
        isDisabled={isInElection}
        key='new-nominator'
        label={t('Nominator')}
        onClick={_toggle}
      />
      {isVisible && (
        <Modal
          header={t('Setup Nominator {{step}}/{{NUM_STEPS}}', {
            replace: {
              NUM_STEPS,
              step
            }
          })}
          size='large'
        >
          <Modal.Content>
            {step === 1 && (
              <BondPartial onChange={setBondInfo} />
            )}
            {controllerId && stashId && step === 2 && (
              <NominatePartial
                controllerId={controllerId}
                next={next}
                nominating={EMPTY_NOMS}
                onChange={setNominateInfo}
                stashId={stashId}
                targets={targets}
                validators={validators}
              />
            )}
          </Modal.Content>
          <Modal.Actions onCancel={_toggle}>
            <Button
              icon='step backward'
              isDisabled={step === 1}
              label={t('prev')}
              onClick={_prevStep}
            />
            {step === NUM_STEPS
              ? (
                <TxButton
                  accountId={stashId}
                  icon='sign-in'
                  isDisabled={!bondTx || !nominateTx || !stashId || !controllerId}
                  isPrimary
                  label={t('Bond & Nominate')}
                  onStart={_toggle}
                  params={[
                    stashId === controllerId
                      ? [bondTx, nominateTx]
                      : [bondOwnTx, nominateTx, controllerTx]
                  ]}
                  tx='utility.batch'
                />
              )
              : (
                <Button
                  icon='step forward'
                  isDisabled={!bondTx}
                  isPrimary
                  label={t('next')}
                  onClick={_nextStep}
                />
              )
            }
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(NewNominator);
