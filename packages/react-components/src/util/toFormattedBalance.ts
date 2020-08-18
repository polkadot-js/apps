import BN from 'bn.js';
import { formatBalance } from '@polkadot/util';

interface Arguments {
  balance: BN | string;
  fixedPoint?: number;
  unit?: string;
}

/**
 * To format balance with preference options
 *
 * Examples (default):
 * "12" ==> "0.0012"
 * "123456789" ==> "12,345.6789"
 *
 * Examples (fixedPoint=2 and unit="Unit")
 * "123" ==> "1.23 Unit"
 */
const toFormattedBalance = (args: Arguments): string => {
  const DEFAULT_FIXED_POINT = 4;
  const DEFAULT_UNIT = '';
  const {
    balance,
    fixedPoint = DEFAULT_FIXED_POINT,
    unit = DEFAULT_UNIT
  } = args;
  const unitPart = unit ? ` ${unit}` : '';

  /**
   * Condition 1: balance length is smaller than fixed point, e.g:
   * "123" ==> "0.1230" # when value length (3) is smaller than fixed point (4)
   */
  if (balance.toString().length <= fixedPoint) {
    const valueAsBN = BN.isBN(balance) ? balance : new BN(balance);
    const scalingSize = Math.pow(10, 1 - fixedPoint);
    const valuePart = (valueAsBN.toNumber() * scalingSize).toFixed(fixedPoint);


    return `${valuePart}${unitPart}`;
  }

  /**
   * Condition 2: balance length is larger than fixed point, e.g:
   * "123456789" ==> "12,345.6789" # when value length is larger than fixed point (4)
   */
  const polkadotFormatBalanceOptions = {
    decimals: fixedPoint,
    forceUnit: '-',
    withSi: false
  };
  const formattedBalance = formatBalance(balance, polkadotFormatBalanceOptions);

  const integerPart = formattedBalance.split('.')[0];
  const decimalPart = balance.toString().slice(-fixedPoint);

  return `${integerPart}.${decimalPart}${unitPart}`;
};

export default toFormattedBalance;
