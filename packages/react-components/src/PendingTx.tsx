// Copyright 2017-2020 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { QueueTx } from '@polkadot/react-components/Status/types';
import { BareProps } from './types';

import React, { useMemo } from 'react';
import styled from 'styled-components';
import { registry } from '@polkadot/react-api';
import { Button, Labelled, InputAddress } from '@polkadot/react-components';
import useSendTx from '@polkadot/react-signer/useSendTx';

import { ELEV_2_CSS } from './styles/constants';
import { useTranslation } from './translate';
import { truncate } from './util';

interface Props extends BareProps {
  additionalDetails: Record<string, string>;
  currentItem: QueueTx;
  instructions: React.ReactNode;
  isSendable: boolean;
  onError: () => void;
  requestAddress: string;
}

function PendingTx ({ className, currentItem, additionalDetails, currentItem: { accountId, extrinsic, isUnsigned, payload }, instructions, isSendable, onError, requestAddress }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { onSend, onCancel } = useSendTx(currentItem, requestAddress);

  console.log(additionalDetails);
  
  const content = useMemo(
    (): React.ReactNode | null => {
      if (!extrinsic) {
        return null;
      }

      const { meta, method, section } = registry.findMetaCall(extrinsic.callIndex);
      
      let details: React.ReactNode = null;
  
      switch (`${section}.${method}`) {
        case 'contracts.putCode':
          details = (
            <div className='details'>
              <Labelled label={t<string>('Account')}>
                <InputAddress
                  defaultValue={accountId}
                  isDisabled
                  value={accountId}
                  withLabel={false}
                />
              </Labelled>
              <Labelled label={t<string>('Code Bundle Name')}>
                {additionalDetails.name}
              </Labelled>
              <Labelled isMonospace label={t<string>('Code Bytes')}>
                {truncate(extrinsic.args[0].toString())}
              </Labelled>
            </div>
          )
          break;
        default:
          break;
      }

      return (
        <>
          <header>
            <h1>{section}.{method}</h1>
            <div className='instructions'>
              {meta.documentation}
            </div>
          </header>
          <section>
            {details}
          </section>
        </>
      )
    },
    [extrinsic]
  )

  if (!extrinsic) {
    return null;
  }

  return (
    <div className={className}>
      {content}
      <footer>
        <h3>{t('Sign & Submit')}</h3>
        <div className='instructions'>
          {instructions}
        </div>
        <Button.Group>
          <Button
            isPrimary
            label={t('Sign & Submit')}
            onClick={onSend}
          />
          <Button
            label={t('Cancel')}
            onClick={onCancel}
          />
        </Button.Group>
      </footer>
    </div>
  )
}

export default React.memo(styled(PendingTx)`
  .details {
    ${ELEV_2_CSS}
    padding: 1rem 1.25rem;

    :not(:last-child) {
      margin-bottom: 1.5rem;
    }
  }
`);
