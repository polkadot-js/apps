// https://www.typescriptlang.org/docs/handbook/namespaces-and-modules.html
declare module 'file-saver' {
  export function saveAs(blob: Blob, filename: string): any;
}
