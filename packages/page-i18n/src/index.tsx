// Copyright 2017-2020 @polkadot/app-i18n authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps as Props } from '@polkadot/react-components/types';

import FileSaver from 'file-saver';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Columar, Column, Dropdown, Spinner } from '@polkadot/react-components';

import { useTranslation } from './translate';
import StringInput from './StringInput';

interface Option {
  text: string;
  value: string;
}

interface Defaults {
  english: StringsMod;
  keys: Option[];
  languages: Languages;
  modules: Option[];
}

type Progress = [[number, number], Record<string, [number, number]>];
type Strings = Record<string, string>;
type StringsMod = Record<string, Strings>;
type Languages = Record<string, Strings>;

async function retrieveJson (url: string): Promise<any> {
  const response = await fetch(url);

  return response.json();
}

async function retrieveEnglish (): Promise<StringsMod> {
  const paths: Array<string> = await retrieveJson('locales/en/index.json');
  const strings: Strings[] = await Promise.all(paths.map((path) => retrieveJson(`locales/en/${path}`)));

  return strings.reduce((language: StringsMod, strings, index): StringsMod => {
    language[paths[index]] = strings;

    return language;
  }, {});
}

async function retrieveLanguage (lng: string): Promise<Strings> {
  const paths: Array<string> = await retrieveJson(`locales/${lng}/index.json`);
  const translation: Strings = await retrieveJson(`locales/${lng}/translation.json`).catch(() => ({}));
  const modules: Strings[] = await Promise.all(paths.map((path) => retrieveJson(`locales/${lng}/${path}`)));

  modules.forEach((strings): void => {
    Object.keys(strings).forEach((key): void => {
      if (strings[key]) {
        translation[key] = strings[key];
      }
    });
  });

  return translation;
}

async function retrieveAll (): Promise<Defaults> {
  const _keys: string[] = await retrieveJson('locales/index.json');
  const keys = _keys.filter((key) => key !== 'en');
  const english = await retrieveEnglish();
  const languages = await Promise.all(keys.map(retrieveLanguage));

  return {
    english,
    keys: keys.map((text) => ({ text, value: text })),
    languages: languages.reduce((languages: Languages, strings, index): Languages => {
      languages[keys[index]] = strings;

      return languages;
    }, {}),
    modules: Object
      .keys(english)
      .map((text) => ({ text: text.replace('.json', '').replace('app-', 'page-'), value: text }))
      .sort((a, b) => a.text.localeCompare(b.text))
  };
}

function calcProgress (english: StringsMod, language: Strings): Progress {
  const breakdown: Record<string, [number, number]> = {};
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

    breakdown[record] = [mdone, mtotal];
  });

  return [[done, total], breakdown];
}

function doDownload (strings: Strings): void {
  const sanitized = Object.keys(strings).reduce((result: Strings, key): Strings => {
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

function progressDisplay ([done, total]: [number, number] = [0, 0]): { done: number; progress: string; total: number } {
  return {
    done,
    progress: (total ? (done * 100 / total) : 100).toFixed(2),
    total
  };
}

function TranslateApp ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [{ english, keys, languages, modules }, setDefaults] = useState<Defaults>({ english: {}, keys: [], languages: {}, modules: [] });
  const [lng, setLng] = useState<string>('zh');
  const [[modProgress, allProgress], setProgress] = useState<Progress>([[0, 0], {}]);
  const [record, setRecord] = useState<string>('app-accounts.json');
  const [strings, setStrings] = useState<Strings | null>(null);

  useEffect((): void => {
    retrieveAll().then(setDefaults);
  }, []);

  useEffect((): void => {
    setStrings(languages[lng]);
    setProgress(calcProgress(english, languages[lng]));
  }, [english, languages, lng]);

  const _setString = useCallback(
    (key: string, value: string): void => {
      setStrings((strings: Strings | null): Strings | null =>
        strings
          ? { ...strings, [key]: value }
          : null
      );

      const hasPrevVal = !!languages[lng][key];
      const sanitized = value.trim();

      languages[lng][key] = value;

      if (hasPrevVal !== !!sanitized) {
        setProgress(calcProgress(english, languages[lng]));
      }
    },
    [english, languages, lng]
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
            &nbsp;{t('{{done}}/{{total}}, {{progress}}% done', { replace: progressDisplay(modProgress) })}
          </Column>
          <Column>
            <Dropdown
              isFull
              label={t('the module to display strings for')}
              onChange={setRecord}
              options={modules}
              value={record}
            />
            &nbsp;{t('{{done}}/{{total}}, {{progress}}% done', { replace: progressDisplay(allProgress[record]) })}
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

export default React.memo(TranslateApp);
