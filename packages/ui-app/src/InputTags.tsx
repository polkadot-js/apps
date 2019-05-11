// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';

import Dropdown from './Dropdown';

type Props = BareProps & {
  allowAdd?: boolean,
  defaultValue?: Array<string>,
  value?: Array<string>
};

export default class InputTags extends React.PureComponent<Props> {
  render () {
    return null;
  }
}
