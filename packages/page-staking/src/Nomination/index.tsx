// Copyright 2017-2020 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// global app props
import { AppProps as Props } from '@polkadot/react-components/types';
import CreateModal from '@polkadot/app-accounts/Accounts/modals/Create';
import {useApi, useCall, useToggle} from '@polkadot/react-hooks/index';
import styled from 'styled-components';
// import {Button} from '@polkadot/react-components/index';
import {useTranslation} from '@polkadot/app-accounts/translate';

// external imports (including those found in the packages/*
// of this repo)
import React, { useState, useEffect } from 'react';
import { DeriveStakingOverview } from '@polkadot/api-derive/types';
// local imports and components
import AccountSelector from './AccountSelector';
// import SummaryBar from './SummaryBar';
import BondOrTransfer from './BondOrTransfer';
import {Available} from "@polkadot/react-query/index";
import { useOwnStashes } from '@polkadot/react-hooks';
import {Button, TxButton} from "@polkadot/react-components/index";

const steps = ['create', 'transfer', 'bond', 'nominate'];

function Nomination (): React.ReactElement<Props> {
  const [controllerAccountId, setControllerAccountId] = useState<string | null>(null);
  const [senderId, setSenderId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [isCreateOpen, toggleCreate] = useToggle();
  const [bondCompleted, setBondCompleted] = useState<boolean>(true);
  const [transferCompleted, setTransferCompleted] = useState<boolean>(true);
  const [nominationCompleted, setNominationCompleted] = useState<boolean>(false);
  const [validators, setValidators] = useState<string[]>([]);
  const { api } = useApi();
  const stakingOverview = useCall<DeriveStakingOverview>(api.derive.staking.overview, []);
  console.log('stakingOverview', stakingOverview);

  const ownStashes = useOwnStashes();
  console.log('ownStashes', ownStashes);
  console.log('validators', validators);
  console.log('controllerAccountId', controllerAccountId);
  const { t } = useTranslation();

  function getStepClass(stepName: string) {
    const className = ['step'];
    switch (stepName) {
      case steps[0]:
        className.push(controllerAccountId ? 'completed' : '');
        break;
      case steps[1]:
        break;
      case steps[2]:
        if (!controllerAccountId) {
          className.push('disabled');
        } else if (bondCompleted) {
          className.push('completed')
        }
        break;
      case steps[3]:
        if (!bondCompleted) {
          className.push('disabled');
        } else if (nominationCompleted) {
          className.push('completed')
        }
        break;
      default:
        break;
    }
    if (currentStep === stepName && className.indexOf('disabled') === -1) {
      className.push('active');
    }
    return className.join(' ');
  }

  function setCurrentValue(event: React.MouseEvent, id: string) {
    event.preventDefault();
    setCurrentStep(id);
  }

  function onStatusChange() {

  }

  function balanceWrapper(text: string): React.ReactNode {
    return (
      <strong className='label'>{text}</strong>
    );
  }

  useEffect(() => {
    if (!currentStep && controllerAccountId) {
      setCurrentStep(steps[1]);
    }
  }, [controllerAccountId]);

  // set validators list
  useEffect(() => {
    stakingOverview && setValidators(
      stakingOverview.validators.map((acc): string => acc.toString())
    );
  }, [stakingOverview]);

  // initial step
  useEffect(() => {
    setCurrentStep(steps[0]);
  }, []);

  console.log('controllerAccountId', controllerAccountId);

  return (
    // in all apps, the main wrapper is setup to allow the padding
    // and margins inside the application. (Just from a consistent pov)
    <main className='simple-nomination'>
      {/*<SummaryBar />*/}
      <div className="ui ordered top attached steps">

        <a onClick={event => setCurrentValue(event, steps[0])} className={getStepClass(steps[0])}>
          <div className="content">
            <div className="title">Controller account</div>
            <div className="description">Choose or create controller account, that needs for nomination process.</div>
          </div>
        </a>

        <a onClick={event => setCurrentValue(event, steps[1])} className={getStepClass(steps[1])}>
          <div className="content">
            <div className="title">Transfer funds to pay nomination fees</div>
            <div className="description">
              Controller needs a few funds to pay nomination fees
              {/*You can un-nominate at any time to unlock your funds.
              Keep in mind that the un-nomination is effective in the next era.*/}
            </div>
          </div>
        </a>

        <a onClick={event => setCurrentValue(event, steps[2])} className={getStepClass(steps[2])}>
          <div className="content">
            <div className="title">Bond coins</div>
            <div className="description">
              Bond coins to nomination controller account.
              {/* While your DOTs are staked by nominating a validator, they are 'locked' (bonded).
              You can receive new DOTs in your account but you cannot stake
              as validator or transfer DOTs away from your account. */}
            </div>
          </div>
        </a>

        <a onClick={event => setCurrentValue(event, steps[3])} className={getStepClass(steps[3])}>
          <div className="content">
            <div className="title">Start nomination</div>
            <div className="description">
              Nominate your funds to make profit
              {/*You can un-nominate at any time to unlock your funds.
              Keep in mind that the un-nomination is effective in the next era.*/}
            </div>
          </div>
        </a>

      </div>

      <div className="ui attached segment">
        {currentStep === steps[0] &&
        <>
            <Available label={balanceWrapper('Controller balance')} params={controllerAccountId} />
            <AccountSelector
                onChange={setControllerAccountId}
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
        {currentStep === steps[1] &&
        <>
            <Available label={balanceWrapper('Account balance')} params={senderId} />
            <BondOrTransfer
                transfer
                recipientId={controllerAccountId}
                senderId={senderId}
                setSenderId={setSenderId}
            />
        </>
        }
        {currentStep === steps[2] &&
        <>
            <Available label={balanceWrapper('Account balance')} params={senderId} />
            <BondOrTransfer
                recipientId={controllerAccountId}
                senderId={senderId}
                setSenderId={setSenderId}
            />
        </>
        }
        {currentStep === steps[3] && (
          <Button.Group>
            <TxButton
              accountId={controllerAccountId}
              isDisabled={!validators?.length}
              isPrimary
              params={[validators]}
              label={t('Nominate')}
              icon='hand paper outline'
              tx='staking.nominate'
            />
          </Button.Group>
        )}
      </div>
    </main>
  );
}

export default React.memo(styled(Nomination)`
  .steps {
     display: grid;
     grid-template-columns: 1fr 1fr 1fr 1fr;
  }
 
`);
