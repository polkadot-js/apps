// Copyright 2017-2020 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import CreateModal from '@polkadot/app-accounts/Accounts/modals/Create';
import {useApi, useOwnStashes, useToggle} from '@polkadot/react-hooks/index';
import styled from 'styled-components';
import {useTranslation} from '@polkadot/app-accounts/translate';
import React, { useState, useEffect, useCallback } from 'react';
import { DeriveStakingOverview } from '@polkadot/api-derive/types';
import AccountSelector from './AccountSelector';
import ControllerAccountSelector from './ControllerAccountSelector';
import BondOrTransfer from './BondOrTransfer';
import {Available} from "@polkadot/react-query/index";
import {AddressInfo, Button, InputBalance, TxButton} from "@polkadot/react-components/index";
import TabsHeader from "@polkadot/app-staking/Nomination/TabsHeader";
import StashesTable from "@polkadot/app-staking/Nomination/StahesTable";
import {useBalanceClear, useFees, WholeFeesType} from "@polkadot/app-staking/Nomination/useBalance";
import { Balance } from '@polkadot/types/interfaces/runtime';
import BN from "bn.js";
import Summary from "@polkadot/app-staking/Nomination/summary";
import { formatBalance } from '@polkadot/util';

const steps = ['choose', 'create', 'transfer', 'bond'];
const stepInitialState = ['', 'disabled', 'disabled', 'disabled'];

interface Props {
  className?: string;
  isVisible: boolean;
  stakingOverview?: DeriveStakingOverview;
  next?: string[];
}

