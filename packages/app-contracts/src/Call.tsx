// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ComponentProps } from './types';

import React from 'react';

import translate from './translate';

type Props = ComponentProps & I18nProps;

class Call extends React.PureComponent<Props> {
  render () {
    return 'call';
  };
}

export default translate(Call);
