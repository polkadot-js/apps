const { ApiPromise, WsProvider, Keyring } = require('@polkadot/api');
const config = require('./config');
const sprintf = require('sprintf-js').sprintf;

const { Data } = require('@polkadot/types/primitive');
const { TypeRegistry, IdentityInfo } = require('@polkadot/types');
const sleep = require('await-sleep');

function waitForConnection() {
  return new Promise(async function(resolve, reject) {
    // Initialise the provider to connect to the node
    const wsProvider = new WsProvider(config.wsEndpoint);

    while (true) {
      try {
        // Create the API and wait until ready
        const api = await ApiPromise.create({ 
          provider: wsProvider,
          types: {
  
          }
        });
  
        await api.isReady;
  
        // Retrieve the chain & node information information via rpc calls
        const [chain, nodeName, nodeVersion] = await Promise.all([
          api.rpc.system.chain(),
          api.rpc.system.name(),
          api.rpc.system.version(),
        ]);
  
        console.log(`You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`);
        resolve(api);
        break;
      } catch (e) {
        console.log("Connection error");
        await sleep(10000);
      }
    }
  });
}

function setRegstrar(api, keypair) {
  return new Promise(async function(resolve, reject) {

    const unsub = await api.tx.sudo
      .sudo(
        api.tx.identity
          .addRegistrar(config.registrarAddress)
      )
      .signAndSend(keypair, async (result) => {
        console.log(`Current tx status is ${result.status}`);
    
        if (result.status.isInBlock) {
          console.log(`Transaction included at blockHash ${result.status.asInBlock}`);
          resolve();
          unsub();
        }
      });
  });
}

function createIdentity(api, keypair, idx) {
  return new Promise(async function(resolve, reject) {

    const registry = new TypeRegistry();

    // ValidatorXX in ASCII
    const identity = sprintf("0x56616c696461746f723%d3%d", idx / 10, idx % 10);

    const info = {
      additional: [],
      display : new Data(registry, { Raw: identity}),
      legal: new Data(registry),
      web: new Data(registry),
      riot: new Data(registry),
      email: new Data(registry),
      //pgpFingerprint: 'Option<H160>',
      image: new Data(registry),
      twitter: new Data(registry)
    };

    const unsub = await api.tx.identity
      .setIdentity(info)
      .signAndSend(keypair, async (result) => {
        console.log(`Current tx status is ${result.status}`);
    
        if (result.status.isInBlock) {
          console.log(`Transaction included at blockHash ${result.status.asInBlock}`);
          resolve();
          unsub();
        }
  
      });
  });
}

function requestJudgement(api, keypair) {
  return new Promise(async function(resolve, reject) {

    const unsub = await api.tx.identity
      .requestJudgement(0, 0)
      .signAndSend(keypair, async (result) => {
        console.log(`Current tx status is ${result.status}`);
    
        if (result.status.isInBlock) {
          console.log(`Transaction included at blockHash ${result.status.asInBlock}`);
          resolve();
          unsub();
        }
      });
  });
}

function provideJudgement(api, judged, keypair) {
  return new Promise(async function(resolve, reject) {

    const unsub = await api.tx.identity
      .provideJudgement(0, judged, {knowngood: true})
      .signAndSend(keypair, async (result) => {
        console.log(`Current tx status is ${result.status}`);
    
        if (result.status.isInBlock) {
          console.log(`Transaction included at blockHash ${result.status.asInBlock}`);
          resolve();
          unsub();
        }
      });
  });
}

function setSubs(api, keypair, sub, identityDisplay) {
  return new Promise(async function(resolve, reject) {

    const registry = new TypeRegistry();
    const subPrm = [
      [sub, new Data(registry, { Raw: identityDisplay})]
    ];

    const unsub = await api.tx.identity
      .setSubs(subPrm)
      .signAndSend(keypair, async (result) => {
        console.log(`Current tx status is ${result.status}`);
    
        if (result.status.isInBlock) {
          console.log(`Transaction included at blockHash ${result.status.asInBlock}`);
          resolve();
          unsub();
        }
      });
  });
}

function test(api, account, where) {
  return new Promise(async function(resolve, reject) {

    const unsub = await api.tx.balances
      .transfer(where, 1)
      .signAndSend(account, async (result) => {
        console.log(`Current tx status is ${result.status}`);
    
        if (result.status.isInBlock) {
          console.log(`Transaction included at blockHash ${result.status.asInBlock}`);
        } else if (result.status.isFinalized) {
          console.log(`Transaction finalized at blockHash ${result.status.asFinalized}`);
          resolve();
          unsub();
        }
      });
  });
}

async function main() {

  const api = await waitForConnection();

  // Import admin account from mnemonic phrase in config file
  const keyring = new Keyring({ type: 'sr25519' });
  const registrar = keyring.addFromUri(config.registrarPhrase);
  const sudo = keyring.addFromUri(config.sudoPhrase);

  await setRegstrar(api, sudo);

  // Create and judge identities
  for (let i=1; i<=20; i++) {

    // Don't set 13th and 17th
    if ((i != 13) && (i != 17)) {
      const validatorSeed = sprintf("Validator%02d", i);
      const validator = keyring.addFromUri(validatorSeed);
      console.log(`Validator ${i}`, validator.address);
    
      // Create identity
      await createIdentity(api, validator, i);
  
      // Request judgement
      await requestJudgement(api, validator);
  
      // Provide judgement
      await provideJudgement(api, validator.address, registrar);
    }

  }

  // Claim 17 as a child of 1
  const validatorPar = keyring.addFromUri("Validator01");
  const validatorSub = keyring.addFromUri("Validator17");
  await setSubs(api, validatorPar, validatorSub.address, "0x56616c696461746f723137") // Validator17 in ASCII

}

main().catch(console.error).finally(() => process.exit());
