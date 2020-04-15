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

  return (
    <div className="ui ordered top attached steps">

      <a onClick={event => setCurrentValue(event, steps[0])} className={`step ${stepsState[0]} ${currentStep === steps[0] ? 'active' : ''}`}>
        <div className="content">
          <div className="title">Account</div>
        </div>
      </a>

      <a onClick={event => setCurrentValue(event, steps[1])} className={`step ${stepsState[1]} ${currentStep === steps[1] ? 'active' : ''}`}>
        <div className="content">
          <div className="title">Controller</div>
        </div>
      </a>

      <a onClick={event => setCurrentValue(event, steps[2])} className={`step ${stepsState[2]} ${currentStep === steps[2] ? 'active' : ''}`}>
        <div className="content">
          <div className="title">Bond</div>
        </div>
      </a>

      <a onClick={event => setCurrentValue(event, steps[3])} className={`step ${stepsState[3]} ${currentStep === steps[3] ? 'active' : ''}`}>
        <div className="content">
          <div className="title">Nominate</div>
        </div>
      </a>

    </div>
  )
};

export default React.memo(TabsHeader);
