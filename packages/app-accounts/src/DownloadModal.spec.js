// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import React from 'react';
import { shallow } from '../../../test/enzyme';

import { DownloadModal } from './DownloadModal';

const mockT = (key, options) => (key);

describe('DownloadModal', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<DownloadModal t={mockT} />, {});
  });

  it('creates the element', () => {
    expect(wrapper).toHaveLength(1);
  });

  it('should only render Modal when prop values set for address and password modal toggler', () => {
    wrapper.setProps({ address: '5G2nJMC7RxpTNuiQdN12zz8jZb1wGt3HozLqumZ1PFEDNNe8', isPasswordModalOpen: true });
    expect(wrapper.find('.accounts--Address-modal')).toHaveLength(1);
  });
});
