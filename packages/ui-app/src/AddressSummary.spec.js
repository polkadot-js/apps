// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import React from 'react';
import { shallow } from '../../../test/enzyme';

import { AddressSummary } from './AddressSummary';

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
    wrapper.setProps({ address: '' });
    expect(wrapper.find('.accounts--DownloadButton')).toHaveLength(0);
  });
});
