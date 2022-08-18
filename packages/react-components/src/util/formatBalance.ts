import { BigNumber } from "bignumber.js";
import { BN } from "@polkadot/util";

export const formatBalance = (balance: BN, withUnit = true) => {
  const darwiniaTokenDecimals = 9;
  const precision = 4;
  return new BigNumber(balance.toString()).div(Math.pow(10, darwiniaTokenDecimals)).toFormat(precision, BigNumber.ROUND_DOWN);
}
