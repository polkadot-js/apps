// Copyright 2017-2025 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { Bytes, Data, Option, Struct } from '@polkadot/types';
import type { H160, IdentityInfo, Registration } from '@polkadot/types/interfaces';
import type { PalletIdentityRegistration } from '@polkadot/types/lookup';
import type { ITuple } from '@polkadot/types-codec/types';

import React, { useEffect, useState } from 'react';

import { Input, InputBalance, Modal, Toggle, TxButton } from '@polkadot/react-components';
import { getAddressMeta } from '@polkadot/react-components/util';
import { useApi, useCall } from '@polkadot/react-hooks';
import { AddressIdentityOtherDiscordKey } from '@polkadot/react-hooks/constants';
import { u8aToString } from '@polkadot/util';

import { useTranslation } from '../translate.js';

interface Props {
  address: string;
  className?: string;
  onClose: () => void;
}

interface ValueState {
  okAll: boolean;
  okDiscord?: boolean;
  okDisplay?: boolean;
  okEmail?: boolean;
  okGithub?: boolean;
  okLegal?: boolean;
  okMatrix?: boolean;
  okRiot?: boolean;
  okTwitter?: boolean;
  okWeb?: boolean;
}

// With the Identity pallet being transferred to the people chain, the types are also changed.
interface PeopleIdentityInfo extends Struct {
  display: Data;
  legal: Data;
  web: Data;
  matrix: Data;
  email: Data;
  pgpFingerprint: Option<H160>;
  image: Data;
  twitter: Data;
  github: Data;
  discord: Data;
}

const WHITESPACE = [' ', '\t'];

function setData (data: Data, setActive: null | ((isActive: boolean) => void), setVal: (val: string) => void): void {
  if (data && data.isRaw) {
    setActive && setActive(true);
    setVal(u8aToString(data.asRaw.toU8a(true)));
  }
}

function setAdditionalFieldData (api: ApiPromise, info: IdentityInfo, key: string, setActive: null | ((isActive: boolean) => void), setVal: (val: string) => void): Data {
  const dataKey = api.registry.createType('Data', api.registry.createType('Data', { Raw: key }));
  const dataNone = api.registry.createType('Data', '');
  const value = info.additional.find((v) => v[0].eq(dataKey))?.[1] || dataNone;

  if (value && value.isRaw) {
    setData(value, setActive, setVal);
  }

  return value;
}

