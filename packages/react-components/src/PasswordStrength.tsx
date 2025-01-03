// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import strengthTester from 'owasp-password-strength-test';
import React from 'react';

import { styled } from './styled.js';
import { useTranslation } from './translate.js';

const MAX_STRENGTH = 7; // equal to number of password tests in owasp strength tester

strengthTester.config({
  allowPassphrases: true,
  maxLength: 128,
  minLength: 8,
  minPhraseLength: 20
});

interface Props {
  className?: string;
  value: string;
}

function calcStrength (password: string): number {
  const testResult = strengthTester.test(password);
  const passedTests = Math.max(0, testResult.passedTests.length - testResult.failedTests.length);

  return testResult.isPassphrase ? MAX_STRENGTH : passedTests;
}

function PasswordStrength ({ className = '', value }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const passwordStrength = calcStrength(value);
  const style = { width: `${passwordStrength * 100 / MAX_STRENGTH}%` };

  return (
    <StyledDiv
      className={className}
      style={{ display: (value ? 'flex' : 'none') }}
    >
      {t('weak')}
      <div className='ui--Strength-bar'>
        <div
          className='ui--Strength-bar-highlighted'
          style={style}
        />
      </div>
      {t('strong')}
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  align-items: center;
  margin-top: 0.5rem;
  margin-left: 2rem;
  font-size: var(--font-size-base);
  text-transform: uppercase;
  color: var(--color-label);

  .ui--Strength-bar {
    position: relative;
    height: 0.6rem;
    width: 100%;
    margin: 0 10px;
    border: 1px solid #DFDFDF;
    border-radius: 0.15rem;
    background: #ECECEC;
  }

  .ui--Strength-bar-highlighted {
    position: absolute;
    top: -0.07rem;
    height: 0.6rem;
    width: 100%;
    border-radius: 0.15rem;
    background: linear-gradient(90.43deg, #FF8B00 0%, #FFBB50 112.75%);
  }
`;

export default React.memo(PasswordStrength);
