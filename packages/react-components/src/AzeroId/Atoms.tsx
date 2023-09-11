// Copyright 2017-2023 @polkadot/app-storage authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SupportedChainId } from '@azns/resolver-core';
import React, { useCallback, useId } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import { externalAzeroIdLogoBlackSVG, externalAzeroIdLogoGreySVG, externalAzeroIdLogoPrimarySVG } from '@polkadot/apps-config/ui/logos/external';
import { useQueue, useTheme } from '@polkadot/react-hooks';

import Icon from '../Icon.js';
import { styled } from '../styled.js';
import Tooltip from '../Tooltip.js';
import { useTranslation } from '../translate.js';

type AzeroIdInteractiveDomainProps = {
  className?: string;
  domain: string;
  chainId: SupportedChainId.AlephZero | SupportedChainId.AlephZeroTestnet;
};

export const AzeroIdInteractiveDomain = ({ chainId, className, domain }: AzeroIdInteractiveDomainProps) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const { queueAction } = useQueue();

  const tooltipId = useId();

  const onCopy = useCallback(
    () => queueAction({
      action: t<string>('clipboard'),
      message: t<string>('domain copied'),
      status: 'queued'
    }),
    [queueAction, t]
  );

  const href = {
    [SupportedChainId.AlephZero]: `https://azero.id/id/${domain}`,
    [SupportedChainId.AlephZeroTestnet]: `https://tzero.id/id/${domain}`
  }[chainId];

  return (
    <Container
      className={className}
    >
      <StyledLink
        href={href}
        rel='noreferrer'
        target='_blank'
      >
        <Logo
          data-for={tooltipId}
          data-tip={true}
          src={theme.theme === 'dark' ? externalAzeroIdLogoPrimarySVG : externalAzeroIdLogoBlackSVG}
        />
        <Tooltip
          className='accounts-badge'
          text={<div>{t('AZERO.ID Primary Domain')}</div>}
          trigger={tooltipId}
        />
      </StyledLink>
      <CopyToClipboard
        onCopy={onCopy}
        text={domain}
      >
        <ClickableText
          type='button'
        >
          <AzeroIdDomain
            domain={domain}
            isCopyShown
            isLogoShown={false}
          />
        </ClickableText>
      </CopyToClipboard>
    </Container>
  );
};

type AzeroIdDomainProps = {
  className?: string;
  domain: string;
  isLogoShown?: boolean;
  isCopyShown?: boolean;
};

export const AzeroIdDomain = ({ className, domain, isCopyShown = false, isLogoShown = true }: AzeroIdDomainProps) => {
  const theme = useTheme();

  return (
    <DomainContainer className={className}>
      {isLogoShown && (
        <Logo
          src={theme.theme === 'dark' ? externalAzeroIdLogoPrimarySVG : externalAzeroIdLogoBlackSVG}
        />
      )}
      <span>
        {domain.split(/(?=\.)/).map((domainPart, index) => <span key={index}>{domainPart}<wbr /></span>)}
        {isCopyShown && <SmallIcon icon='copy' />}
      </span>
    </DomainContainer>
  );
};

const REGISTER_LINKS = {
  [SupportedChainId.AlephZero]: 'https://azero.id/',
  [SupportedChainId.AlephZeroTestnet]: 'https://tzero.id/'
} as const;

type AzeroIdRegisterLinkProps = {
  className?: string;
  chainId: keyof typeof REGISTER_LINKS;
};

export const AzeroIdRegisterLink = ({ chainId, className }: AzeroIdRegisterLinkProps) => {
  const { t } = useTranslation();

  return (
    <Container className={className}>
      <StyledLink
        href={REGISTER_LINKS[chainId]}
        rel='noreferrer'
        target='_blank'
      >
        <Logo
          data-tip={true}
          src={externalAzeroIdLogoGreySVG}
        />
        {t('Register on-chain domain')}
      </StyledLink>
    </Container>
  );
};

export const AzeroIdPlaceholder = ({ className = '' }: {className?: string}) => (
  <Placeholder className={`--tmp ${className}`} />
);

export const AZERO_ID_ROW_HEIGHT = '16px';

const Placeholder = styled.p`
  width: 160px;
  height: ${AZERO_ID_ROW_HEIGHT};
`;

const Container = styled.p`
  display: flex;
  align-items: center;

  margin: 0;

  color: #8B8B8B;
  font-size: var(--font-size-small);
`;

const StyledLink = styled.a`
  display: flex;
  align-items: center;
`;

const Logo = styled.img`
  width: 16px;
  height: ${AZERO_ID_ROW_HEIGHT};
  margin-right: 5px;
`;

const ClickableText = styled.button`
  text-align: left;
  background-color: inherit;
  color: inherit;
  padding: 0;
  border: unset;


  cursor: copy;
`;

const DomainContainer = styled.div`
  word-break: break-word;

  display: flex;
  align-items: center;
`;

const SmallIcon = styled(Icon)`
  width: 10px;
  height: 10px;

  margin-left: 5px;
`;
