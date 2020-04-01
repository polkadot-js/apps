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
import AccountSelector from './accountSelector';
// import SummaryBar from './SummaryBar';
import BondOrTransfer from './bondOrTransfer';
import {Available} from "@polkadot/react-query/index";
import { useOwnStashes } from '@polkadot/react-hooks';
import {Button, TxButton} from "@polkadot/react-components/index";
import TabsHeader from "@polkadot/app-staking/Nomination/tabsHeader";

const steps = ['create', 'transfer', 'bond', 'nominate'];

function Nomination (): React.ReactElement<Props> {
  const [controllerAccountId, setControllerAccountId] = useState<string | null>(null);
  const [senderId, setSenderId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [isCreateOpen, toggleCreate] = useToggle();
  const [validators, setValidators] = useState<string[]>([]);
  const { api } = useApi();
  const stakingOverview = useCall<DeriveStakingOverview>(api.derive.staking.overview, []);
  const ownStashes = useOwnStashes();
  const { t } = useTranslation();
  console.log('ownStashes', ownStashes);
  console.log('validators', validators);
  console.log('stakingOverview', stakingOverview);

  function onStatusChange() {

  }

  function balanceWrapper(text: string): React.ReactNode {
    return (
      <strong className='label'>{text}</strong>
    );
  }

  useEffect(() => {
    if (controllerAccountId) {
      if (!currentStep) {
        setCurrentStep(steps[1]);
      }
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

      <TabsHeader
        setCurrentStep={setCurrentStep}
        address={controllerAccountId}
        sender={senderId}
      />

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
