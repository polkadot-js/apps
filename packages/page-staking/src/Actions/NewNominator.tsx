// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SortedTargets } from '../types';
import type { BondInfo, NominateInfo } from './partials/types';

import React, { useCallback, useState } from 'react';

import { BatchWarning, Button, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';
import { isFunction } from '@polkadot/util';

import { useTranslation } from '../translate';
import BondPartial from './partials/Bond';
import NominatePartial from './partials/Nominate';

interface Props {
  isInElection?: boolean;
  targets: SortedTargets;
}

const EMPTY_NOMS: string[] = [];
const NUM_STEPS = 2;

function NewNominator ({ isInElection, targets }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [isVisible, toggleVisible] = useToggle();
  const [{ bondOwnTx, bondTx, controllerId, controllerTx, stashId }, setBondInfo] = useState<BondInfo>({});
  const [{ nominateTx }, setNominateInfo] = useState<NominateInfo>({});
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
      setNominateInfo({});
      setStep(1);
      toggleVisible();
    },
    [toggleVisible]
  );

  return (
    <>
      <Button
        icon='plus'
        isDisabled={isDisabled || !targets.validators?.length}
        key='new-nominator'
        label={t<string>('Nominator')}
        onClick={_toggle}
      />
      {isVisible && (
        <Modal
          header={t<string>('Setup Nominator {{step}}/{{NUM_STEPS}}', {
            replace: {
              NUM_STEPS,
              step
            }
          })}
          size='large'
        >
          <Modal.Content>
            {step === 1 && (
              <BondPartial
                isNominating
                minNominated={targets.minNominated}
                minNominatorBond={targets.minNominatorBond}
                onChange={setBondInfo}
              />
            )}
            {controllerId && stashId && step === 2 && (
              <NominatePartial
                controllerId={controllerId}
                nominating={EMPTY_NOMS}
                onChange={setNominateInfo}
                stashId={stashId}
                targets={targets}
              />
            )}
            <Modal.Columns>
              <BatchWarning />
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions onCancel={_toggle}>
            <Button
              icon='step-backward'
              isDisabled={step === 1}
              label={t<string>('prev')}
              onClick={_prevStep}
            />
            {step === NUM_STEPS
              ? (
                <TxButton
                  accountId={stashId}
                  icon='sign-in-alt'
                  isDisabled={!bondTx || !nominateTx || !stashId || !controllerId}
                  label={t<string>('Bond & Nominate')}
                  onStart={_toggle}
                  params={[
                    stashId === controllerId
                      ? [bondTx, nominateTx]
                      : [bondOwnTx, nominateTx, controllerTx]
                  ]}
                  tx={api.tx.utility.batchAll || api.tx.utility.batch}
                />
              )
              : (
                <Button
                  icon='step-forward'
                  isDisabled={!bondTx}
                  label={t<string>('next')}
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
