// Copyright 2017-2022 @polkadot/app-custom-signature authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import { EcdsaAddressFormat } from '../types';
import CustomSignTx from './CustomSignTx';
import EcdsaAccount from './EcdsaAccount';

interface Props {
  className?: string;
}

function EcdsaCallSigner ({ className = '' }: Props): React.ReactElement<Props> {
  // const { requestSignature } = useMetaMask();
  const [currentEthAddress, setCurrentEthAddress] = useState<EcdsaAddressFormat>();

  /*
  // request signature from MetaMask
  const _onClickSignatureRequest = useCallback(
    async (payload: string) => {
      if (!currentEthAddress) {
        throw new Error("No account was loaded");
      }

      // we're signing the message with the first account
      const sigResponse = await requestSignature(payload, currentEthAddress?.ethereum);

      console.log(sigResponse);

      if (typeof sigResponse !== "string") {
        throw new Error("Failed to fetch signature");
      }

      return sigResponse;
    },
    [currentEthAddress, requestSignature]
  );
*/
  return (
    <section className={`${className}`}>
      <EcdsaAccount onAccountChanged={setCurrentEthAddress} />
      {currentEthAddress && <CustomSignTx signer={currentEthAddress} />}
    </section>
  );
}

export default React.memo(EcdsaCallSigner);
