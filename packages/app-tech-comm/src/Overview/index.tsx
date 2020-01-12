// Copyright 2017-2020 @polkadot/app-tech-comm authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { ComponentProps } from '../types';

import React from 'react';

import translate from '../translate';
import Members from './Members';
import Summary from './Summary';

interface Props extends I18nProps, ComponentProps {}

function Overview ({ className, members, proposals }: Props): React.ReactElement<Props> {
  return (
    <div className={className}>
      <Summary
        members={members}
        proposals={proposals}
      />
      <Members members={members} />
    </div>
  );
}

export default translate(Overview);
