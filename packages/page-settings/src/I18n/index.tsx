// Copyright 2017-2020 @polkadot/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import FileSaver from 'file-saver';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, Columar, Column, Dropdown, Progress, Spinner } from '@polkadot/react-components';
import languageCache from '@polkadot/react-components/i18n/cache';
import uiSettings from '@polkadot/ui-settings';

import { useTranslation } from '../translate';
import StringInput from './StringInput';

interface Props {
  className?: string;
}

interface Option {
  text: string;
  value: string;
}

interface Defaults {
  english: StringsMod;
  keys: Option[];
  modules: Option[];
}

type Progress = [[number, number, number], Record<string, [number, number, number]>];
type Strings = Record<string, string>;
type StringsMod = Record<string, Strings>;

async function retrieveJson (url: string): Promise<any> {
  const response = await fetch(`locales/${url}`);

  return response.json();
}

async function retrieveEnglish (): Promise<StringsMod> {
  const paths: Array<string> = await retrieveJson('en/index.json');
  const strings: Strings[] = await Promise.all(paths.map((path) => retrieveJson(`en/${path}`)));

  return strings.reduce((language: StringsMod, strings, index): StringsMod => {
    language[paths[index]] = strings;

    return language;
  }, {});
}

async function retrieveAll (): Promise<Defaults> {
  const _keys: string[] = await retrieveJson('index.json');
  const keys = _keys.filter((lng) => lng !== 'en');
  const missing = keys.filter((lng) => !languageCache[lng]);
  const english = await retrieveEnglish();
  const translations = missing.length
    ? await Promise.all(missing.map((lng) => retrieveJson(`${lng}/translation.json`)))
    : [];

  missing.forEach((lng, index): void => {
    languageCache[lng] = translations[index];
  });

  return {
    english,
    keys: keys.map((text) => ({ text, value: text })),
    modules: Object
      .keys(english)
      .map((text) => ({ text: text.replace('.json', '').replace('app-', 'page-'), value: text }))
      .sort((a, b) => a.text.localeCompare(b.text))
  };
}

function calcProgress (english: StringsMod, language: Strings): Progress {
  const breakdown: Record<string, [number, number, number]> = {};
  let done = 0;
  let total = 0;

  Object.keys(english).forEach((record): void => {
    const mod = english[record];
    const mtotal = Object.keys(mod).length;
    let mdone = 0;

    Object.keys(mod).forEach((key): void => {
      if (language[key]) {
        mdone++;
      }
    });

    done += mdone;
    total += mtotal;

    breakdown[record] = [mdone, mtotal, 0];
  });

  return [[done, total, 0], breakdown];
}

function doDownload (strings: Strings): void {
  const sanitized = Object.keys(strings).sort().reduce((result: Strings, key): Strings => {
    const sanitized = strings[key].trim();

    if (sanitized) {
      result[key] = sanitized;
    }

    return result;
  }, {});

  FileSaver.saveAs(
    new Blob([JSON.stringify(sanitized, null, 2)], { type: 'application/json; charset=utf-8' }),
    'translation.json'
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function progressDisplay ([done, total, _]: [number, number, number] = [0, 0, 0]): { done: number; progress: string; total: number } {
  return {
    done,
    progress: (total ? (done * 100 / total) : 100).toFixed(2),
    total
  };
}

function Translate ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [{ english, keys, modules }, setDefaults] = useState<Defaults>({ english: {}, keys: [], modules: [] });
  const [lng, setLng] = useState<string>('zh');
  const [[modProgress, allProgress], setProgress] = useState<Progress>([[0, 0, 0], {}]);
  const [record, setRecord] = useState<string>('app-accounts.json');
  const [strings, setStrings] = useState<Strings | null>(null);

  useEffect((): void => {
    retrieveAll().then(setDefaults);
  }, []);

  useEffect((): void => {
    setStrings(languageCache[lng]);
    setProgress(calcProgress(english, languageCache[lng]));
  }, [english, lng]);

  useEffect((): void => {
    setLng(
      keys.some(({ value }) => value === uiSettings.i18nLang)
        ? uiSettings.i18nLang
        : 'zh'
    );
  }, [keys]);

  const _setString = useCallback(
    (key: string, value: string): void => {
      setStrings((strings: Strings | null): Strings | null =>
        strings
          ? { ...strings, [key]: value }
          : null
      );

      const hasPrevVal = !!languageCache[lng][key];
      const sanitized = value.trim();

      languageCache[lng][key] = value;

      if (hasPrevVal !== !!sanitized) {
        const [progress, breakdown] = calcProgress(english, languageCache[lng]);

        setProgress(([counters]): Progress => {
          progress[2] = Math.max(0, progress[0] - counters[0]);

          return [progress, breakdown];
        });
      }
    },
    [english, lng]
  );

  const _onDownload = useCallback(
    () => doDownload(strings || {}),
    [strings]
  );

  if (!keys.length) {
    return <Spinner />;
  }

  return (
    <main className={className}>
      <header>
        <Columar>
          <Column>
            <Dropdown
              isFull
              label={t('the language to display translations for')}
              onChange={setLng}
              options={keys}
              value={lng}
            />
            <Progress
              color='auto'
              total={modProgress[1]}
              value={modProgress[0]}
            />
            {t('{{done}}/{{total}}, {{progress}}% done', { replace: progressDisplay(modProgress) })}
          </Column>
          <Column>
            <Dropdown
              isFull
              label={t('the module to display strings for')}
              onChange={setRecord}
              options={modules}
              value={record}
            />
            <Progress
              color='auto'
              total={allProgress[record]?.[1]}
              value={allProgress[record]?.[0]}
            />
            {t('{{done}}/{{total}}, {{progress}}% done', { replace: progressDisplay(allProgress[record]) })}
          </Column>
        </Columar>
      </header>
      <Button.Group>
        <Button
          icon='download'
          label={t('Generate {{lng}}/translation.json', { replace: { lng } })}
          onClick={_onDownload}
        />
      </Button.Group>
      {record && strings && Object.keys(english[record]).map((key, index) =>
        <StringInput
          key={index}
          onChange={_setString}
          original={english[record][key]}
          tkey={key}
          tval={strings[key] || ''}
        />
      )}
    </main>
  );
}

export default React.memo(styled(Translate)`
  .ui.progress:last-child {
    margin: 0.25rem;
  }
`);
