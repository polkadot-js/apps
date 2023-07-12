export default {
  LCURL: process.env['LCURL'] as string || 'https://kate.avail.tools',
  TESTNETURL: process.env['TESTNETURL'] as `wss://${string}` || 'wss://kate.avail.tools/ws'
};
