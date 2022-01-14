// Copyright 2017-2022 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Data, Option } from '@polkadot/types';
import type { Registration } from '@polkadot/types/interfaces';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Input, InputBalance, Modal, Toggle, TxButton } from '@polkadot/react-components';
import { getAddressMeta } from '@polkadot/react-components/util';
import { useApi, useCall } from '@polkadot/react-hooks';
import { u8aToString } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  address: string;
  className?: string;
  onClose: () => void;
}

interface WrapProps {
  children: React.ReactNode;
  onChange: (isChecked: boolean) => void;
  value: boolean;
}

interface ValueState {
  info: Record<string, unknown>;
  okAll: boolean;
  okDisplay?: boolean;
  okEmail?: boolean;
  okLegal?: boolean;
  okRiot?: boolean;
  okTwitter?: boolean;
  okWeb?: boolean;
}

const WHITESPACE = [' ', '\t'];

function setData (data: Data, setActive: null | ((isActive: boolean) => void), setVal: (val: string) => void): void {
  if (data.isRaw) {
    setActive && setActive(true);
    setVal(u8aToString(data.asRaw.toU8a(true)));
  }
}

function WrapToggle ({ children, onChange, value }: WrapProps): React.ReactElement<WrapProps> {
  const { t } = useTranslation();

  return (
    <div className='toggle-Wrap'>
      {children}
      <Toggle
        isOverlay
        label={t<string>('include field')}
        onChange={onChange}
        value={value}
      />
    </div>
  );
}

function checkValue (hasValue: boolean, value: string | null | undefined, minLength: number, includes: string[], excludes: string[], starting: string[], notStarting: string[] = WHITESPACE, notEnding: string[] = WHITESPACE): boolean {
  return !hasValue || (
    !!value &&
    (value.length >= minLength) &&
    includes.reduce((hasIncludes: boolean, check) => hasIncludes && value.includes(check), true) &&
    (!starting.length || starting.some((check) => value.startsWith(check))) &&
    !excludes.some((check) => value.includes(check)) &&
    !notStarting.some((check) => value.startsWith(check)) &&
    !notEnding.some((check) => value.endsWith(check))
  );
}