function setDiscordFieldData (info: PeopleIdentityInfo, setActive: null | ((isActive: boolean) => void), setVal: (val: string) => void): Data {
  if (info.discord && !info.discord.isNone) {
    setActive && setActive(true);
    setVal(u8aToString(info.discord.asRaw.toU8a(true)));
  }

  return info.discord;
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
  const { apiIdentity, enableIdentity, specName } = useApi();
  const identityOpt = useCall<Option<ITuple<[PalletIdentityRegistration, Option<Bytes>]>>>(apiIdentity.query.identity.identityOf, [address]);
  const [{ okAll, okDiscord, okDisplay, okEmail, okGithub, okLegal, okMatrix, okRiot, okTwitter, okWeb }, setOkInfo] = useState<ValueState>({ okAll: false });
  const [legacyInfo, setLegacyInfo] = useState<Record<string, unknown>>({});
  const [info, setInfo] = useState<Record<string, unknown>>({});
  const [hasEmail, setHasEmail] = useState(false);
  const [hasLegal, setHasLegal] = useState(false);
  const [hasRiot, setHasRiot] = useState(false);
  const [hasMatrix, setHasMatrix] = useState(false);
  const [hasGithub, setHasGithub] = useState(false);
  const [hasTwitter, setHasTwitter] = useState(false);
  const [hasDiscord, setHasDiscord] = useState(false);
  const [hasWeb, setHasWeb] = useState(false);
  const [valDisplay, setValDisplay] = useState(() => (getAddressMeta(address).name || '').replace(/\(.*\)/, '').trim());
  const [valEmail, setValEmail] = useState('');
  const [valLegal, setValLegal] = useState('');
  const [valRiot, setValRiot] = useState('');
  const [valMatrix, setValMatrix] = useState('');
  const [valGithub, setValGithub] = useState('');
  const [valTwitter, setValTwitter] = useState('');
  const [valDiscord, setValDiscord] = useState('');
  const [valWeb, setValWeb] = useState('');
  const [gotPreviousIdentity, setGotPreviousIdentity] = useState(false);
  // HACK This ensures we can deal with legacy indentity information for chains while
  // also giving support for the new identity logic inside of the Peoples chain.
  // The new logic is specific to people system parachains.
  const [isLegacyIdentity, setIsLegacyIdentity] = useState<boolean>(!specName.includes('people-'));
  const [isPalletChecked, setIsPalletChecked] = useState<boolean>(false);

  useEffect((): void => {
    if (identityOpt && identityOpt.isSome) {
      const identity = identityOpt.unwrap();
      const foundInfo = Array.isArray(identity) ? identity[0].info : (identity as Registration).info;

      // Ensure we set the state before ever jumping into the logic below.
      if (!isPalletChecked) {
        // riot was replaced with matrix, so if we see riot as part of the structure
        // we know its part of the legacy identity logic
        foundInfo.riot ? setIsLegacyIdentity(true) : setIsLegacyIdentity(false);
        setIsPalletChecked(true);
      } else {
        setData(foundInfo.display, null, setValDisplay);
        setData(foundInfo.email, setHasEmail, setValEmail);
        setData(foundInfo.legal, setHasLegal, setValLegal);
        setData(foundInfo.riot, setHasRiot, setValRiot);
        setData(foundInfo.twitter, setHasTwitter, setValTwitter);
        setData((foundInfo as unknown as PeopleIdentityInfo).matrix, setHasMatrix, setValMatrix);
        setData((foundInfo as unknown as PeopleIdentityInfo).github, setHasGithub, setValGithub);
        setData(foundInfo.web, setHasWeb, setValWeb);
        const infoDiscord = isLegacyIdentity ? setAdditionalFieldData(apiIdentity, foundInfo, AddressIdentityOtherDiscordKey, setHasDiscord, setValDiscord) : setDiscordFieldData((foundInfo as unknown as PeopleIdentityInfo), setHasDiscord, setValDiscord);

        const previousKeys = isLegacyIdentity
          ? [foundInfo.display, foundInfo.email, foundInfo.legal, foundInfo.riot, foundInfo.twitter, infoDiscord, foundInfo.web]
          : [foundInfo.display, foundInfo.email, (foundInfo as unknown as PeopleIdentityInfo).github, foundInfo.legal, (foundInfo as unknown as PeopleIdentityInfo).matrix, foundInfo.twitter, infoDiscord, foundInfo.web];

        previousKeys.some((info: Data | null) => {
          if (info && info.isRaw) {
            setGotPreviousIdentity(true);

            return true;
          } else {
            return false;
          }
        });
      }
    }
  }, [identityOpt, apiIdentity, isLegacyIdentity, isPalletChecked]);

  useEffect((): void => {
    const okDisplay = checkValue(true, valDisplay, 1, [], [], []);
    const okEmail = checkValue(hasEmail, valEmail, 3, ['@'], WHITESPACE, []);
    const okLegal = checkValue(hasLegal, valLegal, 1, [], [], []);
    const okMatrix = checkValue(hasMatrix, valMatrix, 6, [':'], WHITESPACE, ['@', '~']);
    const okRiot = checkValue(hasRiot, valRiot, 6, [':'], WHITESPACE, ['@', '~']);
    const okTwitter = checkValue(hasTwitter, valTwitter, 3, [], WHITESPACE, ['@']);
    const okDiscord = checkValue(hasDiscord, valDiscord, 3, [], WHITESPACE, []);
    const okGithub = checkValue(hasGithub, valGithub, 3, [], WHITESPACE, []);
    const okWeb = checkValue(hasWeb, valWeb, 8, ['.'], WHITESPACE, ['https://', 'http://']);

    setOkInfo({
      okAll: okDisplay && okEmail && okLegal && okRiot && okTwitter && okDiscord && okWeb,
      okDiscord,
      okDisplay,
      okEmail,
      okGithub,
      okLegal,
      okMatrix,
      okRiot,
      okTwitter,
      okWeb
    });

    isLegacyIdentity
      ? setLegacyInfo({
        additional: [
          (okDiscord && hasDiscord ? [{ raw: AddressIdentityOtherDiscordKey }, { raw: valDiscord }] : null)
        ].filter((item) => !!item),
        display: { [okDisplay ? 'raw' : 'none']: valDisplay || null },
        email: { [okEmail && hasEmail ? 'raw' : 'none']: okEmail && hasEmail ? valEmail : null },
        legal: { [okLegal && hasLegal ? 'raw' : 'none']: okLegal && hasLegal ? valLegal : null },
        riot: { [okRiot && hasRiot ? 'raw' : 'none']: okRiot && hasRiot ? valRiot : null },
        twitter: { [okTwitter && hasTwitter ? 'raw' : 'none']: okTwitter && hasTwitter ? valTwitter : null },
        web: { [okWeb && hasWeb ? 'raw' : 'none']: okWeb && hasWeb ? valWeb : null }
      })
      : setInfo({
        discord: { [okDiscord && hasDiscord ? 'raw' : 'none']: okDiscord && hasDiscord ? valDiscord : null },
        display: { [okDisplay ? 'raw' : 'none']: valDisplay || null },
        email: { [okEmail && hasEmail ? 'raw' : 'none']: okEmail && hasEmail ? valEmail : null },
        github: { [okGithub && hasGithub ? 'raw' : 'none']: okGithub && hasGithub ? valGithub : null },
        legal: { [okLegal && hasLegal ? 'raw' : 'none']: okLegal && hasLegal ? valLegal : null },
        matrix: { [okMatrix && hasMatrix ? 'raw' : 'none']: okMatrix && hasMatrix ? valMatrix : null },
        twitter: { [okTwitter && hasTwitter ? 'raw' : 'none']: okTwitter && hasTwitter ? valTwitter : null },
        web: { [okWeb && hasWeb ? 'raw' : 'none']: okWeb && hasWeb ? valWeb : null }
      });
  }, [hasEmail, hasLegal, hasRiot, hasTwitter, hasDiscord, hasWeb, hasMatrix, hasGithub, valDisplay, valEmail, valLegal, valRiot, valTwitter, valDiscord, valWeb, valMatrix, valGithub, isLegacyIdentity]);

  return (
    <Modal
      className={className}
      header={t('Register identity')}
      onClose={onClose}
    >
      <Modal.Content>
        <Input
          autoFocus
          isError={!okDisplay}
          label={t('display name')}
          maxLength={32}
          onChange={setValDisplay}
          placeholder={t('My On-Chain Name')}
          value={valDisplay}
        />
        <Input
          isDisabled={!hasLegal}
          isError={!okLegal}
          label={t('legal name')}
          labelExtra={
            <Toggle
              label={t('include field')}
              onChange={setHasLegal}
              value={hasLegal}
            />
          }
          maxLength={32}
          onChange={setValLegal}
          placeholder={t('Full Legal Name')}
          value={hasLegal ? valLegal : '<none>'}
        />
        <Input
          isDisabled={!hasEmail}
          isError={!okEmail}
          label={t('email')}
          labelExtra={
            <Toggle
              label={t('include field')}
              onChange={setHasEmail}
              value={hasEmail}
            />
          }
          maxLength={32}
          onChange={setValEmail}
          placeholder={t('somebody@example.com')}
          value={hasEmail ? valEmail : '<none>'}
        />
        <Input
          isDisabled={!hasWeb}
          isError={!okWeb}
          label={t('web')}
          labelExtra={
            <Toggle
              label={t('include field')}
              onChange={setHasWeb}
              value={hasWeb}
            />
          }
          maxLength={32}
          onChange={setValWeb}
          placeholder={t('https://example.com')}
          value={hasWeb ? valWeb : '<none>'}
        />
        <Input
          isDisabled={!hasTwitter}
          isError={!okTwitter}
          label={t('twitter')}
          labelExtra={
            <Toggle
              label={t('include field')}
              onChange={setHasTwitter}
              value={hasTwitter}
            />
          }
          onChange={setValTwitter}
          placeholder={t('@YourTwitterName')}
          value={hasTwitter ? valTwitter : '<none>'}
        />
        <Input
          isDisabled={!hasDiscord}
          isError={!okDiscord}
          label={t('discord')}
          labelExtra={
            <Toggle
              label={t('include field')}
              onChange={setHasDiscord}
              value={hasDiscord}
            />
          }
          onChange={setValDiscord}
          placeholder={t('YourDiscordHandle')}
          value={hasDiscord ? valDiscord : '<none>'}
        />
        {
          !isLegacyIdentity
            ? (
              <Input
                isDisabled={!hasMatrix}
                isError={!okMatrix}
                label={t('matrix name')}
                labelExtra={
                  <Toggle
                    label={t('include field')}
                    onChange={setHasMatrix}
                    value={hasMatrix}
                  />
                }
                maxLength={32}
                onChange={setValMatrix}
                placeholder={t('@yourname:matrix.org')}
                value={hasMatrix ? valMatrix : '<none>'}
              />
            )
            : (
              <Input
                isDisabled={!hasRiot}
                isError={!okRiot}
                label={t('riot name')}
                labelExtra={
                  <Toggle
                    label={t('include field')}
                    onChange={setHasRiot}
                    value={hasRiot}
                  />
                }
                maxLength={32}
                onChange={setValRiot}
                placeholder={t('@yourname:matrix.org')}
                value={hasRiot ? valRiot : '<none>'}
              />
            )
        }
        {
          !isLegacyIdentity
            ? (
              <Input
                isDisabled={!hasGithub}
                isError={!okGithub}
                label={t('Github name')}
                labelExtra={
                  <Toggle
                    label={t('include field')}
                    onChange={setHasGithub}
                    value={hasGithub}
                  />
                }
                maxLength={32}
                onChange={setValGithub}
                placeholder={t('YourGithubHandle')}
                value={hasGithub ? valGithub : '<none>'}
              />
            )
            : <div></div>
        }
        <InputBalance
          defaultValue={apiIdentity.consts.identity?.basicDeposit}
          isDisabled
          label={t('total deposit')}
        />
      </Modal.Content>
      <Modal.Actions>
        <TxButton
          accountId={address}
          icon={'trash-alt'}
          isDisabled={!enableIdentity || !gotPreviousIdentity}
          label={t('Clear Identity')}
          onStart={onClose}
          tx={apiIdentity.tx.identity.clearIdentity}
        />
        <TxButton
          accountId={address}
          isDisabled={!enableIdentity || !okAll}
          label={t('Set Identity')}
          onStart={onClose}
          params={[isLegacyIdentity ? legacyInfo : info]}
          tx={apiIdentity.tx.identity.setIdentity}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(IdentityMain);
