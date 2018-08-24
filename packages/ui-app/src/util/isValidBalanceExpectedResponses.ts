// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { IsValidWithMessage } from './types';

import { TranslationFunction } from 'i18next';

export enum ErrorMessage {
  MustBeStringType = 'Balance input value must be valid type',
  MustContainOnlySingleEOrPlus = 'Scientific notation may only contain one instance of \'e\' for scientific notation or exponential with \'e+\'',
  ExponentialNotationMissingExponent = 'Exponential \'e+\' notation when used must be followed by a number',
  ScientificNotationMissingExponent = 'Scientific notation \'e\' when used must be followed by a number',
  MustBeNumber = 'Balance to transfer in DOTs must be a number or expressed in scientific notation (i.e. 3.4e38) or exponential with \'e+\'',
  MustBeFinite = 'Balance to transfer in DOTs must not be infinite',
  WithDecimalsOnlyWithE = 'Decimal points are only allowed in scientific notation by using an \'e\' (i.e. 3.4e38) or exponential with \'e+\'',
  AboveMax = 'Balance above max for {{bitLength}} bit',
  AboveMaxScientificNotation = 'Balance value after converting from scientific notation is above max for {{bitLength}} bit',
  AboveMaxExponentialNotation = 'Balance value after converting from exponential notation is above max for {{bitLength}} bit'
}

export enum WarnMessage {
  Zero = 'Balance to transfer in DOTs should be greater than or equal to one'
}

export const expectedIsValidResponse = (
  isValid: boolean = false,
  errorMessage?: TranslationFunction,
  errorMessageUntranslated?: ErrorMessage,
  warningMessage?: TranslationFunction,
  warningMessageUntranslated?: WarnMessage,
  infoMessage?: string,
  num?: string
): IsValidWithMessage => {
  let response: IsValidWithMessage = {
    isValid
  };
  if (errorMessage) {
    response.errorMessage = errorMessage;
  }
  if (errorMessageUntranslated) {
    response.errorMessageUntranslated = errorMessageUntranslated;
  }
  if (warningMessage) {
    response.warnMessage = warningMessage;
  }
  if (warningMessageUntranslated) {
    response.warnMessageUntranslated = warningMessageUntranslated;
  }
  if (infoMessage) {
    response.infoMessage = infoMessage;
  }
  if (num) {
    response.num = num;
  }
  return response;
};
