// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useToggle } from '@polkadot/react-hooks';
import { Text } from '@polkadot/types';

import { useTranslation } from './translate';
import Icon from './Icon';

interface Meta {
  documentation: Text[];
}

export interface Props extends BareProps {
  children?: React.ReactNode;
  isOpen?: boolean;
  summary?: React.ReactNode;
  summaryMeta?: Meta;
  withDot?: boolean;
  withHidden?: boolean;
}

function formatMeta (meta?: Meta): React.ReactNode | null {
  if (!meta || !meta.documentation.length) {
    return null;
  }

  const strings = meta.documentation.map((doc): string => doc.toString().trim());
  const firstEmpty = strings.findIndex((doc): boolean => !doc.length);

  return firstEmpty === -1
    ? strings.join(' ')
    : strings.slice(0, firstEmpty).join(' ');
}

function Expander ({ children, className, isOpen, summary, summaryMeta, withDot, withHidden }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isExpanded, toggleExpanded] = useToggle(isOpen);
  const headerMain = useMemo(
    () => summary || formatMeta(summaryMeta),
    [summary, summaryMeta]
  );
  const headerSub = useMemo(
    () => summary ? formatMeta(summaryMeta) : null,
    [summary, summaryMeta]
  );
  const hasContent = useMemo(
    (): boolean => !!children && (!Array.isArray(children) || children.length !== 0),
    [children]
  );

  return (
    <div className={`ui--Expander ${isExpanded && 'isExpanded'} ${hasContent && 'hasContent'} ${className}`}>
      <div
        className='ui--Expander-summary'
        onClick={toggleExpanded}
      >
        <div className='ui--Expander-summary-header'>
          {hasContent
            ? <Icon name={isExpanded ? 'angle double down' : 'angle double right'} />
            : withDot
              ? <Icon name='circle outline' />
              : undefined
          }{headerMain || t('Details')}
        </div>
        {headerSub && (
          <div className='ui--Expander-summary-sub'>{headerSub}</div>
        )}
      </div>
      {hasContent && (isExpanded || withHidden) && (
        <div className='ui--Expander-contents'>{children}</div>
      )}
    </div>
  );
}

export default React.memo(styled(Expander)`
  &:not(.isExpanded) .ui--Expander-contents {
    display: none;
  }

  &.isExpanded .ui--Expander-contents {
    margin-top: 0.5rem;
  }

  &.hasContent .ui--Expander-summary {
    cursor: pointer;
  }

  .ui--Expander-summary {
    display: block;
    margin: 0;
    min-width: 12rem;
    overflow: hidden;
    white-space: nowrap;

    > div {
      overflow: hidden;
      text-overflow: ellipsis;
    }

    i.icon {
      margin-right: 0.5rem;
    }

    .ui--Expander-summary-sub {
      font-size: 1rem;
      opacity: 0.6;
      padding-left: 1.75rem;
    }
  }
`);
