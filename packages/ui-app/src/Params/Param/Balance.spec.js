// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

import { shallow } from '../../../../../test/enzyme';
import InputNumber from '../../InputNumber';
import { Balance } from './Balance';

const mockT = (key, options) => (key);

describe('Balance', () => {
  let wrapper, defaultValue;

  beforeEach(() => {
    defaultValue = { value: '0' };
    wrapper = shallow(
      <Balance
        defaultValue={defaultValue}
        t={mockT}
      />, {}
    );
  });

  it('creates the element', () => {
    expect(wrapper).toHaveLength(1);
  });

  it('should display InputNumber component', () => {
    expect(wrapper.find(InputNumber)).toHaveLength(1);
  });
});