function IdentityMain ({ address, className = '', onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const identityOpt = useCall<Option<Registration>>(api.query.identity.identityOf, [address]);
  const [{ info, okAll, okDisplay, okEmail, okLegal, okRiot, okTwitter, okWeb }, setInfo] = useState<ValueState>({ info: {}, okAll: false });
  const [hasEmail, setHasEmail] = useState(false);
  const [hasLegal, setHasLegal] = useState(false);
  const [hasRiot, setHasRiot] = useState(false);
  const [hasTwitter, setHasTwitter] = useState(false);
  const [hasWeb, setHasWeb] = useState(false);
  const [valDisplay, setValDisplay] = useState(() => (getAddressMeta(address).name || '').replace(/\(.*\)/, '').trim());
  const [valEmail, setValEmail] = useState('');
  const [valLegal, setValLegal] = useState('');
  const [valRiot, setValRiot] = useState('');
  const [valTwitter, setValTwitter] = useState('');
  const [valWeb, setValWeb] = useState('');
  const [gotPreviousIdentity, setGotPreviousIdentity] = useState(false);

  useEffect((): void => {
    if (identityOpt && identityOpt.isSome) {
      const { info } = identityOpt.unwrap();

      setData(info.display, null, setValDisplay);
      setData(info.email, setHasEmail, setValEmail);
      setData(info.legal, setHasLegal, setValLegal);
      setData(info.riot, setHasRiot, setValRiot);
      setData(info.twitter, setHasTwitter, setValTwitter);
      setData(info.web, setHasWeb, setValWeb);

      [info.display, info.email, info.legal, info.riot, info.twitter, info.web].some((info: Data) => {
        if (info.isRaw) {
          setGotPreviousIdentity(true);

          return true;
        } else {
          return false;
        }
      });
    }
  }, [identityOpt]);

  useEffect((): void => {
    const okDisplay = checkValue(true, valDisplay, 1, [], [], []);
    const okEmail = checkValue(hasEmail, valEmail, 3, ['@'], WHITESPACE, []);
    const okLegal = checkValue(hasLegal, valLegal, 1, [], [], []);
    const okRiot = checkValue(hasRiot, valRiot, 6, [':'], WHITESPACE, ['@', '~']);
    const okTwitter = checkValue(hasTwitter, valTwitter, 3, [], WHITESPACE, ['@']);
    const okWeb = checkValue(hasWeb, valWeb, 8, ['.'], WHITESPACE, ['https://', 'http://']);

    setInfo({
      info: {
        display: { [okDisplay ? 'raw' : 'none']: valDisplay || null },
        email: { [okEmail && hasEmail ? 'raw' : 'none']: okEmail && hasEmail ? valEmail : null },
        legal: { [okLegal && hasLegal ? 'raw' : 'none']: okLegal && hasLegal ? valLegal : null },
        riot: { [okRiot && hasRiot ? 'raw' : 'none']: okRiot && hasRiot ? valRiot : null },
        twitter: { [okTwitter && hasTwitter ? 'raw' : 'none']: okTwitter && hasTwitter ? valTwitter : null },
        web: { [okWeb && hasWeb ? 'raw' : 'none']: okWeb && hasWeb ? valWeb : null }
      },
      okAll: okDisplay && okEmail && okLegal && okRiot && okTwitter && okWeb,
      okDisplay,
      okEmail,
      okLegal,
      okRiot,
      okTwitter,
      okWeb
    });
  }, [hasEmail, hasLegal, hasRiot, hasTwitter, hasWeb, valDisplay, valEmail, valLegal, valRiot, valTwitter, valWeb]);

  return (
    <Modal
      className={className}
      header={t<string>('Register identity')}
      onClose={onClose}
    >
      <Modal.Content>
        <Input
          autoFocus
          help={t<string>('The name that will be displayed in your accounts list.')}
          isError={!okDisplay}
          label={t<string>('display name')}
          maxLength={32}
          onChange={setValDisplay}
          placeholder={t('My On-Chain Name')}
          value={valDisplay}
        />
        <WrapToggle
          onChange={setHasLegal}
          value={hasLegal}
        >
          <Input
            help={t<string>('The legal name for this identity.')}
            isDisabled={!hasLegal}
            isError={!okLegal}
            label={t<string>('legal name')}
            maxLength={32}
            onChange={setValLegal}
            placeholder={t('Full Legal Name')}
            value={hasLegal ? valLegal : '<none>'}
          />
        </WrapToggle>
        <WrapToggle
          onChange={setHasEmail}
          value={hasEmail}
        >
          <Input
            help={t<string>('The email address associated with this identity.')}
            isDisabled={!hasEmail}
            isError={!okEmail}
            label={t<string>('email')}
            maxLength={32}
            onChange={setValEmail}
            placeholder={t('somebody@example.com')}
            value={hasEmail ? valEmail : '<none>'}
          />
        </WrapToggle>
        <WrapToggle
          onChange={setHasWeb}
          value={hasWeb}
        >
          <Input
            help={t<string>('An URL that is linked to this identity.')}
            isDisabled={!hasWeb}
            isError={!okWeb}
            label={t<string>('web')}
            maxLength={32}
            onChange={setValWeb}
            placeholder={t('https://example.com')}
            value={hasWeb ? valWeb : '<none>'}
          />
        </WrapToggle>
        <WrapToggle
          onChange={setHasTwitter}
          value={hasTwitter}
        >
          <Input
            help={t<string>('The twitter name for this identity.')}
            isDisabled={!hasTwitter}
            isError={!okTwitter}
            label={t<string>('twitter')}
            onChange={setValTwitter}
            placeholder={t('@YourTwitterName')}
            value={hasTwitter ? valTwitter : '<none>'}
          />
        </WrapToggle>
        <WrapToggle
          onChange={setHasRiot}
          value={hasRiot}
        >
          <Input
            help={t<string>('a riot name linked to this identity')}
            isDisabled={!hasRiot}
            isError={!okRiot}
            label={t<string>('riot name')}
            maxLength={32}
            onChange={setValRiot}
            placeholder={t('@yourname:matrix.org')}
            value={hasRiot ? valRiot : '<none>'}
          />
        </WrapToggle>
        <InputBalance
          defaultValue={api.consts.identity?.basicDeposit}
          help={t<string>('Total amount of fund that will be reserved. These funds are returned when the identity is cleared')}
          isDisabled
          label={t<string>('total deposit')}
        />
      </Modal.Content>
      <Modal.Actions>
        <TxButton
          accountId={address}
          icon={'trash-alt'}
          isDisabled={!gotPreviousIdentity}
          label={t<string>('Clear Identity')}
          onStart={onClose}
          tx={api.tx.identity.clearIdentity}
        />
        <TxButton
          accountId={address}
          isDisabled={!okAll}
          label={t<string>('Set Identity')}
          onStart={onClose}
          params={[info]}
          tx={api.tx.identity.setIdentity}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default styled(IdentityMain)`
  .toggle-Wrap {
    position: relative;
  }
`;
