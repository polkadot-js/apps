// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import React from 'react';
import { shallow } from '../../../test/enzyme';

import { Editor } from './Editor';
import UploadButton from './UploadButton';

const mockT = (key, options) => (key);

describe('Editor', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Editor t={mockT} />, {});
  });

  it('creates the element', () => {
    expect(wrapper).toHaveLength(1);
  });

  it('should only display Upload Button when no current address in state', () => {
    wrapper.setProps({ accountAll: null });
    wrapper.setState({ current: null });
    expect(wrapper.find(UploadButton)).toHaveLength(1);
  });

  it('should display Upload Button when current pair has address in state', () => {
    wrapper.setProps({ accountAll: ['5xx'] });
    wrapper.setState({ current: { address: jest.fn() } });
    expect(wrapper.find(UploadButton)).toHaveLength(1);
  });
});
