// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IconName } from '@fortawesome/fontawesome-svg-core';
import React from 'react';

import Icon from '../Icon';

interface Props {
  className?: string;
  icon: IconName;
  text: string;
}

function Section ({ icon, text }: Props): React.ReactElement<Props> {
  return (
    <div className='active-tab highlight--color'>
      <Icon icon={icon} />
      <span>{text}</span>
    </div>
  );
}

export default Section;
