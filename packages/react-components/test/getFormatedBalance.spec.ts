import BN from 'bn.js';
import getFormattedBalance from '../src/util/getFormatedBalance';
import { formatBalance } from '@polkadot/util';

describe('get formattedBalance with decimals as per set in formatBalances default setting', () => {
  formatBalance.setDefaults({
    decimals: 4,
    unit: 'CPAY'
  });
  const TESTVAL = new BN('123456789000');
  const TESTVAL2 = new BN('99878888865439');
  const TESTVAL3 = new BN('123');
  it('formats 123,456,789,000 (decimals=4)', () => {
    const showUnit = false;
    expect(getFormattedBalance(TESTVAL, showUnit)).toEqual('12,345,678.9000');
  });
  it('formats 123,456,789,000 (decimals=4, with unit CPAY)', () => {
    const showUnit = true;
    expect(getFormattedBalance(TESTVAL, showUnit)).toEqual('12,345,678.9000 CPAY');
  });
  it('formats 99878888865439 (decimals=4, with unit CPAY)', () => {
    const showUnit = true;
    expect(getFormattedBalance(TESTVAL2, showUnit)).toEqual('9,987,888,886.5439 CPAY');
  });
  it('formats 99878888865439 (decimals=6, with unit CENNZ)', () => {
    const showUnit = true;
    formatBalance.setDefaults({
      decimals: 6,
      unit: 'CENNZ'
    });
    expect(getFormattedBalance(TESTVAL2, showUnit)).toEqual('99,878,888.865439 CENNZ');
  });
  describe('test cases when values <= the decimal places', () =>
  {
    it('formats 123 (decimals=5, with unit XYZ)', () => {
      const showUnit = true;
      formatBalance.setDefaults({
        decimals: 5,
        unit: 'XYZ'
      });
      expect(getFormattedBalance(TESTVAL3, showUnit)).toEqual('0.00123 XYZ');
    });
    it('formats 123 (decimals=3, with unit XYZ)', () => {
      const showUnit = true;
      formatBalance.setDefaults({
        decimals: 3,
        unit: 'XYZ'
      });
      expect(getFormattedBalance(TESTVAL3, showUnit)).toEqual('0.123 XYZ');
    });
    it('formats 1 (decimals=2, with no unit)', () => {
      const value = new BN(1);
      const showUnit = false;
      formatBalance.setDefaults({
        decimals: 2,
        unit: 'XYZ'
      });
      expect(getFormattedBalance(value, showUnit)).toEqual('0.01');
    });
    it('formats 12 (decimals=4, with no unit)', () => {
      const value = new BN(12);
      const showUnit = false;
      formatBalance.setDefaults({
        decimals: 4,
        unit: 'XYZ'
      });
      expect(getFormattedBalance(value, showUnit)).toEqual('0.0012');
    });
    it('formats 1234 (decimals=4, with no unit)', () => {
      const value = new BN(1234);
      const showUnit = false;
      formatBalance.setDefaults({
        decimals: 4,
        unit: 'XYZ'
      });
      expect(getFormattedBalance(value, showUnit)).toEqual('0.1234');
    });
  });
});
