// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useMemo, useState } from 'react';

import { createNamedHook } from './createNamedHook.js';

type Result = [number, () => void, () => void, (step: number) => void];

function useStepperImpl (): Result {
  const [step, setStep] = useState(1);

  const nextStep = useCallback(
    () => setStep((step) => step + 1),
    []
  );

  const prevStep = useCallback(
    () => setStep((step) => step - 1),
    []
  );

  return useMemo(
    () => [step, nextStep, prevStep, setStep],
    [step, nextStep, prevStep, setStep]
  );
}

export const useStepper = createNamedHook('useStepper', useStepperImpl);
