import BN from 'bn.js';
import React, {useEffect, useState} from 'react';
import { DeriveBalancesAll, DeriveStakingAccount } from '@polkadot/api-derive/types';
import {withCalls, withMulti} from '@polkadot/react-api/hoc';
import {useApi} from '@polkadot/react-hooks/index';
import { formatBalance } from '@polkadot/util';

interface Props {
  setCurrentStep: (id: string) => void;
  address?: string | null;
  sender?: string | null;
  currentStep?: string | null;
  stakingInfo?: DeriveStakingAccount;
  balancesAll?: DeriveBalancesAll;
}

export const steps = ['create', 'transfer', 'bond', 'nominate'];

function TabsHeader({ address, sender, currentStep, setCurrentStep, stakingInfo, balancesAll }: Props): React.ReactElement<Props> {
  const [bondCompleted, setBondCompleted] = useState<boolean>(true);
  const [transferCompleted, setTransferCompleted] = useState<boolean>(true);
  const [nominationCompleted, setNominationCompleted] = useState<boolean>(true);
  const { api } = useApi();

  console.log('TabsHeader', stakingInfo, balancesAll?.availableBalance);
  function getStepClass(stepName: string) {
    const className = ['step'];
    switch (stepName) {
      // we need two accounts and 'n' size of transferable funds on main account balance
      case steps[0]:
        if (address && sender) {
          className.push(address ? 'completed' : '');
        }
        break;
      case steps[1]:
        break;
      case steps[2]:
        if (!address) {
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

  function getFees(bondedAddress, senderAddress) {
    const si = formatBalance.findSi('-');
    const TEN = new BN(10);
    const basePower = formatBalance.getDefaults().decimals;
    const siPower = new BN(basePower + si.power);
    const amount = new BN(1000).mul(TEN.pow(siPower));
    api.tx.staking.bond(bondedAddress, amount, 2)
      .paymentInfo(senderAddress).then(bondPaimentInfo => {
      console.log('bondPaymentInfo', formatBalance(bondPaimentInfo.partialFee));
      });
    api.tx.balances.transfer(bondedAddress, amount)
      .paymentInfo(senderAddress).then(paymentInfo => {
        console.log('paymentInfo', formatBalance(paymentInfo.partialFee));
    });
  }

  useEffect(() => {
    if (address && sender) {
      getFees(address, sender);
    }
  }, [address, sender]);

  return (
    <div className="ui ordered top attached steps">
      <a onClick={event => setCurrentValue(event, steps[0])} className={getStepClass(steps[0])}>
        <div className="content">
          <div className="title">Accounts</div>
          <div className="description">We need 2 accounts for nomination process. Choose or create them.</div>
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
  )
};

export default withMulti(
  TabsHeader,
  withCalls<Props>(
    ['derive.balances.all', {
      paramName: 'address',
      propName: 'balancesAll',
    }],
    ['derive.staking.account', {
      paramName: 'address',
      propName: 'stakingInfo',
    }]
  )
);
