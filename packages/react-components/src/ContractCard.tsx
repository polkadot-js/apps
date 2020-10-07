// Copyright 2017-2020 @canvas-ui/app-execute authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PromiseContract as Contract } from '@polkadot/api-contract';
import { ComponentProps } from '@canvas-ui/apps/types';

import React, { useCallback } from 'react';
import styled from 'styled-components';
import { ELEV_1_CSS } from '@canvas-ui/react-components/styles/constants';

import Abi from './Abi';
import Button from './Button';
import ContractForget from './ContractForget';
import ContractInfo from './ContractInfo';
import { useTranslation } from './translate';

interface Props extends ComponentProps {
  contract: Contract;
}

function ContractCard ({ className, contract: { abi, address }, navigateTo }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const onExecute = useCallback(
    (): void => {
      navigateTo.executeCall(address.toString())();
    },
    [address, navigateTo]
  );

  return (
    <article className={className}>
      <ContractInfo
        address={address.toString()}
        isEditable
      >
        <Abi abi={abi} />
      </ContractInfo>
      <div className='footer'>
        <Button.Group>
          <ContractForget address={address.toString()} />
          <Button
            isPrimary
            label={t<string>('Execute')}
            onClick={onExecute}
          />
        </Button.Group>
      </div>
    </article>
  );
}

export default styled(React.memo(ContractCard))`
  ${ELEV_1_CSS}

  .footer {
    display: flex;
    justify-content: flex-end;
    margin: 1rem 0 0;
    padding: 1rem 0 0;
    border-top: 1px solid var(--grey40);
  }
`;
