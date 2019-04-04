import { queryToProp } from '@polkadot/joy-utils/index';

export const queryMediaToProp = (storageItem: string, paramName?: string) => {
  return queryToProp(`query.media.${storageItem}`, paramName);
};

// TODO get storage node address from blockchain:
const STORAGE_NODE_ADDRESS = `http://localhost:4000`;

const API_BASE_URL = `asset/v0`;

// TODO get repo ID from blockchain:
const REPO_ID = 'a8cfd711-5b1b-58d4-ab42-90bb373aef06';

export function buildApiUrl (lastPart?: string) {
  return `${STORAGE_NODE_ADDRESS}/${API_BASE_URL}/${REPO_ID}/${lastPart || ''}`;
}

export type Asset = {
  name: string,
  size: number
};

import { lookup } from 'mime-types';

export type FileMeta = {
  mime?: string,
  isAudio?: boolean,
  isVideo?: boolean,
  isImage?: boolean
};

export function fileMetaByExt (fileName: string): FileMeta {
  const mime = lookup(fileName);
  if (mime) {
    const prefix = mime.substring(0, mime.indexOf('/'));
    return {
      mime,
      isAudio: prefix === 'audio',
      isVideo: prefix === 'video',
      isImage: prefix === 'image'
    };
  } else {
    return {};
  }
}

export function fileNameWoExt (fileName: string): string {
  const lastDotIdx = fileName.lastIndexOf('.');
  return fileName.substring(0, lastDotIdx);
}
