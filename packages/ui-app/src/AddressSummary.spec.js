// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import React from 'react';
import { shallow } from '../../../test/enzyme';

import { AddressSummary } from './AddressSummary';
import DownloadButton from './DownloadButton';

const mockT = (key, options) => (key);

describe('AddressSummary', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<AddressSummary t={mockT} />, {});
  });

  it('creates the element', () => {
    expect(wrapper).toHaveLength(1);
  });

  it('should not display Download Button when no current address in state', () => {
    wrapper.setProps({ address: '', withDownloadButton: false });
    expect(wrapper.find(DownloadButton)).toHaveLength(0);
  });

  it.skip('should display Download Button when current pair has address in state', () => {
    wrapper.setState({ address: '5G2nJMC7RxpTNuiQdN12zz8jZb1wGt3HozLqumZ1PFEDNNe8', withDownloadButton: false });
    expect(wrapper.find(DownloadButton)).toHaveLength(1);
  });
});