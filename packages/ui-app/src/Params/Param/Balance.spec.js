// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import React from 'react';
import { mount } from '../../../../../test/enzyme';
import { Balance } from './Balance';

const mockT = (key, options) => (key);

describe('Balance', () => {
  let wrapper, defaultValue;

  beforeEach(() => {
    defaultValue = { value: '0' };
    wrapper = mount(<Balance t={mockT} defaultValue={defaultValue} />, {});
  });

  it('creates the element', () => {
    expect(wrapper).toHaveLength(1);
  });

  it('should display InputNumber component with no Notifications by default', () => {
    expect(wrapper.find('.ui--InputNumber')).toHaveLength(1);
    expect(wrapper.find('.ui--Notifications')).toHaveLength(0);
  });
});
