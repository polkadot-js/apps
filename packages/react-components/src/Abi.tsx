// Copyright 2017-2020 @canvas-ui/app-execute authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Abi as InkAbi } from '@canvas-ui/api-contract';
import { BareProps } from '@canvas-ui/react-components/types';

import React from 'react';
import styled from 'styled-components';
import { ELEV_3_CSS } from '@canvas-ui/react-components/styles/constants';
import { useToggle } from '@canvas-ui/react-hooks';

import Expander from './Expander';
import Messages from './Messages';
import { useTranslation } from './translate';

interface Props extends BareProps {
  abi: InkAbi;
  withConstructors?: boolean;
}

function Abi ({ abi, className, withConstructors = false }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isInfoOpen, toggleIsInfoOpen] = useToggle();
  const [isAbiOpen, toggleIsAbiOpen] = useToggle();
  const { contract: { authors, name, version } } = abi.project;

  return (
    <div className={className}>
      <Expander
        isOpen={isInfoOpen}
        onClick={toggleIsInfoOpen}
        summary={t<string>('Info')}
      >
        <div className='contract-info'>
          <div className='name'>{name.toString()}</div>
          <div className='details'>
            {t<string>('version')}
            {' '}
            {version.toString()}
            {' '}
            {t<string>('by')}
            {' '}
            {authors.map((author) => author.toString()).join(', ')}
          </div>
        </div>
      </Expander>
      <Expander
        isOpen={isAbiOpen}
        onClick={toggleIsAbiOpen}
        summary={t<string>('ABI')}
      >
        <Messages
          abi={abi}
          isLabelled={false}
          isRemovable={false}
          withConstructors={withConstructors}
        />
      </Expander>
    </div>
  );
}

export default styled(React.memo(Abi))`
  .contract-info {
    ${ELEV_3_CSS}
    padding: 0.5rem 1rem;
    margin-bottom: 1rem;
    width: 100%;

    .name {

    }

    .details {
      font-size: 0.8rem;
      color: var(--grey60);
    }
  }
`;
