import {useState} from 'react';

export interface stepsInterface {
  currentStepsState: {
    currentStep: string | null,
    bondCompleted: boolean,
    nominationCompleted: boolean,
  },
  setCurrentStep: (_: string) => void,
  setBondCompleted: (_: boolean) => void,
  setNominationCompleted: (_: boolean) => void,
}

export function useSteps(initialValue: string): stepsInterface {
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [transferCompleted, setTransferCompleted] = useState<boolean>(true);
  const [bondCompleted, setBondCompleted] = useState<boolean>(false);
  const [nominationCompleted, setNominationCompleted] = useState<boolean>(false);
  return {
    currentStepsState: {
      currentStep,
      bondCompleted,
      nominationCompleted,
    },
    setCurrentStep,
    setBondCompleted,
    setNominationCompleted
  }
}
