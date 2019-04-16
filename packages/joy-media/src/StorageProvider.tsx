import React from 'react';
import { Message } from 'semantic-ui-react';

import { Bytes } from '@polkadot/types';
import { withCalls, withMulti } from '@polkadot/ui-api/with';

import { queryToProp, nonEmptyStr } from '@polkadot/joy-utils/index';
import { u8aToString } from '@polkadot/util';

function isEmptyText (bytes?: Bytes): boolean {
  return !bytes || (bytes.length === 1 && bytes[0] === 0);
}

export type StorageProviderSettings = {
  storageProviderAddress?: Bytes,
  storageProviderRepoId?: Bytes
};

export type StorageProvider = {
  address: string,
  repoId: string,
  buildApiUrl: (lastPart?: string) => string
};

export type StorageProviderProps = {
  storageProvider: StorageProvider
};

function newStorageProvider ({ storageProviderAddress, storageProviderRepoId }: StorageProviderSettings): StorageProvider | undefined {

  // TODO delete debugging console log
  console.log({ storageProviderAddress, storageProviderRepoId });

  if (!isEmptyText(storageProviderAddress)
    && !isEmptyText(storageProviderRepoId)
  ) {
    let address = u8aToString(storageProviderAddress);
    const repoId = u8aToString(storageProviderRepoId);
    if (nonEmptyStr(address) && nonEmptyStr(repoId)) {
      // Remove the last slash if it's present in the address:
      if (address.endsWith('/')) {
        address = address.substring(0, address.length - 1);
      }
      const buildApiUrl = (lastPart?: string): string => (
        `${address}/asset/v0/${repoId}/${lastPart || ''}`
      );
      return { address, repoId, buildApiUrl };
    }
  }

  return undefined;
}

function setStorageProvider<P extends StorageProviderProps> (Component: React.ComponentType<P>) {
  return class extends React.Component<P & StorageProviderSettings> {
    render () {
      const { storageProviderAddress, storageProviderRepoId } = this.props;
      const storageProvider = newStorageProvider(this.props);

      // TODO delete debugging console log
      console.log({ storageProvider });

      if (!storageProviderAddress && !storageProviderRepoId) {
        // Still loading a storage provider settings...
        return null;
      } else if (storageProvider) {
        return (
          <Component
            {...this.props}
            storageProvider={storageProvider}
          />
        );
      } else {
        return (
          <Message error className='JoyMainStatus'>
            <Message.Header>Storage provider not found</Message.Header>
            <div style={{ marginTop: '1rem' }}>
              This functionality cannot work properly without a storage provider.
            </div>
          </Message>
        );
      }
    }
  };
}

const loadStorageProviderSettings = withCalls<StorageProviderSettings>(
  queryToProp('query.dataDirectory.storageProviderAddress',
    { propName: 'storageProviderAddress' }),
  queryToProp('query.dataDirectory.storageProviderRepoId',
    { propName: 'storageProviderRepoId' })
);

export function withStorageProvider<P extends StorageProviderProps> (Component: React.ComponentType<P>) {
  return withMulti(
    Component,
    loadStorageProviderSettings,
    setStorageProvider
  );
}
