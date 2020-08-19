import BN from 'bn.js';
import toFormattedBalance from '../src/util/toFormattedBalance';
import { decimalToFixedWidth } from '../src/util/toFormattedBalance';

describe('toFormattedBalance', () => {
  describe('with default settings', () => {
    test('when value length is smaller than default fixed point(4)', () => {
      const stubBalanceValue = new BN('123');
      const result = toFormattedBalance({ value: stubBalanceValue });
      expect(result).toEqual('0.1230');
    });

    test('when value length is larger than default fixed point(4)', () => {
      const stubBalanceValue = new BN('123456789');
      const result = toFormattedBalance({ value: stubBalanceValue });
      expect(result).toEqual('12,345.6789');
    });

    test('when value length is equal to default fixed point(4)', () => {
      const stubBalanceValue = new BN('1000');
      const result = toFormattedBalance({ value: stubBalanceValue });
      expect(result).toEqual('0.1000');
    });

    test('when value is a big number', () => {
      const stubBalanceValue = new BN(
        '123456789012345678901234567890123456789012345678901234567890'
      );
      const result = toFormattedBalance({ value: stubBalanceValue });
      expect(result).toEqual(
        '12,345,678,901,234,567,890,123,456,789,012,345,678,901,234,567,890,123,456.7890'
      );
    });
  });

  describe('with assigned fixed point', () => {
    test('when balance value length is smaller than assigned fixed point(2)', () => {
      const stubBalanceValue = new BN('123');
      const result = toFormattedBalance({
        value: stubBalanceValue,
        fixedPoint: 2
      });
      expect(result).toEqual('1.23');
    });

    test('when balance value length is larger than assigned fixed point(2)', () => {
      const stubBalanceValue = new BN('123456789');
      const result = toFormattedBalance({
        value: stubBalanceValue,
        fixedPoint: 2
      });
      expect(result).toEqual('1,234,567.89');
    });
  });

  describe('with assigned balance unit', () => {
    test('when balance unit is set with a small balance value', () => {
      const stubBalanceValue = new BN('0');
      const result = toFormattedBalance({
        value: stubBalanceValue,
        unit: 'CPAY'
      });
      expect(result).toEqual('0.0000 CPAY');
    });

    test('when balance unit is set with a large balance value', () => {
      const stubBalanceValue = new BN('123456789');
      const result = toFormattedBalance({
        value: stubBalanceValue,
        unit: 'CENNZ'
      });
      expect(result).toEqual('12,345.6789 CENNZ');
    });
  });

  describe('with decimal places', () => {
    test('when balance has exact decimal places provided', () => {
      const stubBalanceValue = '12345.6789';
      const result = toFormattedBalance({
        value: stubBalanceValue,
        unit: 'CENNZ'
      });
      expect(result).toEqual('12,345.6789 CENNZ');
    });

    test('when balance has too many decimal places provided', () => {
      const stubBalanceValue = '12345.11114444';
      const result = toFormattedBalance({
        value: stubBalanceValue,
        unit: 'CENNZ'
      });
      expect(result).toEqual('12,345.1111 CENNZ');
    });

    test('when balance has few decimal places provided', () => {
      const stubBalanceValue = '12345.24';
      const result = toFormattedBalance({
        value: stubBalanceValue,
        unit: 'CENNZ'
      });
      expect(result).toEqual('12,345.2400 CENNZ');
    });

    test('when balance has decimal point with no digits', () => {
      const stubBalanceValue = '12345.';
      const result = toFormattedBalance({
        value: stubBalanceValue,
        unit: 'CENNZ'
      });
      expect(result).toEqual('12,345.0000 CENNZ');
    });

    test('when value has decimal point with no digits', () => {
      const stubBalanceValue = '12345.';
      const result = decimalToFixedWidth({
        value: stubBalanceValue,
        fixedPoint: 4,
      });
      expect(result).toEqual('123450000');
    });

    test('when value has decimal point with few digits', () => {
      const stubBalanceValue = '12345.22';
      const result = decimalToFixedWidth({
        value: stubBalanceValue,
        fixedPoint: 4,
      });
      expect(result).toEqual('123452200');
    });

    test('when value has decimal point with exact digits', () => {
      const stubBalanceValue = '12345.2234';
      const result = decimalToFixedWidth({
        value: stubBalanceValue,
        fixedPoint: 4,
      });
      expect(result).toEqual('123452234');
    });

    test('when value has decimal point with too many digits', () => {
      const stubBalanceValue = '12345.22345555';
      const result = decimalToFixedWidth({
        value: stubBalanceValue,
        fixedPoint: 4,
      });
      expect(result).toEqual('123452234');
    });

    test('when value has leading 0 and decimal point', () => {
      const stubBalanceValue = '0.010';
      const result = decimalToFixedWidth({
        value: stubBalanceValue,
        fixedPoint: 4,
      });
      expect(result).toEqual('100');
    });

    test('when value has leading 0 and exact decimal points', () => {
      const stubBalanceValue = '0.1234';
      const result = toFormattedBalance({
        value: stubBalanceValue,
      });
      expect(result).toEqual('0.1234');
    });

  });
});
