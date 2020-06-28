// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Registration } from '@polkadot/types/interfaces';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Input, Modal, Toggle, TxButton } from '@polkadot/react-components';
import { getAddressMeta } from '@polkadot/react-components/util';
import { useApi, useCall } from '@polkadot/react-hooks';
import { Data, Option } from '@polkadot/types';
import { u8aToString } from '@polkadot/util';

import { useTranslation } from '../../translate';

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
        className='toggle-Toggle'
        label={t<string>('include field')}
        onChange={onChange}
        value={value}
      />
    </div>
  );
}

function checkValue (hasValue: boolean, value: string | null | undefined, minLength: number, includes: string[], starting: string[]): boolean {
  return !hasValue || (
    !!value &&
    (value.length >= minLength) &&
    includes.reduce((hasIncludes: boolean, check) => hasIncludes && value.includes(check), true) &&
    starting.reduce((hasStarting: boolean, check) => hasStarting || value.startsWith(check), starting.length === 0)
  );
}

function Identity ({ address, className = '', onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const identityOpt = useCall<Option<Registration>>(api.query.identity.identityOf, [address]);
  const [{ info, okAll, okDisplay, okEmail, okLegal, okRiot, okTwitter, okWeb }, setInfo] = useState<ValueState>({ info: {}, okAll: false });
  const [hasEmail, setHasEmail] = useState(false);
  // const [hasImg, setHasImg] = useState(false);
  const [hasLegal, setHasLegal] = useState(false);
  // const [hasPgp, setHasPgp] = useState(false);
  const [hasRiot, setHasRiot] = useState(false);
  const [hasTwitter, setHasTwitter] = useState(false);
  const [hasWeb, setHasWeb] = useState(false);
  const [valDisplay, setValDisplay] = useState(getAddressMeta(address).name || '');
  const [valEmail, setValEmail] = useState('');
  // const [{ errImg, valImg }, setValImg] = useState<{ errImg: boolean; valImg: string }>({ errImg: true, valImg: '' });
  const [valLegal, setValLegal] = useState('');
  // const [{ errPgp, valPgp }, setValPgp] = useState<{ errPgp: boolean; valPgp: string }>({ errPgp: true, valPgp: '' });
  const [valRiot, setValRiot] = useState('');
  const [valTwitter, setValTwitter] = useState('');
  const [valWeb, setValWeb] = useState('');

  useEffect((): void => {
    if (identityOpt && identityOpt.isSome) {
      const { info } = identityOpt.unwrap();

      setData(info.display, null, setValDisplay);
      setData(info.email, setHasEmail, setValEmail);
      setData(info.legal, setHasLegal, setValLegal);
      setData(info.riot, setHasRiot, setValRiot);
      setData(info.twitter, setHasTwitter, setValTwitter);
      setData(info.web, setHasWeb, setValWeb);
    }
  }, [identityOpt]);

  useEffect((): void => {
    const okDisplay = checkValue(true, valDisplay, 1, [], []);
    const okEmail = checkValue(hasEmail, valEmail, 3, ['@'], []);
    const okLegal = checkValue(hasLegal, valLegal, 1, [], []);
    const okRiot = checkValue(hasRiot, valRiot, 6, [':'], ['@', '~']);
    const okTwitter = checkValue(hasTwitter, valTwitter, 3, [], ['@']);
    const okWeb = checkValue(hasWeb, valWeb, 8, ['.'], ['https://', 'http://']);

    setInfo({
      info: {
        display: { [okDisplay ? 'raw' : 'none']: valDisplay || null },
        email: { [okEmail ? 'raw' : 'none']: hasEmail ? valEmail : null },
        legal: { [okLegal ? 'raw' : 'none']: hasLegal ? valLegal : null },
        riot: { [okRiot ? 'raw' : 'none']: hasRiot ? valRiot : null },
        twitter: { [okTwitter ? 'raw' : 'none']: hasTwitter ? valTwitter : null },
        web: { [okWeb ? 'raw' : 'none']: hasWeb ? valWeb : null }
        // image: { [hasImg ? 'sha256' : 'none']: hasImg ? valImg : null },
        // pgpFingerprint: hasPgp ? valPgp : null
      },
      okAll: okDisplay && okEmail && okLegal && okRiot && okTwitter && okWeb,
      okDisplay,
      okEmail,
      okLegal,
      okRiot,
      okTwitter,
      okWeb
    });
    //  errImg, errPgp, hasImg, hasPgp, valImg, valPgp,
  }, [hasEmail, hasLegal, hasRiot, hasTwitter, hasWeb, valDisplay, valEmail, valLegal, valRiot, valTwitter, valWeb]);

  return (
    <Modal
      className={className}
      header={t<string>('Register identity')}
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
        {/* <WrapToggle
          onChange={setHasImg}
          value={hasImg}
        >
          <Input
            isDisabled={!hasImg}
            isError={hasImg && errImg}
            label={t<string>('sha2 image hash')}
            onChange={_onChangeImg}
            placeholder={t<string>('0x...')}
            maxLength={66}
            value={hasImg ? valImg : '<none>'}
          />
        </WrapToggle>
        <WrapToggle
          onChange={setHasPgp}
          value={hasPgp}
        >
          <Input
            isDisabled={!hasPgp}
            isError={hasPgp && errPgp}
            label={t<string>('pgp hash')}
            onChange={_onChangePgp}
            placeholder={t<string>('0x...')}
            maxLength={42}
            value={hasPgp ? valPgp : '<none>'}
          />
        </WrapToggle> */}
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={address}
          isDisabled={!okAll}
          isPrimary
          label={t<string>('Set Identity')}
          onStart={onClose}
          params={[info]}
          tx='identity.setIdentity'
        />
      </Modal.Actions>
    </Modal>
  );
}

export default styled(Identity)`
  .toggle-Wrap {
    position: relative;

    .toggle-Toggle {
      position: absolute;
      right: 3.5rem;
      bottom: 1.375rem;
    }
  }
`;