function Nomination ({ className, isVisible, stakingOverview, next }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const [currentStep, setCurrentStep] = useState<string>(steps[0]);
  const [alreadyHaveStashes, setAlreadyHaveStashes] = useState<boolean>(false);
  const [controllerAccountId, setControllerAccountId] = useState<string | null>(null);
  const [senderId, setSenderId] = useState<string | null>(null);
  const [stepsState, setStepsState] = useState<string[]>(stepInitialState);
  const [controllerAlreadyBonded, setControllerAlreadyBonded] = useState<boolean>(false);
  const [isCreateOpen, toggleCreate] = useToggle();
  const [validators, setValidators] = useState<string[]>([]);
  const { wholeFees, feesLoading } : WholeFeesType = useFees(controllerAccountId, senderId, validators);
  const [transferableAmount, setTransferableAmount] = useState<BN>(new BN(1));
  const [amountToBond, setAmountToBond] = useState<BN | undefined>();
  const [amount, setAmount] = useState<BN | undefined | null>(null);
  const controllerBalance: Balance | null = useBalanceClear(controllerAccountId);
  const accountBalance: Balance | null = useBalanceClear(senderId);
  const ownStashes = useOwnStashes();
  const { t } = useTranslation();
  // @todo - определиться, что это, stash increase / stash not increase / controller
  const destination = 2; // 2 means controller account
  const extrinsic = (amount && controllerAccountId)
    ? api.tx.staking.bond(controllerAccountId, amount, destination)
    : null;
  const existentialDeposit = api.consts.balances.existentialDeposit;

  function onStatusChange() {}

  function setStepsStateAction() {
    if (currentStep === steps[2]) {
      const newStepsState = [...stepsState];
      if (isBalanceEnough()) {
        newStepsState[2] = 'completed';
        newStepsState[3] = newStepsState[3] === 'disabled' ? '' : newStepsState[3];
        setCurrentStep('bond');
      } else {
        newStepsState[2] = '';
      }
      setStepsState(newStepsState);
    } else {
      const newStepsState = [...stepsState];
      newStepsState[3] = 'completed';
      newStepsState[4] = '';
      setStepsState(newStepsState);
    }
  }

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
    console.log('stepsState', stepsState, 'ind', ind + 1);
    return stepsState[ind + 1] === 'disabled';
  }

  function resetControllerInfo(accountId: string | null) {
    setControllerAlreadyBonded(false);
    setControllerAccountId(accountId);
  }

  function setAmountToTransfer() {
    const minAmount = new BN(0);
    // @todo - compare with account balance and throw error if more
    setTransferableAmount(
      minAmount
        .iadd(wholeFees)
        .iadd(wholeFees)
        .isub(controllerBalance || new BN(0))
    );
  }

  function calculateMaxPreFilledBalance() {
    if (accountBalance && wholeFees && !amountToBond) {
      // double wholeFees
      setAmountToBond(accountBalance.isub(wholeFees).isub(wholeFees).isub(existentialDeposit));
    }
    return 0;
  }

  function isBalanceEnough() {
    return (accountBalance
      && controllerBalance
      && existentialDeposit
      && wholeFees
      && accountBalance.cmp(existentialDeposit) === 1
      && controllerBalance.cmp(wholeFees) === 1)
  }

  const _onUpdateControllerState = useCallback(
    (controllerAlreadyBonded: boolean): void => {
      setControllerAlreadyBonded(controllerAlreadyBonded);
    },
    []
  );

  // set validators list
  useEffect(() => {
    // @todo - не больше 16
    stakingOverview && setValidators(
      stakingOverview.validators.map((acc): string => acc.toString())
    );
  }, [stakingOverview]);

  useEffect(() => {
    setStepsStateAction();
    if (!wholeFees) {
      return;
    }
    setAmountToTransfer();
    calculateMaxPreFilledBalance();
  }, [accountBalance, controllerBalance, wholeFees]);

  useEffect(() => {
    // since we already have stashes just open the 4th screen - nomination
    // setCurrentStep(steps[3]);
    // setAlreadyHaveStashes(true);
    // mark all steps as completed
    // setStepsState(['completed', 'completed', 'completed', 'completed']);
  }, [ownStashes]);

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

            {/*<div className="ui segment">
                <p>Please, select account have funds enough</p>
                <p>Funds will be locked for the Nomination duration and will remain locked for at least for one era after Nomination is stopped</p>
            </div>*/}
            <br />
            <h3>Select your account that holds funds:</h3>
            <br />
            <Available label={balanceWrapper('Your account balance')} params={senderId} />
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
            <br />
            <h3>Now you need to select or create Controller account. This is account that will manage your funds:</h3>
            <br />
            <Available label={balanceWrapper('Controller balance')} params={controllerAccountId} />
            <ControllerAccountSelector
                senderId={senderId}
                value={controllerAccountId}
                title={'controller account'}
                onChange={resetControllerInfo}
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
            <br />
            <h3>Now we will transfer some small amount from your account that holds funds to Controller so that it can pay transaction fees. Just click Next to proceed.</h3>
            <br />
            {/*<BondOrTransfer
                transfer
                recipientId={controllerAccountId}
                senderId={senderId}
                stepsState={stepsState}
                setStepsState={setStepsState}
                validators={validators}
                setCurrentStep={setCurrentStep}
            />*/}
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
            {/*<BondOrTransfer
                recipientId={controllerAccountId}
                senderId={senderId}
                stepsState={stepsState}
                setStepsState={setStepsState}
                validators={validators}
                controllerAlreadyBonded={controllerAlreadyBonded}
                setCurrentStep={setCurrentStep}
                alreadyHaveStashes={alreadyHaveStashes}
            />*/}
            <section>
                <h1>Bond</h1>
                <div className='ui--row'>
                    <div className='large'>
                      {/* The amount field will be pre-populated with maximum possible amount */}
                        <InputBalance
                            value={formatBalance(amountToBond, { withUnit: false })}
                            label={`amount to bond}`}
                            onChange={setAmount}
                        />
                    </div>
                    <Summary className='small'>Bond to controller account.
                        Bond fees and per-transaction fees apply and will be calculated upon submission.</Summary>
                </div>
            </section>
        </>
        }
        <Button.Group>
          <Button
            key='Back'
            label={'Back'}
            icon=''
            isDisabled={steps.indexOf(currentStep) === 0 || alreadyHaveStashes}
            onClick={goBack}
          />
          <div className="or" />
          {currentStep === steps[2] && !isBalanceEnough() && (
            <TxButton
              isDisabled={!wholeFees}
              accountId={senderId}
              icon='send'
              label='Next'
              params={[controllerAccountId, transferableAmount]}
              tx='balances.transfer'
              withSpinner
            />
          )}
          {currentStep === steps[3] && !controllerAlreadyBonded && (
            <TxButton
              accountId={senderId}
              isDisabled={controllerAlreadyBonded}
              isPrimary
              label={t('Bond')}
              icon='sign-in'
              extrinsic={extrinsic}
            />
          )}
          {currentStep === steps[3] && controllerAlreadyBonded && (
            <TxButton
              accountId={controllerAccountId}
              isDisabled={!validators?.length || !controllerAlreadyBonded}
              isPrimary
              params={[validators]}
              label={t('Nominate')}
              icon='hand paper outline'
              tx='staking.nominate'
            />
          )}
          {currentStep !== steps[3] && (currentStep !== steps[2] || isBalanceEnough()) && (
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
        {currentStep === steps[3] && (
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
