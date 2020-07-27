// Copyright 2017-2020 @canvas-ui/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { QueueTx } from '@canvas-ui/react-components/Status/types';
import { BareProps } from './types';

import React, { useCallback, useMemo, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { registry } from '@canvas-ui/react-api';
import { Button, Labelled, InputAddress } from '@canvas-ui/react-components';
import useSendTx from '@canvas-ui/react-signer/useSendTx';

import { ELEV_2_CSS } from './styles/constants';
import { useTranslation } from './translate';
import { truncate } from '@canvas-ui/react-util';

interface Props extends BareProps {
  additionalDetails: Record<string, any>;
  currentItem: QueueTx;
  instructions: React.ReactNode;
  isSendable: boolean;
  onError: () => void;
  requestAddress: string;
}

function PendingTx ({ additionalDetails, className, currentItem, currentItem: { accountId, extrinsic }, instructions, requestAddress }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const willSend = useRef(false);
  const { onCancel, onSend, tx } = useSendTx(currentItem, requestAddress);

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
              <Labelled label={t<string>('Contract Name')}>
                {additionalDetails.name}
              </Labelled>

              <Labelled
                isMonospace
                label={t<string>('Constructor')}
              >
                {additionalDetails.constructor}
              </Labelled>
              {(additionalDetails.params as { arg: React.ReactNode, value: string }[]).map(
                ({ arg, value }: { arg: React.ReactNode, value: string }, index): React.ReactNode => {
                  return (
                    <Labelled
                      isIndented
                      isLabelMonospace
                      isMonospace
                      key={`arg-${index}`}
                      label={arg}
                    >
                      {value.toString()}
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
              {(additionalDetails.params as { arg: React.ReactNode, value: string }[]).map(
                ({ arg, value }: { arg: React.ReactNode, value: string }, index): React.ReactNode => {
                  return (
                    <Labelled
                      isIndented
                      isLabelMonospace
                      isMonospace
                      key={`arg-${index}`}
                      label={arg}
                    >
                      {value.toString()}
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
    [accountId, additionalDetails, extrinsic, t]
  );

  if (!extrinsic) {
    return null;
  }

  return (
    <div className={className}>
      {content}
      <footer>
        <h3>{t<string>('Sign & Submit')}</h3>
        <div className='instructions'>
          {instructions}
        </div>
        <Button.Group>
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
`);
