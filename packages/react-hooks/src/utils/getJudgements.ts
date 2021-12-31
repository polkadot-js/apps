// Copyright 2017-2022 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveAccountRegistration } from '@polkadot/api-derive/types';
import type { DisplayedJudgement } from '@polkadot/react-components/types';
import type { SortedJudgements } from '@polkadot/react-components/util/types';
import type { RegistrationJudgement } from '@polkadot/types/interfaces';

function extractIndexes (registrars: RegistrationJudgement[]) {
  return registrars.map((judgement) => judgement[0]);
}

export function getJudgements (identity: DeriveAccountRegistration | undefined): SortedJudgements {
  if (!identity) return [];

  const judgements = groupJudgements(identity.judgements);

  const result = [];

  for (const name in judgements) {
    const judgementName = name as DisplayedJudgement;

    if (judgements[judgementName].length !== 0) {
      result.push({ judgementName, registrarsIndexes: extractIndexes(judgements[judgementName]) });
    }
  }

  return result;
}

export function groupJudgements (judgements: RegistrationJudgement[]): Record<DisplayedJudgement, RegistrationJudgement[]> {
  const consideredJudgements = filterConsideredJudgements(judgements);
  const knownGoodJudgements = filterKnownGood(consideredJudgements);
  const reasonableJudgements = filterReasonable(consideredJudgements);
  const erroneousJudgements = filterErroneous(consideredJudgements);
  const lowQualityJudgements = filterLowQuality(consideredJudgements);

  return {
    Erroneous: erroneousJudgements,
    'Known good': knownGoodJudgements,
    'Low quality': lowQualityJudgements,
    Reasonable: reasonableJudgements
  };
}

const filterConsideredJudgements = (judgements: RegistrationJudgement[]): RegistrationJudgement[] => {
  return judgements.filter(([, judgement]) => !judgement.isFeePaid);
};

const filterKnownGood = (judgements: RegistrationJudgement[]): RegistrationJudgement[] => {
  return judgements.filter(([, judgement]) => judgement.isKnownGood);
};

const filterReasonable = (judgements: RegistrationJudgement[]): RegistrationJudgement[] => {
  return judgements.filter(([, judgement]) => judgement.isReasonable);
};

const filterErroneous = (judgements: RegistrationJudgement[]): RegistrationJudgement[] => {
  return judgements.filter(([, judgement]) => judgement.isErroneous);
};

const filterLowQuality = (judgements: RegistrationJudgement[]): RegistrationJudgement[] => {
  return judgements.filter(([, judgement]) => judgement.isLowQuality);
};
