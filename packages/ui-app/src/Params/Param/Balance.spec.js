// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import React from 'react';
import { mount } from '../../../../../test/enzyme';
import { Balance } from './Balance';

const mockT = (key, options) => (key);

describe('Balance', () => {
  let wrapper, divInputNumber, divNotifications, divNotificationsText, inputElementBalance, defaultValue;

  beforeEach(() => {
    defaultValue = { value: '0' };
    wrapper = mount(<Balance t={mockT} defaultValue={defaultValue} />, {});
    divInputNumber = wrapper.find('.ui--InputNumber');
    divNotifications = wrapper.find('.ui--Notifications');
    inputElementBalance = wrapper.find('.ui--InputNumber').find('.input').find('input');
  });

  it('creates the element', () => {
    expect(wrapper).toHaveLength(1);
  });

  it('should display InputNumber component with default value and no Notifications by default', () => {
    expect(inputElementBalance.instance().value).toBe('0');
    expect(divInputNumber).toHaveLength(1);
    expect(divNotifications).toHaveLength(0);
  });

  it('should display correct Info Notification in exponential notation when user inputs integer value', () => {
    inputElementBalance.instance().value = '1';
    inputElementBalance.simulate('change');
    divNotificationsText = wrapper.find('.ui--Notifications').find('div.message');
    expect(divNotificationsText.hasClass('info')).toBe(true);
    expect(divNotificationsText.text()).toEqual('1.00e+0');
  });

  it('should display correct Info Notification when user enters scientific notation value', () => {
    inputElementBalance.instance().value = '3.4e38';
    inputElementBalance.simulate('change');
    divNotificationsText = wrapper.find('.ui--Notifications').find('div.message');
    expect(divNotificationsText.hasClass('info')).toBe(true);
    expect(divNotificationsText.text()).toEqual('340000000000000000000000000000000000000');
  });

  it('should display correct Info Notification when user enters exponential notation value', () => {
    inputElementBalance.instance().value = '3.4e+38';
    inputElementBalance.simulate('change');
    divNotificationsText = wrapper.find('.ui--Notifications').find('div.message');
    expect(divNotificationsText.hasClass('info')).toBe(true);
    expect(divNotificationsText.text()).toEqual('340000000000000000000000000000000000000');
  });

  it('should display correct i18n Warning Notification when user enters zero', () => {
    inputElementBalance.instance().value = '0';
    inputElementBalance.simulate('change');
    divNotificationsText = wrapper.find('.ui--Notifications').find('div.message');
    expect(divNotificationsText.hasClass('warning')).toBe(true);
    expect(divNotificationsText.text()).toEqual('balance.warn.zero');
  });

  it('should display correct i18n Error Notification when user inputs invalid value of just scientific notation symbol', () => {
    inputElementBalance.instance().value = 'e';
    inputElementBalance.simulate('change');
    divNotificationsText = wrapper.find('.ui--Notifications').find('div.message');
    expect(divNotificationsText.hasClass('error')).toBe(true);
    expect(divNotificationsText.text()).toEqual('balance.error.format');
  });

  it('should display correct i18n Error Notification when user resets the value', () => {
    inputElementBalance.instance().value = '';
    inputElementBalance.simulate('change');
    divNotificationsText = wrapper.find('.ui--Notifications').find('div.message');
    expect(divNotificationsText.hasClass('error')).toBe(true);
    expect(divNotificationsText.text()).toEqual('balance.error.format');
  });

  it('should display correct i18n Error Notification when user enters long decimal value without scientific or exponential symbol', () => {
    inputElementBalance.instance().value = '0.1111111111111111111111111111111111111';
    inputElementBalance.simulate('change');
    divNotificationsText = wrapper.find('.ui--Notifications').find('div.message');
    expect(divNotificationsText.hasClass('error')).toBe(true);
    expect(divNotificationsText.text()).toEqual('balance.error.decimal');
  });
});
