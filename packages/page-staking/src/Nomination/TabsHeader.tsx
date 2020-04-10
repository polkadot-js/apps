import React from 'react';

interface Props {
  setCurrentStep: (id: string) => void;
  stepsState: string[];
  steps: string[];
  currentStep: string;
}

function TabsHeader({ stepsState, setCurrentStep, steps, currentStep }: Props): React.ReactElement<Props> {

  function setCurrentValue(event: React.MouseEvent, id: string) {
    event.preventDefault();
    setCurrentStep(id);
  }
  console.log('stepsState!!!', stepsState);
  return (
    <div className="ui ordered top attached steps">

      <a onClick={event => setCurrentValue(event, steps[0])} className={`step ${stepsState[0]} ${currentStep === steps[0] ? 'active' : ''}`}>
        <div className="content">
          <div className="title">Account</div>
          <div className="description">
            {/*Choose account with funds.*/}
          </div>
        </div>
      </a>

      <a onClick={event => setCurrentValue(event, steps[1])} className={`step ${stepsState[1]} ${currentStep === steps[1] ? 'active' : ''}`}>
        <div className="content">
          <div className="title">Controller</div>
          <div className="description">
            {/*Choose or create another account as controller.*/}
          </div>
        </div>
      </a>

      <a onClick={event => setCurrentValue(event, steps[2])} className={`step ${stepsState[2]} ${currentStep === steps[2] ? 'active' : ''}`}>
        <div className="content">
          <div className="title">Bond</div>
          <div className="description">
            {/*Controller needs a few funds to pay nomination fees*/}
            {/*You can un-nominate at any time to unlock your funds.
              Keep in mind that the un-nomination is effective in the next era.*/}
          </div>
        </div>
      </a>

      <a onClick={event => setCurrentValue(event, steps[3])} className={`step ${stepsState[3]} ${currentStep === steps[3] ? 'active' : ''}`}>
        <div className="content">
          <div className="title">Nominate</div>
          <div className="description">
            {/*Bond coins to nomination controller account.*/}
            {/* While your DOTs are staked by nominating a validator, they are 'locked' (bonded).
              You can receive new DOTs in your account but you cannot stake
              as validator or transfer DOTs away from your account. */}
          </div>
        </div>
      </a>

    </div>
  )
};

export default React.memo(TabsHeader);
