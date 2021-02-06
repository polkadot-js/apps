// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useState } from 'react';

type Result = [number, () => void, () => void, (step: number) => void];

export function useStepper (): Result {
  const [step, setStep] = useState(1);

  const nextStep = useCallback(
    () => setStep((step) => step + 1),
    []
  );

  const prevStep = useCallback(
    () => setStep((step) => step - 1),
    []
  );

  return [step, nextStep, prevStep, setStep];
}
