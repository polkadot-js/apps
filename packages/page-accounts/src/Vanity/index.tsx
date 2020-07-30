// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ActionStatus } from '@polkadot/react-components/Status/types';
import { KeypairType } from '@polkadot/util-crypto/types';
import { GeneratorMatches, GeneratorMatch, GeneratorResult } from '@polkadot/vanitygen/types';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { Button, Dropdown, Input, Table } from '@polkadot/react-components';
import { useIsMountedRef } from '@polkadot/react-hooks';
import uiSettings from '@polkadot/ui-settings';
import generator from '@polkadot/vanitygen/generator';
import matchRegex from '@polkadot/vanitygen/regex';
import generatorSort from '@polkadot/vanitygen/sort';

import CreateModal from '../Accounts/modals/Create';
import { useTranslation } from '../translate';
import Match from './Match';

interface Props {
  className?: string;
  onStatusChange: (status: ActionStatus) => void;
}

interface Match {
  isMatchValid: boolean;
  match: string;
}

interface Results {
  elapsed: number;
  isRunning: boolean;
  keyCount: number;
  keyTime: number;
  matches: GeneratorMatches;
  startAt: number;
}

const DEFAULT_MATCH = 'Some';
const BOOL_OPTIONS = [
  { text: 'No', value: false },
  { text: 'Yes', value: true }
];

function VanityApp ({ className = '', onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const results = useRef<GeneratorResult[]>([]);
  const runningRef = useRef(false);
  const mountedRef = useIsMountedRef();
  const [createSeed, setCreateSeed] = useState<string | null>(null);
  const [{ elapsed, isRunning, keyCount, matches }, setResults] = useState<Results>({
    elapsed: 0,
    isRunning: false,
    keyCount: -1,
    keyTime: 0,
    matches: [],
    startAt: 0
  });
  const [{ isMatchValid, match }, setMatch] = useState<Match>({ isMatchValid: true, match: DEFAULT_MATCH });
  const [type, setType] = useState<KeypairType>('ed25519');
  const [withCase, setWithCase] = useState(true);

  const _clearSeed = useCallback(
    () => setCreateSeed(null),
    []
  );

  const _checkMatches = useCallback(
    (): void => {
      const checks = results.current;

      results.current = [];

      if (checks.length === 0 || !mountedRef.current) {
        return;
      }

      setResults(
        ({ isRunning, keyCount, keyTime, matches, startAt }: Results): Results => {
          let newKeyCount = keyCount;
          let newKeyTime = keyTime;
          const newMatches = checks.reduce((result, { elapsed, found }): GeneratorMatch[] => {
            newKeyCount += found.length;
            newKeyTime += elapsed;

            return result.concat(found);
          }, matches);

          return {
            elapsed: Date.now() - startAt,
            isRunning,
            keyCount: newKeyCount,
            keyTime: newKeyTime,
            matches: newMatches.sort(generatorSort).slice(0, 25),
            startAt
          };
        }
      );
    },
    [mountedRef]
  );

  const _executeGeneration = useCallback(
    (): void => {
      if (!runningRef.current) {
        return _checkMatches();
      }

      setTimeout((): void => {
        if (mountedRef.current) {
          if (results.current.length === 25) {
            _checkMatches();
          }

          results.current.push(
            generator({ match, runs: 10, type, withCase, withHex: true })
          );

          _executeGeneration();
        }
      }, 0);
    },
    [_checkMatches, match, mountedRef, runningRef, type, withCase]
  );

  const _onChangeMatch = useCallback(
    (match: string): void => setMatch({
      isMatchValid:
        matchRegex.test(match) &&
        (match.length !== 0) &&
        (match.length < 31),
      match
    }),
    []
  );

  const _onRemove = useCallback(
    (address: string): void => setResults(
      (results: Results): Results => ({
        ...results,
        matches: results.matches.filter((item) => item.address !== address)
      })
    ),
    []
  );

  const _toggleStart = useCallback(
    (): void => setResults(
      ({ elapsed, isRunning, keyCount, keyTime, matches, startAt }: Results): Results => ({
        elapsed,
        isRunning: !isRunning,
        keyCount: isRunning ? keyCount : 0,
        keyTime: isRunning ? keyTime : 0,
        matches,
        startAt: isRunning ? startAt : Date.now()
      })
    ),
    []
  );

  useEffect((): void => {
    runningRef.current = isRunning;

    if (isRunning) {
      _executeGeneration();
    }
  }, [_executeGeneration, isRunning]);

  const header = useMemo(() => [
    [t('matches'), 'start', 2],
    [t('Evaluated {{count}} keys in {{elapsed}}s ({{avg}} keys/s)', {
      replace: {
        avg: (keyCount / (elapsed / 1000)).toFixed(3),
        count: keyCount,
        elapsed: (elapsed / 1000).toFixed(2)
      }
    }), 'start'],
    [t('secret'), 'start'],
    []
  ], [elapsed, keyCount, t]);

  return (
    <div className={className}>
      <div className='ui--row'>
        <Input
          autoFocus
          className='medium'
          help={t<string>('Type here what you would like your address to contain. This tool will generate the keys and show the associated addresses that best match your search. You can use "?" as a wildcard for a character.')}
          isDisabled={isRunning}
          isError={!isMatchValid}
          label={t<string>('Search for')}
          onChange={_onChangeMatch}
          onEnter={_toggleStart}
          value={match}
        />
        <Dropdown
          className='medium'
          help={t<string>('Should the search be case sensitive, e.g if you select "no" your search for "Some" may return addresses containing "somE" or "sOme"...')}
          isDisabled={isRunning}
          label={t<string>('case sensitive')}
          onChange={setWithCase}
          options={BOOL_OPTIONS}
          value={withCase}
        />
      </div>
      <div className='ui--row'>
        <Dropdown
          className='medium'
          defaultValue={type}
          help={t<string>('Determines what cryptography will be used to create this account. Note that to validate on Polkadot, the session account must use "ed25519".')}
          label={t<string>('keypair crypto type')}
          onChange={setType}
          options={uiSettings.availableCryptos}
        />
      </div>
      <Button.Group>
        <Button
          icon={
            isRunning
              ? 'stop'
              : 'sign-in-alt'
          }
          isDisabled={!isMatchValid}
          label={
            isRunning
              ? t<string>('Stop generation')
              : t<string>('Start generation')
          }
          onClick={_toggleStart}
        />
      </Button.Group>
      {matches.length !== 0 && (
        <Table
          className='vanity--App-matches'
          empty={t<string>('No matches found')}
          header={header}
        >
          {matches.map((match): React.ReactNode => (
            <Match
              {...match}
              key={match.address}
              onCreateToggle={setCreateSeed}
              onRemove={_onRemove}
            />
          ))}
        </Table>
      )}
      {createSeed && (
        <CreateModal
          onClose={_clearSeed}
          onStatusChange={onStatusChange}
          seed={createSeed}
          type={type}
        />
      )}
    </div>
  );
}

export default React.memo(styled(VanityApp)`
  .vanity--App-matches {
    overflow-x: auto;
    padding: 1em 0;
  }

  .vanity--App-stats {
    padding: 1em 0 0 0;
    opacity: 0.45;
    text-align: center;
  }
`);
