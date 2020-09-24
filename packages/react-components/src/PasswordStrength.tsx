// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useTranslation } from '@polkadot/react-components/translate';
import React from 'react';
import styled from 'styled-components';
import strengthTester from 'owasp-password-strength-test';

const MAX_STRENGTH = 7; // equal to number of password tests in owasp strength tester

interface Props {
  alwaysVisible?: boolean;
  className?: string;
  value: string;
}

function calcStrength (password: string): number {
  strengthTester.config({
    allowPassphrases: true,
    maxLength: 128,
    minLength: 8,
    minPhraseLength: 20
  });
  const testResult = strengthTester.test(password);
  const passedTests = Math.max(0, testResult.passedTests.length - testResult.failedTests.length);

  return testResult.isPassphrase ? MAX_STRENGTH : passedTests;
}

function PasswordStrength ({ alwaysVisible = false, className = '', value }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const passwordStrength = calcStrength(value);
  const style = { width: `${passwordStrength * 100 / MAX_STRENGTH}%` };

  return (
    <div
      className={className}
      style={{ display: !alwaysVisible ? (passwordStrength ? 'flex' : 'none') : 'flex' }}
    >
      {t<string>('weak')}
      <div className='ui--Strength-bar'>
        <div
          className='ui--Strength-bar-highlighted'
          style={style}
        />
      </div>
      {t<string>('strong')}
    </div>
  );
}

export default React.memo(styled(PasswordStrength)`
  align-items: center;
  margin-top: 0.5rem;
  font-weight: 800;
  font-size: 10px;
  line-height: 14px;
  text-transform: uppercase;
  color: #8B8B8B;

  .ui--Strength-bar {
    position: relative;
    height: 0.6rem;
    width: 14rem;
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
`);
