// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useMemo } from 'react';
import styled from 'styled-components';
import { LabelHelp } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';
import { Text } from '@polkadot/types';

import { useTranslation } from './translate';
import Icon from './Icon';

interface Meta {
  documentation: Text[];
}

export interface Props {
  children?: React.ReactNode;
  className?: string;
  help?: string;
  isOpen?: boolean;
  isPadded?: boolean;
  summary?: React.ReactNode;
  summaryMeta?: Meta;
  summarySub?: React.ReactNode;
  withDot?: boolean;
  withHidden?: boolean;
}

function formatMeta (meta?: Meta): React.ReactNode | null {
  if (!meta || !meta.documentation.length) {
    return null;
  }

  const strings = meta.documentation.map((doc) => doc.toString().trim());
  const firstEmpty = strings.findIndex((doc) => !doc.length);

  return (
    firstEmpty === -1
      ? strings
      : strings.slice(0, firstEmpty)
  ).join(' ');
}

function Expander ({ children, className = '', help, isOpen, isPadded, summary, summaryMeta, summarySub, withDot, withHidden }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isExpanded, toggleExpanded] = useToggle(isOpen);
  const headerMain = useMemo(
    () => summary || formatMeta(summaryMeta),
    [summary, summaryMeta]
  );
  const headerSub = useMemo(
    () => summary ? (formatMeta(summaryMeta) || summarySub) : null,
    [summary, summaryMeta, summarySub]
  );
  const hasContent = useMemo(
    () => !!children && (!Array.isArray(children) || children.length !== 0),
    [children]
  );

  return (
    <div className={`ui--Expander${isExpanded ? ' isExpanded' : ''}${isPadded ? ' isPadded' : ''}${hasContent ? ' hasContent' : ''} ${className}`}>
      <div
        className='ui--Expander-summary'
        onClick={toggleExpanded}
      >
        <div className='ui--Expander-summary-header'>
          {help && <LabelHelp help={help}/>}
          {hasContent
            ? <Icon icon={isExpanded ? 'angle-double-down' : 'angle-double-right'} />
            : withDot
              ? <Icon icon='circle' />
              : undefined
          }{headerMain || t<string>('Details')}
        </div>
        {headerSub && (
          <div className='ui--Expander-summary-sub'>{headerSub}</div>
        )}
      </div>
      {hasContent && (isExpanded || withHidden) && (
        <div className='ui--Expander-content'>{children}</div>
      )}
    </div>
  );
}

export default React.memo(styled(Expander)`
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;

  &:not(.isExpanded) .ui--Expander-content {
    display: none;
  }

  &.isExpanded .ui--Expander-content {
    margin-top: 0.5rem;

    .body.column {
      justify-content: end;
    }
  }

  &.hasContent .ui--Expander-summary {
    cursor: pointer;
  }

  &.isPadded {
    .ui--Expander-summary {
      margin-left: 2.25rem;
    }
  }

  .ui--Expander-summary {
    margin: 0;
    min-width: 13.5rem;
    overflow: hidden;

    .ui--Expander-summary-header > .ui--FormatBalance {
      min-width: 11rem;
    }

    > div {
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .ui--Icon {
      margin-right: 0.5rem;
    }

    .ui--Expander-summary-sub {
      font-size: 1rem;
      opacity: 0.6;
    }
  }
`);
