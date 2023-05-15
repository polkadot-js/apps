// Copyright 2017-2023 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { Data, Option } from '@polkadot/types';
import type { IdentityInfo, Registration } from '@polkadot/types/interfaces';

import React, { useEffect, useState } from 'react';

import { Input, InputBalance, Modal, Toggle, TxButton } from '@polkadot/react-components';
import { getAddressMeta } from '@polkadot/react-components/util';
import { useApi, useCall } from '@polkadot/react-hooks';
import { AddressIdentityOtherDiscordKey } from '@polkadot/react-hooks/types';
import { u8aToString } from '@polkadot/util';

import { useTranslation } from '../translate.js';

interface Props {
  address: string;
  className?: string;
  onClose: () => void;
}

interface ValueState {
  info: Record<string, unknown>;
  okAll: boolean;
  okDiscord?: boolean;
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

function setAdditionalFieldData (api: ApiPromise, info: IdentityInfo, key: string, setActive: null | ((isActive: boolean) => void), setVal: (val: string) => void): Data {
  const dataKey = api.registry.createType('Data', api.registry.createType('Data', { Raw: key }));
  const dataNone = api.registry.createType('Data', '');

  const value = info.additional.find((v) => v[0].eq(dataKey))?.[1] || dataNone;

  if (value.isRaw) {
    setData(value, setActive, setVal);
  }

  return value;
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
  const [{ info, okAll, okDiscord, okDisplay, okEmail, okLegal, okRiot, okTwitter, okWeb }, setInfo] = useState<ValueState>({ info: {}, okAll: false });
  const [hasEmail, setHasEmail] = useState(false);
  const [hasLegal, setHasLegal] = useState(false);
  const [hasRiot, setHasRiot] = useState(false);
  const [hasTwitter, setHasTwitter] = useState(false);
  const [hasDiscord, setHasDiscord] = useState(false);
  const [hasWeb, setHasWeb] = useState(false);
  const [valDisplay, setValDisplay] = useState(() => (getAddressMeta(address).name || '').replace(/\(.*\)/, '').trim());
  const [valEmail, setValEmail] = useState('');
  const [valLegal, setValLegal] = useState('');
  const [valRiot, setValRiot] = useState('');
  const [valTwitter, setValTwitter] = useState('');
  const [valDiscord, setValDiscord] = useState('');
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
      const infoDiscord = setAdditionalFieldData(api, info, AddressIdentityOtherDiscordKey, setHasDiscord, setValDiscord);

      setData(info.web, setHasWeb, setValWeb);

      [info.display, info.email, info.legal, info.riot, info.twitter, infoDiscord, info.web].some((info: Data) => {
        if (info.isRaw) {
          setGotPreviousIdentity(true);

          return true;
        } else {
          return false;
        }
      });
    }
  }, [identityOpt, api]);

  useEffect((): void => {
    const okDisplay = checkValue(true, valDisplay, 1, [], [], []);
    const okEmail = checkValue(hasEmail, valEmail, 3, ['@'], WHITESPACE, []);
    const okLegal = checkValue(hasLegal, valLegal, 1, [], [], []);
    const okRiot = checkValue(hasRiot, valRiot, 6, [':'], WHITESPACE, ['@', '~']);
    const okTwitter = checkValue(hasTwitter, valTwitter, 3, [], WHITESPACE, ['@']);
    const okDiscord = checkValue(hasDiscord, valDiscord, 3, [], WHITESPACE, []);
    const okWeb = checkValue(hasWeb, valWeb, 8, ['.'], WHITESPACE, ['https://', 'http://']);

    setInfo({
      info: {
        additional: [
          (okDiscord && hasDiscord ? [{ raw: AddressIdentityOtherDiscordKey }, { raw: valDiscord }] : null)
        ].filter((item) => !!item),
        display: { [okDisplay ? 'raw' : 'none']: valDisplay || null },
        email: { [okEmail && hasEmail ? 'raw' : 'none']: okEmail && hasEmail ? valEmail : null },
        legal: { [okLegal && hasLegal ? 'raw' : 'none']: okLegal && hasLegal ? valLegal : null },
        riot: { [okRiot && hasRiot ? 'raw' : 'none']: okRiot && hasRiot ? valRiot : null },
        twitter: { [okTwitter && hasTwitter ? 'raw' : 'none']: okTwitter && hasTwitter ? valTwitter : null },
        web: { [okWeb && hasWeb ? 'raw' : 'none']: okWeb && hasWeb ? valWeb : null }
      },
      okAll: okDisplay && okEmail && okLegal && okRiot && okTwitter && okDiscord && okWeb,
      okDiscord,
      okDisplay,
      okEmail,
      okLegal,
      okRiot,
      okTwitter,
      okWeb
    });
  }, [hasEmail, hasLegal, hasRiot, hasTwitter, hasDiscord, hasWeb, valDisplay, valEmail, valLegal, valRiot, valTwitter, valDiscord, valWeb]);

  return (
    <Modal
      className={className}
      header={t<string>('Register identity')}
      onClose={onClose}
    >
      <Modal.Content>
        <Input
          autoFocus
          isError={!okDisplay}
          label={t<string>('display name')}
          maxLength={32}
          onChange={setValDisplay}
          placeholder={t<string>('My On-Chain Name')}
          value={valDisplay}
        />
        <Input
          isDisabled={!hasLegal}
          isError={!okLegal}
          label={t<string>('legal name')}
          labelExtra={
            <Toggle
              label={t<string>('include field')}
              onChange={setHasLegal}
              value={hasLegal}
            />
          }
          maxLength={32}
          onChange={setValLegal}
          placeholder={t<string>('Full Legal Name')}
          value={hasLegal ? valLegal : '<none>'}
        />
        <Input
          isDisabled={!hasEmail}
          isError={!okEmail}
          label={t<string>('email')}
          labelExtra={
            <Toggle
              label={t<string>('include field')}
              onChange={setHasEmail}
              value={hasEmail}
            />
          }
          maxLength={32}
          onChange={setValEmail}
          placeholder={t<string>('somebody@example.com')}
          value={hasEmail ? valEmail : '<none>'}
        />
        <Input
          isDisabled={!hasWeb}
          isError={!okWeb}
          label={t<string>('web')}
          labelExtra={
            <Toggle
              label={t<string>('include field')}
              onChange={setHasWeb}
              value={hasWeb}
            />
          }
          maxLength={32}
          onChange={setValWeb}
          placeholder={t<string>('https://example.com')}
          value={hasWeb ? valWeb : '<none>'}
        />
        <Input
          isDisabled={!hasTwitter}
          isError={!okTwitter}
          label={t<string>('twitter')}
          labelExtra={
            <Toggle
              label={t<string>('include field')}
              onChange={setHasTwitter}
              value={hasTwitter}
            />
          }
          onChange={setValTwitter}
          placeholder={t<string>('@YourTwitterName')}
          value={hasTwitter ? valTwitter : '<none>'}
        />
        <Input
          isDisabled={!hasDiscord}
          isError={!okDiscord}
          label={t<string>('discord')}
          labelExtra={
            <Toggle
              label={t<string>('include field')}
              onChange={setHasDiscord}
              value={hasDiscord}
            />
          }
          onChange={setValDiscord}
          placeholder={t<string>('YourDiscordHandle')}
          value={hasDiscord ? valDiscord : '<none>'}
        />
        <Input
          isDisabled={!hasRiot}
          isError={!okRiot}
          label={t<string>('riot name')}
          labelExtra={
            <Toggle
              label={t<string>('include field')}
              onChange={setHasRiot}
              value={hasRiot}
            />
          }
          maxLength={32}
          onChange={setValRiot}
          placeholder={t<string>('@yourname:matrix.org')}
          value={hasRiot ? valRiot : '<none>'}
        />
        <InputBalance
          defaultValue={api.consts.identity?.basicDeposit}
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

export default React.memo(IdentityMain);
