// Copyright 2017-2021 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { registry as baseRegistry } from '@canvas-ui/react-api';
import { Button, Data, InputAddress, Labelled } from '@canvas-ui/react-components';
import { QueueTx } from '@canvas-ui/react-api/Status/types';
import useSendTx from './useSendTx';
import { truncate } from '@canvas-ui/react-util';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';

import { TypeRegistry } from '@polkadot/types';
import { TypeDef } from '@polkadot/types/types';

import { ELEV_2_CSS } from '@canvas-ui/react-components/styles/constants';
import { useTranslation } from '@canvas-ui/react-components/translate';
import { BareProps } from '@canvas-ui/react-components/types';

interface Props extends BareProps {
  additionalDetails: Record<string, any>;
  currentItem: QueueTx | null;
  instructions: React.ReactNode;
  isSendable: boolean;
  onError: () => void;
  registry?: TypeRegistry;
  requestAddress: string;
}

function PendingTx ({ additionalDetails, children, className, currentItem, instructions, registry, requestAddress }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const willSend = useRef(false);
  const { onCancel, onSend, tx } = useSendTx(currentItem, requestAddress);
  const isSigning = !!currentItem?.extrinsic;

  const _onSend = useCallback(
    async (): Promise<void> => {
      willSend.current = true;
      await onSend();
    },
    [onSend]
  );

  useEffect(
    (): () => void => {
      return function (): void {
        if (!willSend.current) {
          onCancel();
        }
      };
    },
    [onCancel, tx]
  );

  const content = useMemo(
    (): React.ReactNode | null => {
      if (!currentItem?.extrinsic) {
        return null;
      }

      const { accountId, extrinsic } = currentItem;

      const { meta, method, section } = baseRegistry.findMetaCall(extrinsic.callIndex);

      let details: React.ReactNode = null;
      const sig = `${section}.${method}`;

      switch (sig) {
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
              <Labelled
                isMonospace
                label={t<string>('Code Bytes')}
              >
                {truncate(extrinsic.args[0].toString())}
              </Labelled>
            </div>
          );
          break;
        case 'contracts.instantiate':
        case 'contracts.instantiateWithCode':
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

              {sig === 'contracts.instantiateWithCode' && (
                <>
                  <Labelled label={t<string>('Code Bundle Name')}>
                    {additionalDetails.codeName}
                  </Labelled>
                  <Labelled
                    isMonospace
                    label={t<string>('Code Bytes')}
                  >
                    {truncate(extrinsic.args[0].toString())}
                  </Labelled>
                </>
              )}
              <Labelled label={t<string>('Contract Name')}>
                {additionalDetails.contractName}
              </Labelled>

              <Labelled
                isMonospace
                label={t<string>('Constructor')}
              >
                {additionalDetails.constructor}
              </Labelled>
              {(additionalDetails.params as { arg: React.ReactNode, type: TypeDef, value: string }[]).map(
                ({ arg, type, value }: { arg: React.ReactNode, type: TypeDef, value: string }, index): React.ReactNode => {
                  return (
                    <Labelled
                      isIndented
                      isLabelMonospace
                      isMonospace
                      key={`arg-${index}`}
                      label={arg}
                    >
                      <Data
                        isTrimmed
                        registry={registry}
                        type={type}
                        value={value}
                      />
                    </Labelled>
                  );
                }
              )}
              <Labelled label={t<string>('Endowment')}>
                {truncate(extrinsic.args[0].toString())}
              </Labelled>
              <Labelled label={t<string>('Weight')}>
                {truncate(extrinsic.args[1].toString())}
              </Labelled>
              <Labelled
                isMonospace
                label={t<string>('Code Hash')}
              >
                {truncate(extrinsic.args[2].toString())}
              </Labelled>
              <Labelled
                isMonospace
                label={t<string>('Data')}
              >
                {truncate(extrinsic.args[3].toString())}
              </Labelled>
            </div>
          );
          break;
        case 'contracts.call':
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
              <Labelled label={t<string>('Contract to Call')}>
                <InputAddress
                  defaultValue={extrinsic.args[0].toString()}
                  isDisabled
                  value={extrinsic.args[0].toString()}
                  withLabel={false}
                />
              </Labelled>
              <Labelled
                isMonospace
                label={t<string>('Message to Call')}
              >
                {additionalDetails.message}
              </Labelled>
              {(additionalDetails.params as { arg: React.ReactNode, type: TypeDef, value: string }[]).map(
                ({ arg, type, value }: { arg: React.ReactNode, type: TypeDef, value: string }, index): React.ReactNode => {
                  return (
                    <Labelled
                      isIndented
                      isLabelMonospace
                      isMonospace
                      key={`arg-${index}`}
                      label={arg}
                    >
                      <Data
                        isTrimmed
                        registry={registry}
                        type={type}
                        value={value}
                      />
                    </Labelled>
                  );
                }
              )}
              <Labelled label={t<string>('Endowment')}>
                {truncate(extrinsic.args[1].toString())}
              </Labelled>
              <Labelled label={t<string>('Weight')}>
                {truncate(extrinsic.args[2].toString())}
              </Labelled>
              <Labelled
                isMonospace
                label={t<string>('Data')}
              >
                {truncate(extrinsic.args[3].toString())}
              </Labelled>
            </div>
          );
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
      );
    },
    [currentItem, additionalDetails, registry, t]
  );

  return (
    <div className={className}>
      <div style={{ display: isSigning ? 'block' : 'none' }}>
        {content}
        <footer>
          <h3>{t<string>('Sign & Submit')}</h3>
          <div className='instructions'>
            {instructions}
          </div>
          <Button.Group className='buttons-submit'>
            <Button
              isPrimary
              label={t<string>('Sign & Submit')}
              onClick={_onSend}
            />
            <Button
              label={t<string>('Cancel')}
              onClick={onCancel}
            />
          </Button.Group>
        </footer>
      </div>
      <div style={{ display: isSigning ? 'none' : 'block' }}>
        {children}
      </div>
    </div>
  );
}

export default React.memo(styled(PendingTx)`

  .details {
    ${ELEV_2_CSS}
    padding: 1rem 1.25rem;

    > :not(:last-child) {
      margin-bottom: 1.5rem;
    }

    .ui.search.dropdown {
      margin: 0;
      padding: 0;
    }
  }

  .buttons-submit {
    margin: 1rem 0;
  }
`);
