// Copyright 2017-2020 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import CreateModal from '@polkadot/app-accounts/Accounts/modals/Create';
import {useOwnStashes, useToggle} from '@polkadot/react-hooks/index';
import styled from 'styled-components';
import {useTranslation} from '@polkadot/app-accounts/translate';
import React, { useState, useEffect, useCallback } from 'react';
import { DeriveStakingOverview } from '@polkadot/api-derive/types';
import AccountSelector from './AccountSelector';
import ControllerAccountSelector from './ControllerAccountSelector';
import BondOrTransfer from './BondOrTransfer';
import {Available} from "@polkadot/react-query/index";
import {AddressInfo, Button, TxButton} from "@polkadot/react-components/index";
import TabsHeader from "@polkadot/app-staking/Nomination/TabsHeader";
import StashesTable from "@polkadot/app-staking/Nomination/StahesTable";

const steps = ['choose', 'create', 'transfer', 'bond'];
const stepInitialState = ['', 'disabled', 'disabled', 'disabled'];

interface Props {
  className?: string;
  isVisible: boolean;
  stakingOverview?: DeriveStakingOverview;
  next?: string[];
}

function Nomination ({ className, isVisible, stakingOverview, next }: Props): React.ReactElement<Props> {
  const [currentStep, setCurrentStep] = useState<string>(steps[0]);
  const [controllerAccountId, setControllerAccountId] = useState<string | null>(null);
  const [senderId, setSenderId] = useState<string | null>(null);
  const [stepsState, setStepsState] = useState<string[]>(stepInitialState);
  const [controllerAlreadyBonded, setControllerAlreadyBonded] = useState<boolean>(false);
  const [isCreateOpen, toggleCreate] = useToggle();
  const [validators, setValidators] = useState<string[]>([]);
  const ownStashes = useOwnStashes();
  const { t } = useTranslation();

  function onStatusChange() {}

  function balanceWrapper(text: string): React.ReactNode {
    return (
      <strong className='label'>{text}</strong>
    );
  }

  function goBack() {
    const ind = steps.indexOf(currentStep);
    setCurrentStep(steps[ind - 1]);
  }

  function goNext() {
    const ind = steps.indexOf(currentStep);
    if (ind < 3) {
      setCurrentStep(steps[ind + 1]);
    }
  }

  function disableNext() {
    const ind = steps.indexOf(currentStep);
    return stepsState[ind + 1] === 'disabled';
  }

  // set validators list
  useEffect(() => {
    // @todo - не больше 16
    stakingOverview && setValidators(
      stakingOverview.validators.map((acc): string => acc.toString())
    );
  }, [stakingOverview]);

  const _onUpdateControllerState = useCallback(
    (controllerAlreadyBonded: boolean): void => {
      console.log('_onUpdateControllerState', controllerAlreadyBonded);
      setControllerAlreadyBonded(controllerAlreadyBonded)
    },
    []
  );

  console.log('controllerAlreadyBonded', controllerAlreadyBonded);
  // @ts-ignore
  return (
    // in all apps, the main wrapper is setup to allow the padding
    // and margins inside the application. (Just from a consistent pov)
    <main className={`${className} ${!isVisible ? 'staking--hidden' : ''} simple-nominatio`}>
      {/*<SummaryBar />*/}
      <TabsHeader
        setCurrentStep={setCurrentStep}
        stepsState={stepsState}
        steps={steps}
        currentStep={currentStep}
      />
      <div className="ui attached segment">
        {currentStep === steps[0] &&
        <>
            <Available label={balanceWrapper('Your account balance')} params={senderId} />
            {/*<div className="ui segment">
                <p>Please, select account have funds enough</p>
                <p>Funds will be locked for the Nomination duration and will remain locked for at least for one era after Nomination is stopped</p>
            </div>*/}
            <AccountSelector
                value={senderId}
                title={'Your account'}
                onChange={setSenderId}
                stepsState={stepsState}
                setStepsState={setStepsState}
            />
        </>
        }
        {currentStep === steps[1] &&
        <>
            <Available label={balanceWrapper('Controller balance')} params={controllerAccountId} />
            <ControllerAccountSelector
                senderId={senderId}
                value={controllerAccountId}
                title={'controller account'}
                onChange={setControllerAccountId}
                stepsState={stepsState}
                setStepsState={setStepsState}
                toggleCreate={toggleCreate}
            />
            {isCreateOpen && (
              <CreateModal
                onClose={toggleCreate}
                onStatusChange={onStatusChange}
              />
            )}
        </>
        }
        {currentStep === steps[2] &&
        <>
            <Available label={balanceWrapper('Account balance')} params={senderId} />
            <br />
            <Available label={balanceWrapper('Controller balance')} params={controllerAccountId} />
            <BondOrTransfer
                transfer
                recipientId={controllerAccountId}
                senderId={senderId}
                stepsState={stepsState}
                setStepsState={setStepsState}
                validators={validators}
            />
        </>
        }
        {currentStep === steps[3] &&
        <>
            {/* <Available label={balanceWrapper('Account balance')} params={senderId} />
            <br />
            <Available label={balanceWrapper('Controller balance')} params={controllerAccountId} /> */}
            <AddressInfo
                address={senderId}
                withBalance={{
                  available: true,
                  bonded: true,
                  free: true,
                  redeemable: true,
                  unlocking: true
                }}
                withRewardDestination
            />
            <BondOrTransfer
                recipientId={controllerAccountId}
                senderId={senderId}
                stepsState={stepsState}
                setStepsState={setStepsState}
                validators={validators}
            />
        </>
        }
        <Button.Group>
          <Button
            key='Back'
            label={'Back'}
            icon=''
            isDisabled={steps.indexOf(currentStep) === 0}
            onClick={goBack}
          />
          <div className="or" />
          {currentStep === steps[3] && (
            <TxButton
              accountId={controllerAccountId}
              isDisabled={!validators?.length}
              isPrimary
              params={[validators]}
              label={t('Nominate')}
              icon='hand paper outline'
              tx='staking.nominate'
            />
          )}
          {currentStep !== steps[3] && (
            <Button
              className="primary"
              key='Next'
              label={'Next'}
              icon=''
              isDisabled={disableNext()}
              onClick={goNext}
            />
          )}
        </Button.Group>
        {controllerAccountId && (
          <StashesTable
            onUpdateControllerState={_onUpdateControllerState}
            ownStashes={ownStashes}
            controllerAccountId={controllerAccountId}
            stakingOverview={stakingOverview}
            isVisible={isVisible}
            next={next}
          />
        )}
      </div>
    </main>
  );
}

export default React.memo(styled(Nomination)`  
  .ui.attached.steps {
     display: grid;
     grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`);
