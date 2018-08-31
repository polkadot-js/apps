// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import React from 'react';
import { shallow } from '../../../test/enzyme';

import { Restorer } from './Restorer';

const mockT = (key, options) => (key);

describe('Restorer', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Restorer t={mockT} />, {});
  });

  it('creates the element', () => {
    expect(wrapper).toHaveLength(1);
  });

  it('should only display Upload Button when no current address in state', () => {
    wrapper.setProps({ accountAll: null });
    expect(wrapper.find('.accounts--Restorer-message').text()).toEqual('restorer.existing');
  });

  it('should display Upload Button when an address exists', () => {
    wrapper.setProps({ accountAll: ['5xx'] });
    expect(wrapper.find('.accounts--Restorer-message').text()).toEqual('restorer.existing');
  });
});
