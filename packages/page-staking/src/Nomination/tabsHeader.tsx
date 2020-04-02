import React from 'react';

interface Props {
  setCurrentStep: (id: string) => void;
  stepsState: string[];
  steps: string[];
}

function TabsHeader({ stepsState, setCurrentStep, steps }: Props): React.ReactElement<Props> {

  function setCurrentValue(event: React.MouseEvent, id: string) {
    event.preventDefault();
    setCurrentStep(id);
  }

  /* function getFees(bondedAddress, senderAddress) {
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
  } */

  return (
    <div className="ui ordered top attached steps">

      <a onClick={event => setCurrentValue(event, steps[0])} className={`step ${stepsState[0]}`}>
        <div className="content">
          <div className="title">Account</div>
          <div className="description">
            {/*Choose account with funds.*/}
          </div>
        </div>
      </a>

      <a onClick={event => setCurrentValue(event, steps[1])} className={`step ${stepsState[1]}`}>
        <div className="content">
          <div className="title">Controller</div>
          <div className="description">
            {/*Choose or create another account as controller.*/}
          </div>
        </div>
      </a>

      <a onClick={event => setCurrentValue(event, steps[2])} className={`step ${stepsState[2]}`}>
        <div className="content">
          <div className="title">Fees</div>
          <div className="description">
            {/*Controller needs a few funds to pay nomination fees*/}
            {/*You can un-nominate at any time to unlock your funds.
              Keep in mind that the un-nomination is effective in the next era.*/}
          </div>
        </div>
      </a>

      <a onClick={event => setCurrentValue(event, steps[3])} className={`step ${stepsState[3]}`}>
        <div className="content">
          <div className="title">Bond</div>
          <div className="description">
            {/*Bond coins to nomination controller account.*/}
            {/* While your DOTs are staked by nominating a validator, they are 'locked' (bonded).
              You can receive new DOTs in your account but you cannot stake
              as validator or transfer DOTs away from your account. */}
          </div>
        </div>
      </a>

      <a onClick={event => setCurrentValue(event, steps[4])} className={`step ${stepsState[4]}`}>
        <div className="content">
          <div className="title">Nomination</div>
          <div className="description">
            {/*Nominate your funds to make profit*/}
            {/*You can un-nominate at any time to unlock your funds.
              Keep in mind that the un-nomination is effective in the next era.*/}
          </div>
        </div>
      </a>

    </div>
  )
};

export default React.memo(TabsHeader);
