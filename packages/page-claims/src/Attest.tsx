// Copyright 2017-2020 @polkadot/app-claims authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Signer } from '@polkadot/api/types';
import { web3FromSource } from '@polkadot/extension-dapp';
import { KeyringPair } from '@polkadot/keyring/types';
import { Button, Card } from '@polkadot/react-components';
import keyring from '@polkadot/ui-keyring';
import { stringToHex, stringToU8a, u8aToHex } from '@polkadot/util';

import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { useTranslation } from './translate';

interface Props {
  accountId: string;
  className?: string;
  data: string;
  onNextStep: (signature: string) => void;
}

function Attest ({ accountId, className, data, onNextStep }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  // const [attestSignature, setAttestSignature] = useState<string | null>(null);
  const [currentPair, setCurrentPair] = useState<KeyringPair | null>(null);
  const [signer, setSigner] = useState<Signer | null >(null);

  useEffect((): void => {
    const isInjected = currentPair?.meta.isInjected || false;

    // for injected, retrieve the signer
    if (currentPair && isInjected) {
      const { meta: { source } } = currentPair;

      web3FromSource(source)
        .catch((): null => null)
        .then((injected): void => setSigner(
          injected?.signer || null
        ));
    }
  }, [currentPair]);

  useEffect(() => {
    setCurrentPair(keyring.getPair(accountId || ''));
  }, [accountId]);

  const _signAttest = useCallback(
    (): void => {
      if (!currentPair) {
        return;
      }

      if (signer?.signRaw) {
        signer
          .signRaw({
            address: currentPair.address,
            data: stringToHex(data),
            type: 'bytes'
          })
          .then(({ signature }): void => onNextStep(signature));
      } else {
        onNextStep(u8aToHex(
          currentPair.sign(stringToU8a(data))
        ));
      }
    },
    [currentPair, data, onNextStep, signer]
  );

  return (
    <Card className={className}>
      <h3>{t('3. Sign attestation')}</h3>
      <div>
        {t('Clicking the following button will let you sign the hash of the attestation available at the following address: XXX')}
                  :
      </div>
      <Button.Group>
        <Button
          icon='sign-in'
          isDisabled={!accountId}
          label={t('Sign attestation')}
          onClick={_signAttest}
        />
      </Button.Group>

    </Card>
  );
}

export default React.memo(styled(Attest)`
  /* font-size: 1.15rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 12rem;
  align-items: center;
  margin: 0 1rem; */

  h3 {
    font-family: monospace;
    font-size: 1.5rem;
    max-width: 100%;
    margin: 0.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`);
