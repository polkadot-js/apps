// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { IconName } from '@fortawesome/fontawesome-svg-core';
import type { Text } from '@polkadot/types';

import React, { useMemo } from 'react';
import styled from 'styled-components';

import { LabelHelp } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

import Icon from './Icon';
import { useTranslation } from './translate';

interface Meta {
  docs: Text[];
}

export interface Props {
  children?: React.ReactNode;
  className?: string;
  help?: string;
  helpIcon?: IconName;
  isOpen?: boolean;
  isPadded?: boolean;
  onClick?: (isOpen: boolean) => void;
  renderChildren?: () => React.ReactNode;
  summary?: React.ReactNode;
  summaryHead?: React.ReactNode;
  summaryMeta?: Meta;
  summarySub?: React.ReactNode;
  withBreaks?: boolean;
  withHidden?: boolean;
}

function splitSingle (value: string[], sep: string): string[] {
  return value.reduce((result: string[], value: string): string[] => {
    return value.split(sep).reduce((result: string[], value: string) => result.concat(value), result);
  }, []);
}

function splitParts (value: string): string[] {
  return ['[', ']'].reduce((result: string[], sep) => splitSingle(result, sep), [value]);
}

function formatMeta (meta?: Meta): React.ReactNode | null {
  if (!meta || !meta.docs.length) {
    return null;
  }

  const strings = meta.docs.map((d) => d.toString().trim());
  const firstEmpty = strings.findIndex((d) => !d.length);
  const combined = (
    firstEmpty === -1
      ? strings
      : strings.slice(0, firstEmpty)
  ).join(' ').replace(/#(<weight>| <weight>).*<\/weight>/, '');
  const parts = splitParts(combined.replace(/\\/g, '').replace(/`/g, ''));

  return <>{parts.map((part, index) => index % 2 ? <em key={index}>[{part}]</em> : <span key={index}>{part}</span>)}&nbsp;</>;
}

function Expander ({ children, className = '', help, helpIcon, isOpen, isPadded, onClick, renderChildren, summary, summaryHead, summaryMeta, summarySub, withBreaks, withHidden }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isExpanded, toggleExpanded] = useToggle(isOpen, onClick);

  const demandChildren = useMemo(
    () => isExpanded && renderChildren && renderChildren(),
    [isExpanded, renderChildren]
  );

  const headerMain = useMemo(
    () => summary || formatMeta(summaryMeta),
    [summary, summaryMeta]
  );

  const headerSub = useMemo(
    () => summary ? (formatMeta(summaryMeta) || summarySub) : null,
    [summary, summaryMeta, summarySub]
  );

  const hasContent = useMemo(
    () => !!renderChildren || (!!children && (!Array.isArray(children) || children.length !== 0)),
    [children, renderChildren]
  );

  return (
    <div className={`ui--Expander${isExpanded ? ' isExpanded' : ''}${isPadded ? ' isPadded' : ''}${hasContent ? ' hasContent' : ''}${withBreaks ? ' withBreaks' : ''} ${className}`}>
      <div
        className='ui--Expander-summary'
        onClick={toggleExpanded}
      >
        <div className='ui--Expander-summary-header'>
          {help && (
            <LabelHelp
              help={help}
              icon={helpIcon}
            />
          )}
          {summaryHead}
          {headerMain || t<string>('Details')}
          {headerSub && (
            <div className='ui--Expander-summary-header-sub'>{headerSub}</div>
          )}
        </div>
        <Icon
          color={hasContent ? undefined : 'transparent'}
          icon={
            isExpanded
              ? 'caret-up'
              : 'caret-down'
          }
        />
      </div>
      {hasContent && (isExpanded || withHidden) && (
        <div className='ui--Expander-content'>{children || demandChildren}</div>
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

  &.withBreaks .ui--Expander-content {
    white-space: normal;
  }

  .ui--Expander-summary {
    margin: 0;
    min-width: 13.5rem;
    overflow: hidden;

    .ui--Expander-summary-header {
      display: inline-block;
      max-width: calc(100% - 2rem);
      overflow: hidden;
      text-overflow: ellipsis;
      vertical-align: middle;
      white-space: nowrap;

      span {
        white-space: normal;
      }
    }

    .ui--Icon {
      margin-left: 0.75rem;
      vertical-align: middle;
    }

    .ui--LabelHelp {
      .ui--Icon {
        margin-left: 0;
        margin-right: 0.5rem;
        vertical-align: text-bottom;
      }
    }

    .ui--Expander-summary-header-sub {
      font-size: 1rem;
      opacity: 0.6;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`);
