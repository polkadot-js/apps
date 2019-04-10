import { queryToProp } from '@polkadot/joy-utils/index';

export const queryMediaToProp = (storageItem: string, paramName?: string) => {
  return queryToProp(`query.media.${storageItem}`, paramName);
};

// TODO get storage node address from blockchain:
const STORAGE_NODE_ADDRESS = `http://localhost:4000`;

const API_BASE_URL = `asset/v0`;

// TODO get repo ID from blockchain:
const REPO_ID = 'b36d252f-78c6-5851-984d-744b335eafcf';

export function buildApiUrl (lastPart?: string) {
  return `${STORAGE_NODE_ADDRESS}/${API_BASE_URL}/${REPO_ID}/${lastPart || ''}`;
}

export type Asset = {
  name: string,
  size: number
};

export function fileNameWoExt (fileName: string): string {
  const lastDotIdx = fileName.lastIndexOf('.');
  return fileName.substring(0, lastDotIdx);
}
