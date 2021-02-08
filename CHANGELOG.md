# CHANGELOG

## 0.79.1 Feb 8, 2021

Contributed:

- Display Validator/Nominator flags on account sidebar (Thanks to https://github.com/jhonalino)
- Add ChainX endpoints from Patract Elana (Thanks to https://github.com/toxotguo)
- Add Ternoa network (Thanks to https://github.com/ETeissonniere)
- Add Idavoll network (Thanks to https://github.com/jasonberger0)
- Add SubDAO network (Thanks to https://github.com/chenwei767)
- Add HydraDX snakenet (Thanks to https://github.com/lumir-mrkva)
- Update Acala types package (Thanks to https://github.com/ntduan)
- Update bounty summaries (Thanks to https://github.com/MiZiet)
- Additional bounties info display (Thanks to https://github.com/MiZiet)
- Adjust bounties account types in dropdowns (Thanks to https://github.com/MiZiet)
- Adjust popup display to match theme (Thanks to https://github.com/MiZiet)
- Adjust bounties texts (Thanks to https://github.com/MiZiet & https://github.com/rrtti)
- Add curator acceptance modal for bounties (Thanks to https://github.com/ekowalsk)
- Distinguish slash/assign curator in bounties status (Thanks to https://github.com/ekowalsk)
- Show bounty date on extend modal (Thanks to https://github.com/ekowalsk)
- Extract give up curator modal on bounties (Thanks to https://github.com/ekowalsk)
- Link from bounties to council vote (Thanks to https://github.com/ekowalsk)
- Refactor bounties tests (Thanks to https://github.com/krzysztof-jelski)

Changes:

- Allow for Ledger-compatible bip32+ed25519 accounts on creation dialog
- Display overall min. nominated amount on staking targets
- Warn with check of to-be-bonded against current min nominated
- Wan on fees dropping below existential to transaction signing dialog
- Don't display account menus where there are no available items
- Adjust mnemonic copy location on account creation (no overlaps)
- Extend contracts to upload & deploy in one step (aligns with newest contract module)
- Add initial support for the crowdloan module
- Adjust best head extraction for parachains
- Adjust extrinsic apps to clear previous errors on creation
- Ensure calendar works with non-standard schedulers (like in Rococo)
- Pass registry with `Call` decoding, allowing decoding at that point in time
- Adjust popup menu dividers to ignore empty sections
- Don't re-initialize useState, use callbacks for init as applicable
- Cleanup TypeScript `as any` usages


## 0.78.1 Feb 1, 2021

Contributed:

- Adjust zh i18n translations (Thanks to https://github.com/zhangjun725)
- Adjust settings metadata view for consistency (Thanks to https://github.com/jhonalino)
- Use PolkaBTC definitions from vendor (Thanks to https://github.com/savudani8)
- Upgrade Moonbeam vendor definitions (Thanks to https://github.com/joelamouche)
- Crust Maxwell type upgrades (Thanks to https://github.com/zikunfan)
- Expand network coverage for Patract Elara (Thanks to https://github.com/toxotguo)
- Added ChainX endpoints & logo (thanks to https://github.com/qinghuan-chain)
- Add Ares Rococo relay endpoints (Thanks to https://github.com/jiyilanzhou)
- Adjust Rococo types for Plasm (Thanks to https://github.com/akru)
- Add Rococo Ares parachain (https://github.com/jiyilanzhou)
- Add Rococo PolkaBTC endpoint (Thanks to https://github.com/savudani8)
- Add Rococo Hydrate parachain (thanks to https://github.com/lumir-mrkva)
- Adjust Darwinia for new chain properties (Thanks to https://github.com/WoeOm)
- Adjust Kilt on Rococo (Thanks to https://github.com/wischli)
- Add Rococo Datahighway parachain (Thanks to https://github.com/cgroeschel)
- Add Rococo IntegriTEE parachain (Thanks to https://github.com/brenzi)
- Add Rococo Zenlink parachain (Thanks to https://github.com/Hayden0323)
- Add Rococo & test Clover chains (Thanks to https://github.com/superpw)
- Add slash creator action to bounties (Thanks to https://github.com/MiZiet)
- Add award action to bounties (Thanks to https://github.com/MiZiet)
- Use `utility.batch` in bounty test script (Thanks to https://github.com/MiZiet)
- Display bounty id (Thanks to https://github.com/MiZiet)
- Hide unhappy bounty actions (Thanks to https://github.com/ekowalsk)

Changes:

- Additional check for `isEditable` to make network swap available (i.e. non-injected only)
- Allow for the addition of account name when adding Ledger
- Adjust staking rendering for incremental display (instead of waiting for all)
- Ensure `InputAddress` only returns filtered/available values
- Explicit warnings on inactive staking (when none are active)
- Allow for state app to operate without accounts
- Adjust badges for non-specific and development accounts (including tooltips)
- Adjust `ChainImg` to not fallback on current selected
- Adjust Rococo proposal displays (align with new types)
- Display parachain logo alongside parachain links
- Update Rococo genesisHash
- Bump Edgeware definitions
- Bump Rococo definitions


## 0.77.1 Jan 25, 2021

Contributed:

- Add Darwinia on Rococo (Thanks to https://github.com/WoeOm)
- Add Phala on Rococo (Thanks to https://github.com/tolak)
- Add Encointer on Rococo (Thanks to https://github.com/brenzi)
- Add Crust on Rococo (Thanks to https://github.com/zikunfan)
- Add Bit.Country testnet (Thanks to https://github.com/justinphamnz)
- Allow for bounty extension (Thanks to https://github.com/MiZiet)
- Add tooltips to bounties (Thanks to https://github.com/MiZiet)
- Adjust styling for bounties (thanks to https://github.com/MiZiet)
- Allow using bounties without default treasury (https://github.com/ekowalsk)
- Add close bounty action (Thanks to https://github.com/ekowalsk)
- Fix Chinese i18n (Thanks to https://github.com/pfcoder)
- Update chain types for Galois (Thanks to https://github.com/hging)
- Adjust Equilibrium derives for new derives (thanks to https://github.com/pr0fedt)
- Adjust IdentityIcon styling for dark theme (Thanks to https://github.com/jhonalino)

Changes:

- Allow Ledger accounts to be visible even when unplugged
- Add warning where transfer fees are not covered by balance
- Check transfer recipients against phishing list
- Addition of hardware accounts always tie to genesis
- Hide identity account operations on hardware devices
- Allow for display of multiple balance instances
- Adjust PolkaBTC definitions to indicate balance instances
- Display extrinsic signatures (with type) on explorer


## 0.76.1 Jan 18, 2021

Contributed:

- Add Plasm Rococo endpoint (thanks to https://github.com/akru)
- Add Robonomics Rococo endpoint (Thanks to https://github.com/akru)
- Add Mandala Rococo endpoint (Thanks to https://github.com/ntduan)
- Add Bitfrost Rococo endpoint (thanks to https://github.com/awesomepan)
- Add Kilt Rococo endpoint (Thanks to https://github.com/wischli)
- Patract Elara Rococo endpoints (Thanks to https://github.com/toxotguo)
- Add types for upcoming Rococo Encointer (Thanks to https://github.com/brenzi)
- Add link to Rococo for Subscan (Thanks to https://github.com/freehere107)
- Add support for Polymesh Ledger app (Thanks to https://github.com/adamdossa)
- Update types for Galois & re-enable (Thanks to https://github.com/hging)
- Add Uniarts types & endpoints (Thanks to https://github.com/tianxiemaochiyu)
- Add bounty script for easier testing setup (Thanks to https://github.com/MiZiet)
- Add curator propose to bounties (Thanks to https://github.com/MiZiet)
- Adjust bounty sorting (Thanks to https://github.com/ekowalsk)
- Update ledger types usage (Thanks to https://github.com/Tbaut)

Changes:

- Update Ledger usage with hooks (Thanks to https://github.com/Tbaut for final testing)
- Add Parachain proposal support for Rococo
- Add ability to propose new parachains (via modal)
- Expand parachain information (including from-chain numbers/issuance)
- Remove Web3 Foundation endpoints for Kusama and Polkadot
- Add small border on QR codes for dark-ode support
- Update Polkascan & Subscan links with all available chains
- Add hook for multi queries, apply use as applicable
- Ensure epoch/session is displayed (when no staking module)
- Bump Electron to latest version (security fix on V8)
- check for availability of `query.council` on council app
- Use latest `@polkadot.networks` with `hasLedgerSupport` flag


## 0.75.1 Jan 11, 2021

Contributed:

- Ledger support for Dock (Thanks to https://github.com/lovesh)
- Allow opening bounties for council voting (Thanks to https://github.com/ekowalsk)
- Add bounties summary (Thanks to https://github.com/ekowalsk)
- Add Patract Jupiter testnet (Thanks to https://github.com/zzcwoshizz)
- Add Polkadex testnet (Thanks to https://github.com/Gauthamastro)
- Update Darwinia types (Thanks to https://github.com/WoeOm)
- OnFianlity support for Rococo (Thanks to https://github.com/ianhe8x)
- Expanded tests for bounties (Thanks to https://github.com/krzysztof-jelski)
- Fix Electron account saving under windows (Thanks to https://github.com/krzysztof-jelski)

Changes:

- Add (as used) warning for refcount on normal transfers
- Update transfer recount check to cater for new Substrate
- Fix staking comission validation (always 0-100 only)
- Display errors of account derivation failures
- Basic parachain registration modal (non-sudo only)
- Additional upcoming parachain info & alignment fixes
- Allow use of `closeOperational` on chains that do support it for collective proposals
- Swap Error/Warning to consistent display with boxed triangle
- Always build bundles with `NODE_ENV=production` set (react non-dev)
- Swap Edgeware to specVersioned (with supporting type release from the team)
- Disable network with missing types resulting in load failures
- Adjust voting dialog with better display for non-preimage proposals
- Adjust header highlights for better light/dark support
- Fix JS app display with (& add tabs for consistency)
- Update Electron CSP to cater for local nodes
- Rework endpoint configuration for better ease of config


## 0.74.1 Jan 4, 2021

Contributed:

- Update Kulupu Address types (Thanks to https://github.com/sorpaas)
- Swap Moonbeam to use types from npm (Thanks to https://github.com/joelamouche)
- Update to latest Equilibrium types (Thanks to https://github.com/pr0fedt)
- Add Subscan support for Centrifuge (Thanks to https://github.com/vedhavyas)
- Adjust contract app layout padding (Thanks to https://github.com/MiZiet)
- Update bounties app to extended derives (Thanks to https://github.com/MiZiet)
- Allow curator accept from bounties page (Thanks to https://github.com/MiZiet)
- Add UI tests for bounties (Thanks to https://github.com/krzysztof-jelski)
- Adjust sidebar address display (Thanks to https://github.com/eddiemachado)

Changes:

- Update parachains app for Rococo V1 support (basics-only)
- Block self-proxies from proxy setup dialog
- Display locked amount on seconding modal
- Use `blockWeights.maxBlock` value (as available) for max-fit calculations
- Adjust multi-address input for dark-theme
- Workaround for contract RPC value serialization
- Fix InputAddress as used on sub-identity setups
- Fix disabled check on bond more (proper check against stash)
- Move `apps-config/bundled` -> `specVersion` (usage clarity)
- Move Kulupu to spec versioned types
- Remove generic asset support (to be replaced with asset)
- Swap to webpack-dev-server for development environment


## 0.73.1 Dec 28, 2020

Contributed:

- Add PolkaBTC network & types (Thanks to https://github.com/savudani8)
- Update Moonbeam types (Thanks to https://github.com/joelamouche)
- Sora testnet naming (Thanks to https://github.com/stefashkaa)
- Bounty crate validation (Thanks to https://github.com/MiZiet, https://github.com/krzysztof-jelski)
- Bounty crate help text (Thanks to https://github.com/MiZiet, https://github.com/krzysztof-jelski)
- Claim bounty payouts (Thanks to (Thanks to https://github.com/MiZiet)
- All upcoming calendar view (Thanks to https://github.com/wirednkod)

Changes:

- Optimize staking data retrieval (18s -> 10s on Kusama test for staking overview load)
- Pass explicit function (no strings) to TxButton props
- Adjust calendar rows for dark theme
- Update Frontier types (now included in API)
- Webpack dev environment cleanups


## 0.72.1 Dec 21, 2020

Contributed:

- Fix tooltip z-index on modals (Thanks to https://github.com/ii-ii-ii)
- Align media queries on staking targets (Thanks to https://github.com/ii-ii-ii)
- Handle pending bounty payouts (Thanks to https://github.com/ekowalsk)
- Bounty create modal (Thanks to https://github.com/MiZiet, https://github.com/ekowalsk, https://github.com/krzysztof-jelski)
- it i18n updates (Thanks to https://github.com/fomod-in)
- Add Zero testnet (Thanks to https://github.com/2075)
- Update encointer types & testnets (Thanks to https://github.com/brenzi)
- Additional types for Dock network (Thanks to https://github.com/lovesh)
- Update Phala endpoint (Thanks to https://github.com/h4x3rotab)

Changes:

- Add Rococo v1 testnet (with Tick, Trick & Track)
- saving of toggle options on staking pages
- Adjust bounties & tips with current Substrate endpoints
- Add warning for older chains without atomic batches (where used)
- Allow InputAddress display when no optional are available
- Cleanup last-block-received countdowns (fixed character spacing)
- Add sharing button for type definitions
- Typo on society pages (with i18n key adjustments)
- Adjust semantic-ui imports to non-cjs
- Use RxJs & memoize from `@polkadot/util`
- Cleanup global registry usage, only use registry from API
- Cleanup info console logs for redirect (show APIs only as applicable)
- Remove unused TxModal components
- Swap to Webpack 5


## 0.71.2 Dec 14, 2020

Contributed:

- Update it i18n (Thanks to https://github.com/fomod-in)
- Add endpoint & types for MatchChain Galois (Thanks to https://github.com/hging)
- Change endpoint for Sora (Thanks to https://github.com/stefashkaa)
- Adjust Centrifuge types after upgrade (Thanks to https://github.com/mikiquantum)
- Adjust Moonbeam types for future upgrades (Thanks to https://github.com/joelamouche)
- Adjust Equilibrium types for balances (Thanks to https://github.com/pr0fedt)
- Adjust bounties layout & add counter (Thanks to https://github.com/MiZiet)
- Add max-width for content layouts (Thanks to https://github.com/MiZiet)
- Use API derives for bounties (Thanks to https://github.com/krzysztof-jelski & https://github.com/MiZiet)
- Extra type-only imports into seperate groups (Thanks to https://github.com/ekowalsk)

Changes:

- Multisig/Proxy add is only active when accounts are available
- Adjust error popups to cater for strings as thrown (in addition to Error object)
- Ensure that bad/erroneous judgements has the highest display priority
- Detect new weight definitions for max batch-size calculations (with old fallback)
- Move Sora & Moonbean type definitions to bundle-only
- Allow for custom chain RPC definitions via typesBundle
- Split endpoint definitions into folder (dev/prod/test)
- Adjust Tooltip formatting with consistency between balances/locks


## 0.70.1 Dec 7, 2020

Contributed:

- Add first area around bounties, the existing display (Thanks to https://github.com/krzysztof-jelski)
- Adjust import ordering with plugin (Thanks to https://github.com/ekowalsk)
- Add Polkadot/Kusama endpoints via PatractLabs (Thanks to https://github.com/toxotguo)
- Add types for Bitfrost testnet (Thaks to https://github.com/janpo)
- Adjust Crust network types & logo (Thanks to https://github.com/zikunfan)
- Adjust types for Phala poc-3 (Thanks to https://github.com/LusWar)
- Move to typesBundle for Moonbeam (Thanks to https://github.com/joelamouche)

Changes:

- Bump to latest Ledger libraries for Windows USB fixes
- Store network endpoint affinity (last-used per network)
- Only show links in sidebar for verified-good identities
- Adjust staking pages to show loading indicators, optimize number of queries
- Adjust staking target filters, including explicit identity grouping
- Rework target/waiting loading with shared nominator loading
- Cleanup calendar interface (ease of maintaining)
- Remove sparsely-used classes utility (inconsistent use)
- Swap to using TypeScript 4.1.2
- Adjust dark theme to work with help overlays


## 0.69.1 Nov 30, 2020

Contributed:

- Adjust font alignments (Thanks to https://github.com/MiZiet)
- Add iCal export on calendar (Thanks to https://github.com/wirednkod)
- Add OnFinality endpoint for Polkadot/Kusama (Thanks to https://github.com/ianhe8x)
- Soramitsu Sora testnet (Thanks to https://github.com/stefashkaa)
- Update Plasm Dusty types (Thanks to https://github.com/hoonsubin)
- Update Edgeware mainnet endpoints (Thanks to https://github.com/drewstone)
- Typo fixes (Thanks to https://github.com/ShankarWarang)

Changes:

- Display the actual era start when using Aura (no extra session info)
- Expand staking account filters (payouts, # nominators, grouping)
- Use percentage-based model for returns on staking targets
- Display actual chain inflation as well as average staking returns
- Adjust refresh on validator chill, i.e. it moves to correct location
- User-defined RPCs (via config), not are treated first-class (operating everywhere)
- MultiSig now allows any participant to reject (despite any prior approvals)
- Adjust base fonts with saner cross-platform (from new.css) defaults
- Adjust staking targets to display nominations for those dropped next session
- Use `batchAll` on staking creation as available (failure reverses all)
- Add CopyButton on all `Hash`-like fields
- Cleanup component detection with non-primitives only (allows for greater configurability)
- Improve `useCall` typing, e.g. no hacks for `.entries` or `.at` in usage
- Adjust most type imports via `import type { ... }`
- Move all chain-specific config to `apps-config` (thresholds & inflation)


## 0.68.1 Nov 23, 2020

Changes:

- Adjust API state display to explictly render "connecting to node" state
- Change Mill/Bill/Tril rendering from Mega/Giga/Tera
- Staking now limits per-operator exposure by default (only 1 selected on auto)
- Adjust Expanded rendering to be completely on-demand (no hidden background renders)
- Ensure `MultiAddress` nodes fully work (API updates)
- Adjust number of digits for number inputs to max decimals
- Rework invalid ABI detection with proper error clearning
- Use TypeScript `import type { ... }` for all files
- Expand notes on colors/logos with actual RPC endpoints
- Publish `@polkadot/apps-config` (with reworked import/export)
- Bump Ledger libs to latest version (as per `@polkadot/ledger`)


## 0.67.1 Nov 16, 2020

Contributed:

- Improve support/naming for Ethereum-compatible accounts (Thanks to https://github.com/joelamouche)
- Support for Ethereum-compatible signature verification (https://github.com/joelamouche)
- Added Moonbeam types for current versions (Thanks to https://github.com/joelamouche)
- Added Moonbase Alpha to list of test networks (Thanks to (Thanks to https://github.com/joelamouche))
- Add Equilibrium Mainnet; updated Equilibrium Testnet (Thanks to https://github.com/pr0fedt)
- Update types of Cantillon testnet (Thanks to https://github.com/brenzi)
- Update types of Gesell testnet (Thanks to https://github.com/brenzi)
- Add Darwinia network (Thanks to https://github.com/WoeOm)
- Add Bitfrost Asgard testnet (Thanks to https://github.com/janpo)

Changes:

- Ensure account addition checkbox shows on smaller screens
- Add support for contract budles via `.contract` files
- Allow contracts to specify salt parameter on deployments
- Update contracts banner to reflect released Solang 0.1.5+ support


## 0.66.1 Nov 9, 2020

Contributed:

- Adjust font injection into all pages (Thanks to https://github.com/EthWorks)
- Update types for Acala TC5 (Thanks to https://github.com/xlc)
- Cleanup global font injection (Thanks to https://github.com/Tbaut)

Changes:

- Cleanup calculation of available voting balance on council (no unneeded refreshes)
- Default to make contract calls with maximum weight (& align wih Rust RPC max)
- Always check the refCount before allowing all-balance transfers
- Allow council motions to display even when some on-chain proposals are invalid
- Fix treasury tips to correctly check values against hashes
- Add support for Ethereum icons (for Ethereum-compatible chains)
- Bump to major `@polkadot/{keyring, util, util-crypto}` release


## 0.65.1 Nov 2, 2020

Contributed:

- Fix for Electron account loading (Thanks to https://github.com/EthWorks)
- Adjust electron override hashes & bump versions (Thanks to https://github.com/EthWorks)
- Update i18n zh strings (Thanks to https://github.com/starit)
- Adjust Edgeware RefCount type (Thanks to https://github.com/drewstone)
- Trigger tip refresh on close (Thanks to https://github.com/Tbaut)

Changes:

- Adjust for latest Rococo types
- Adjust council motion parsing (allow for some non-parseable)
- Adjust for use of new `api-contracts` (including call errors)
- Allow for selection of payment destination on initial bonding


## 0.64.1 Oct 26, 2020

Contributed:

- New account creation dialog (Thanks to https://github.com/EthWorks)
- Update Darwinia Crab types (Thanks to https://github.com/WoeOm)
- Update Kulupu types (Thans to https://github.com/sorpaas)
- Add Hanonycash types & endpoints (Thanks to https://github.com/Hanonycash)
- Update ko i18n (Thanks to https://github.com/maestro779)
- Update links in apps-config (Thanks to https://github.com/NukeManDan)

Changes:

- Allow for Ascii inputs on Bytes (in addition to hex & files)
- Ensure that InputNumber respects the biLength for the type it is dealing with
- Displays the last blocks containing contract executions in contract overview
- Parse contract events (both status pops-up and explorer views)
- Display actual codeHash (and allow copy) as part of code management
- Adjust labels for contracts UI with explicit "None" projection
- Adjust contracts UI to actually use Balance types where so specified in the ABI
- Add support for Solang i256 & u256 types
- Adjust contract messages to display names in camelCase (consistent with API)
- Add gas estimation for contracts
- Adjust JS bundles to have a better parallel throughput
- Adjust checks for Aura for unbonding, displaying on era


## 0.63.1 Oct 19, 2020

Contributed:

- Updates for new Acala testnet (Thanks to https://github.com/aniiantt)
- Update i18n ko (Thanks to https://github.com/maestro779)
- Update i18n fr (Thanks to https://github.com/Tbaut)
- Contract metadata display bg on dark mode (Thanks to https://github.com/Tbaut)

Changes:

- Swap chain/prefix lookups to `@polkadot/networks` (single area to manage)
- Fix formatting for large decimals on InputNumber (previously had toNumber)
- Adjust Dock logos naming (aligns with network identifier)
- Update i18n generation to handle routing strings
- Estimate contracts execution gas (on contract call)
- Use RPC for rent projection (to project eviction as available)
- Metadata QR now aligns decimals with UI defaults (shared with react-api values)
- Add endpoint for Canvas testnet (& setup types for node)


## 0.62.1 Oct 13, 2020

Contributed:

- Add Dock network (Thanks to https://github.com/lovesh)
- Bump Edgeware types for network updates (Thanks to https://github.com/jnaviask)
- Add French i18n (Thanks to https://github.com/Tbaut & https://github.com/chevdor)
- Update Italian i18n (Thanks to https://github.com/fomod-in)
- Update Indonesian i18n (Thanks to https://github.com/nzjourney)

Changes:

- Update the contracts UI to support ink! 3.0-rc1 (via API)
- Align contracts UI with the L&F/layout of the rest of the UI
- Add contracts on-chain overview
- Show code & contract availability statuses
- Auto-query non-param messages from the contract overview
- Expand info on logos (documentation, better/easier additions)
- Update i18n to remove left navbar references
- Support seconding multiple times from a single account


## 0.61.1 Oct 5, 2020

Contributed:

- Update Arabic i18n for calendar (Thanks to https://github.com/YessineAmor)
- Additional Korean i18n (Thanks to https://github.com/hskang9)
- Italian i18n typo fix (Thanks to https://github.com/roccomuso)
- Add Equilibrium testnet endpoint (Thanks to https://github.com/mikolajsobolewski)
- Update types for stable-poc (Thanks to https://github.com/riusricardo)

Changes:

- Add experimental dark UI theme
- Adjust i18n strings for network endpoint (explicit as per display)
- Adjust vesting display with no countdown when fully vested
- Adjust validator rewards, fixing issues with "keeps loading" when retrieved in the current era
- Adjust updates on per-era change, protecting against non-existent (not yet retrieved) exposures
- Add RoboHash icon theme
- Adjust logging in InputAddress transforms (don't log already-handled errors)
- Remove unmaintained packages (e.g. page-dashboard)


## 0.60.1 Sep 28, 2020

Contributed:

- Update Italian i18n (Thanks to https://github.com/fomod-in)
- Show JSON import warning for different genesis (Thanks to https://github.com/Tbaut)
- Adjust Expander component overflows (Thanks to https://github.com/Tbaut)

Changes:

- Adjust payout calculations based on new weights (auto-detect batch size)
- Allow for multiple extrinsic submissions when payouts span multiple batches
- Show warning on JSON import to store accounts externally (same as create)
- Combine events displays in status overlays
- Swap treasury proposal defaults to accept
- Adjust multiple input address stretch (use full width for names)
- Filter event/extrinsic metadata with additional readability formatting
- Ensure that tech. comm. voting is filtered by members
- Adjust proposal close to allow account selection when multiple accounts found
- add warning around "this is a dev tool" to the JS playground
- Add toggle to control unlock duration
- URI-encode RPC param (allowing for WS url params)
- Bump Edgeware types (after 2.0-rc upgrade)
- Adjust warning icon for oversubscribed validators
- Simplify JSON import via new keyring functionality
- Adjust button hover highlights for consistency
- `@polkadot/api` 2.0.1
- `@polkadot/util` 3.5.1


## 0.59.1 Sep 21, 2020

Contributed:

- Add Stafi network and endpoints (Thanks to https://github.com/Tore19)
- Update Commonwealth links to support Kulupu (Thanks to https://github.com/carumusan)
- Update Kulupu treasury thresholds (Thanks to https://github.com/sorpaas)
- Update Darwinia Crab types (Thanks to https://github.com/WoeOm)
- display per-validator breakdown values to nominators (Thanks to https://github.com/Tbaut)
- Update Italian i18n (Thanks to https://github.com/fomod-in)
- Update Indonesian i18n (Thanks to https://github.com/nzjourney)

Changes:

- Support Account as payment destination (as per Polkadot & Kusama)
- Single-click close for tips and council motions (no extra selection)
- Add ability to transfer full amount (fees deducted), reaping the sender
- Allow Ledger to use Account & Address indexes (multiple accounts)
- Adjust formatting for metadata with delimiter info from text
- Use InputNumber for param Amount input type
- Update Darwinia Crab types (no errors on staking pages)
- Move colors config to explicit configuration file
- Adjust margins for button groups (extra spacing)
- Always add the `?rpc=...` query param when changing networks
- Determine nonce via `system.accountNextIndex` via the signer modal
- Add contrasting text colors for top menu (light vs dark primaries)
- Check query param URL for wss/ws before saving (protection against bad inputs)
- Adjust staking pages to correctly link to passed-in paths
- Only hide settings extension update (not QR) when in dev mode
- Adjust expander tables with caret at end (including Table reworks)


## 0.58.1 Sep 14, 2020

Contributed:

- Completion of i18n Italian (Thanks to https://github.com/fomod-in)
- Completion of i18n Indonesian (Thanks to https://github.com/nzjourney)
- Add Robonomics Rococo endpoints (Thanks to https://github.com/akru)
- Show warning where derived password contains `/` (Thanks to https://github.com/Tbaut)
- i18n capability for derive error messages (Thanks to https://github.com/Tbaut)
- Adjust menubar for solid primary color background (As per designs from https://github.com/EthWorks)

Changes:

- Block explorer will display error message where block cannot be retrieved
- Allow for display of Reward destination as Account on account actions
- Display commission graphs in validator chart breakdown
- Optimize rendering of staking charts
- Show own nomination (badge) in all validator lists
- QR codes are checked for hex validity before sending
- Optimization of re-renders in signer
- Ensure signer does not confuse Ledger with QR (button text)
- Detect WebUSB, if not active don't support Ledger integration
- Small cleanups & bugfixes on global table layouts
- Extract i18n reward destination options
- Update Centrifuge types for non-cyclic dependencies
- Adjust table alternate row colors to alow with primary
- Adjust calendar layout to conform to new-generation Tables
- Fix display of Plasm logos (for different node types)
- Allow IPFS to add QR addresses to storage (no accounts allowed)
- Adjust Expander rendering with consistent up/down right caret


## 0.57.1 Sep 7, 2020

Contributed:

- Add Crust network (Thanks to https://github.com/zikunfan)
- i18n comprehensive Chinese round-out (Thanks to Polkaworld)
- i18n comprehensive Italian (Thanks to https://github.com/fomod-in)
- Initial i18n Italian (Thanks to https://github.com/excerebrose)
- i18n Bahasa Indonesian updates (Thanks to https://github.com/nzjourney)
- Ad per-block/end-block vesting info (thanks to https://github.com/niklabh)
- Update Polkastats logo (https://github.com/mariopino)
- Fixes for i18n translation page on swapping (Thanks to https://github.com/motinados)

Changes:

- Add individual era-slash cancels on staking slashes page
- Adjust staking slashes with per-era selector
- Optimization of staking list details queries (shared with targets, remove extras)
- Adjust max payout batch size (40 txs for 64 payees) based on staking payout constant
- Add "copy seed" button to align with the extension UX on new accounts
- Combine confirmation/backup of imports/new account into the modals (no double-modal)
- Fix ecdsa JSON import dialogs
- Fix detection of old/new proxy chains based on args to support Kusama 2023
- Allow Enter to work as expected (doing submission) on the signer modal
- Ensure all network-related configs are maintainable
- Adjust average calcs for targets (optimization)
- Adjust Table UI, crisper table layouts
- Update WASM uploads to use `isWasm` from utilities
- Adjust i18n strings, allowing countdown translations


## 0.56.1 Aug 31, 2020

Contributed:

- Add Laminar Rococo parachain (Thanks to https://github.com/aniiantt)
- Add Darwinia Rococo parachain (Thanks to https://github.com/WoeOm)
- Add Subsocial chain (Thanks to https://github.com/F3Joule)
- Add Phala POC2 testnet (Thanks to https://github.com/krhougs)
- Add Plasm network (Thanks to https://github.com/akru)
- Rename Darwinia Crab chain (Thanks to https://github.com/WoeOm)
- Add I18n for Bahasa Indonesian (Thanks to https://github.com/nzjourney)

Changes:

- Add bulk tipping (median) functionality to treasury tips
- Add a calendar app that show current and upcoming chain events
- Ensure max nomination limits (64) badges are displayed in all location on staking
- Show oversubscribed validators under accounts & on staking overview
- Show the next burn amount on treasury
- Add warning on new treasury proposals that rejections will lose the bond
- Add explicit Aye/Nay buttons on all voting modals (no toggle)
- Display unlocking timer for delegated voting under accounts
- Fix Electron app security to allow WASM
- Cleanup indices handling, including size checks on the AccountId level (from non indices lookup chains)
- Adjust create account modal with advanced options minimized by default
- Adjust reward destination handling to cater for both current/next generations
- Adjust slideout z-index (non-hidden behind new menubar)
- Add checks for multisig thresholds to align with Rust (min 2)
- Adjust external source links to use destination icons
- Limit InputNumber around actual available chain decimals
- Display bonding unlocking on address book
- Cleanup display for unbonding values, better performant
- Add a legend on the staking overview pages
- `@polkadot/api`1.31.2
- `@polkadot/util` 3.4.1


## 0.55.1 Aug 24, 2020

Contributed:

- Add Kilt network (Thanks to https://github.com/wischli)
- Add Nodle mainnet (Thanks to https://github.com/ETeissonniere)
- Add Darwinia Crap canary network (Thanks to https://github.com/WoeOm)
- Add Laminar testnet (Thanks to https://github.com/aniiantt)
- Add Acala Rococo parachain (Thanks to https://github.com/aniiantt)
- Re-add Polkascan link for Kulupu (Thanks to https://github.com/sorpaas)
- Update Kulupu RPC endpoint (Thanks to https://github.com/sorpaas)
- Add Kulupu logo & adjust council config (Thanks to https://github.com/sorpaas)
- Adjust convictions for Kulupu blocktime calcs (Thanks to https://github.com/sorpaas)
- Nightly tests for functionality against Substrate (Thanks to https://github.com/EthWorks)
- I18N Korean translation (Thanks to https://github.com/wooqii)

Changes:

- Move navbar to the top instead of a sidebar (horizontal space becomes available)
- Add extra payout information on staking to reduce confusion (any account can claim)
- Rework Aye/Nay votes display in council/democracy with single column
- Ensure copy button does not appear non-clickable (e.g. in multisig menu)
- Adjust council thresholds for cleaner future adjustments
- Don't show loading spinner on accounts app when none available
- Hide metadata updates on development networks (not available)
- don't show send button for accounts/contacts with no balances module
- Show names (as available) of scheduled tasks in democracy
- Adjust app consistency (all apps now have a tabs/menubar)
- Adjust network selector with split catagories and single-click selection
- Default conviction dropdown to no lockup
- Remove conviction override for Polkadot (upgrade has taken effect)
- Use `proposeParachain` module to show list of proposed parachains (Rococo)
- Adjust parachain display to remove non filled-in default information
- Support for Polkadot redonomination banner (countdown & completion)
- Add link from treasury page to ongoing proposal votes
- Adjust media breakpoints on staking overview page
- Split democracy dispatch/scheduled into own tab
- Split treasury tips into own tab
- Split addressbook into own app (with top nav)
- Aplit RPC app into own app (top nav, toolbox remainder now named sign/verify)


## 0.54.1 Aug 17, 2020

Contributed:

- Remove Berlin testnet, replace with Beresheet (Thanks to https://github.com/drewstone)
- Add links to Polkastats where available (Thanks to https://github.com/mariopino)
- Allow for clearing of previously-made council votes (Thanks to https://github.com/Tbaut)
- Allow for clearing of on-chain identities (Thanks to https://github.com/Tbaut)
- Show deposit info for setting identities (Thanks to https://github.com/Tbaut)
- show sub-accounts in sidebar when found (Thanks to https://github.com/Tbaut)
- Don't allow `///password` in non-mnemonic seeds (Thanks to https://github.com/Tbaut)
- Allow saving custom RPC endpoints (Thanks to https://github.com/Tbaut)
- Add tooltip & help info on nominee statusses (Thanks to https://github.com/Tbaut)

Changes:

- Adjust threshold parameters via lookup for treasury proposals
- Optimize API queries params & options for less re-renders
- Consistently detect hex data in file uploads (e.g. on parachain data)
- Rework table rendering to non-memo/non-state headers
- Adjust Sudo app with/without unchecked weight selection
- Link from account page to extension upgrades via expanded info
- Adjust Polkadot tokenDecimals/tokenSymbol for transition periods
- Rework Slashing displays to display cumulative totals
- Add countdown to slashing enactment to Slashing overview
- Display own slashes for all nominators (Actions & Slashes pages)
- Display overall staked average and minimum on targets page
- Adjust council display to show desired runnersup
- Validator-only payout toggles (as detected)
- Base support for time-delay proxies (API-level only, both old and new calls)
- Adjust saving for address inputs via AccountIndex (incl. logo from AccountId)
- Don't allow chain selection on IPNS-with-chain endpoints
- Adjust alignment of units (time & symbol) in formatters
- Do not fail on non-available RPCs for node info retrieval (& hide empty)


## 0.53.1 Aug 10, 2020

Contributed:

- ko i18n first-round support (Thanks to https://github.com/hskang9)
- Update to latest Centrifuge types (Thanks to https://github.com/mikiquantum)
- Add icon on Electron app under Linux (Thanks to https://github.com/EthWorks)
- Re-bonding adjusts based on unbonding  redeemable (Thanks to https://github.com/Tbaut)
- Adjust council voting balance to include reserved (Thanks to https://github.com/Tbaut)
- Add tip link to Polkassembly (Thanks to https://github.com/Tbaut)
- Show existing proxies across all accounts (Thanks to https://github.com/Tbaut)

Changes:

- Add slashes tab to display unapplied, also indicate status in lists
- Unbonding allows for full-balance unbond (& pre-fills)
- Rework parachains app initial displays with cross-app consistency
- Allow for transfers between parachains & to/from relay (via tokenDealer)
- Allow tipping to pre-populate and display median (& quick-tip with median)
- Display auto-chilled nominations, allowing for re-nomination
- Sanitize names on identity set dialog
- Adjust vanity to wan about saving, be explicit in save button action
- Add banner for DOT re-denomination on accounts page (Polkadot only)
- Allow updating of extensions when chain-properties have been changed
- Adjust InputAddressMulti lookups with and without names
- Add warning for locally stored accounts in creation (to be deprecated)
- Add basic password strength indicator for password creation
- Add Rococo testnet chain support
- Add IPNS support for Rococo
- Adjust threshold calculations where members are not (yet) available


## 0.52.1 Aug 3, 2020

Contributed:

- ar i18n support (Thanks to https://github.com/nightwolf3)
- zh i18n updated (Thanks to https://github.com/kaichaosun)
- zh i18n updates (Thanks to https://github.com/x-i-ao-b-ai)
- Allow management of proxies (Thanks to https://github.com/Tbaut)
- Links for Polkassembly Polkadot support (Thanks to https://github.com/niklabh)
- Clarify claiming template text (Thanks to https://github.com/Swader)

Changes:

- Remove auto-select defaults for nomination, adjust loading for all selector
- Display Slashing tab on staking overview (as available)
- Indicate per-validator slashes in accounts (chilled) & staking targets
- Display scheduled tasks (ongoing) on democracy page
- Adjust endpoint selector with slide-out as opposed to modal (all visible)
- Cleanup democracy delegation to highlight invalid amounts
- Adjust thresholds for council slash cancel on Polkadot
- Dep-dupe account filtering in all lists (staking vs multi-select lists)
- Adjust max column widths in modals, avoiding overflows
- Adjust era filters on staking payouts, default to day intervals
- Convert custom URL inputs to punycode (UTF8 detection)


## 0.51.1 Jul 27, 2020

Contributed:

- Support for Acala chain and types (Thanks to https://github.com/aniiantt)
- First batch of i18n for Arabic (Thanks to https://github.com/nightwolf3)

Changes:

- Update for Polkadot council thresholds
- Council motion adjustment to cater for current and previous generations
- Adjust imminent proposals to not need own type adjustments
- Cleanup voting totals to only take free into account
- Support JSON v3 formats with kdf
- Always display time left in countdowns, not blocks
- Adjust progress component to be circular
- Rename "Deposit" button to "Send" button (less confusion)
- Ensure new generation tip cancel works for council & users
- Split council votes in backing & number of votes
- Adjust council motions to have the correct max display for nay votes
- Adjust payout toggles with increasing day increments
- Adjust button formats & layouts
- Adjust council slashing params to cater for current generation
- Fixed for keyboard locale detection
- Don't allow display in an iframe


## 0.50.1 Jul 20, 2020

Contributed:

- Adjust CSPs for Electron (Thanks to https://github.com/EthWorks)
- Move delegation column to badge (Thanks to https://github.com/Tbaut)

Changes:

- Display costs for preimage calls
- Add buttons for bid/unbid on Society
- Allow tip endorsements while in countdown
- Flatten events to group by same-kind in the same block
- Adjust identity validation to check for whitespacing
- Allow the use of VecFixed params with type detection/inputs
- Adjust controller changing to filter when stash === controller (no error, but warn)
- Allow the poll module via Governance proxy
- Expand proxy detection to deep-inspect batched calls
- Ensure various APIs are available (filtering) before attempting to render
- Ensure tooltips are correctly displayed on account hovers
- Cleanup council display for candidates
- Cleanup and simplify QR import logic (& always set genesisHash, even when not supplied)
- Always set genesisHash when accounts are derived
- Adjust breakpoints for `AccountName` via `AddressShort`
- Cleanup SUI dependencies with unused components, Progress, Responsive, Toggle
- Adjust module bundling splits, remove unused libraries & fonts
- Remove unmaintained page-123code (& references)
- Don't display finalized blocks when grandpa is not available


## 0.49.1 Jul 13, 2020

Contributed:

- Update Subscan links with supported chains (https://github.com/carumusan)
- Enhance Electron desktop with CSP & best practices (Thanks to https://github.com/EthWorks)
- Activate Electron update feature by default (Thanks to https://github.com/EthWorks)
- Use external browser for embedded links in Electron (Thanks to https://github.com/EthWorks)
- Add testing around Electron features (Thanks to https://github.com/EthWorks)
- Support democracy account delegation (Thanks to https://github.com/Tbaut)
- Don't filter selected on multi account selector (Thanks to https://github.com/Tbaut)

Changes:

- Add support for Polkadot denomination poll
- Allow input & display of OpaqueCall type from multisig
- Indicate own nominees on targets page (re-added with badges)
- Re-add indicator for own nominators in staking targets
- Add `?filter=<string>` query param support on staking URLs
- Add generator for Kusama society designs
- Handle OpaqueCall in inputs and well as displays (multisig)
- Small layout adjustments for address display components
- Performance improvements on wrapped styles, component libraries
- Add support for display detected ASCII bytes as text
- Adjust type injection to override on-connect API defaults
- Adjust attestation display with no-balance filters


## 0.48.1 Jul 6, 2020

Contributed:

- Fix for electron package build (Thanks to https://github.com/EthWorks)

Changes:

- Allow for setting of sub identities via account action
- Adjust known account icons (Society & Treasury)
- Add Westend chain to Subscan link generator
- Display a warning with extensions and no injected accounts
- Retrieve all tips at once and sort by closing
- Fix identity set dialogs to never pass empty fields
- Optimize favorites retrieval & selection for staking (shared between)
- Support new registrar ProxyType in the signer
- Hide funds unbonding when non bonded
- Add withdraw action to staking menu (as available)
- Fix InputAddress component with state change warnings
- Bump to latest API and utilities


## 0.47.1 Jul 1, 2020

Contributed:

- Update zh translation (Thanks to https://github.com/dushaobindoudou)
- Add DataHighway Harbour testnet endpoint (Thanks to https://github.com/ltfschoen)
- Small I18N key fix (Thanks to https://github.com/ltfschoen)
- Allow for Electron auto-update on Mac (Thanks to https://github.com/EthWorks)
- Swap to default conviction of 1x (Thanks to https://github.com/Tbaut)
- Make preimage hash selectable on FF (Thanks to https://github.com/Tbaut)
- show unbonding value in staking actions (Thanks to https://github.com/Tbaut)

Changes:

- Default (via toggle) to only last 25% of eras for payouts
- Allow retracting of tips by proposer
- Allow tipping with new Substrate types (dual old/new support)
- Enable the full retrieval of all Map/Doublemap entries
- Support correct display of vesting with locks (& unlock via account)
- Adjust on-chain identity inputs with field validation
- Enable grouping of democracy locks by type
- Resolve identity links starting with https://twitter
- Display voted & unvoted council motions, referendums & tips
- Adjust toggles for file/bytes uploads
- Correct handling of recursive param structures in extrinsics
- Swap icons to use font-awesome directly, including official components
- Additional small UI cleanups and fixes


## 0.46.1 Jun 22, 2020

Contributed:

- I18n for es (Thanks to https://github.com/wimel)
- Support for importing mini secrets via QR (Thanks to https://github.com/hanwencheng)
- Update SubstrateTEE types (Thanks to https://github.com/brenzi)

Changes:

- Support for multisig calls with new weight parameters
- Split sign and send updates in the signer modal for better UI tracking
- Hide zero nonce of accounts/contracts pages
- Display API extrinsic construction errors in the extrinsics app
- Do not display signer proxies when there are none matching against accounts
- Sort recovery addresses to align with the Substrate implementation
- Check for funded controller on bonding
- Suggest max values for bonding (& bonding extra), adjusting checks
- Handle isForceEra to adjust era displays
- Display candidacy bond on council submission
- Adjust AddressMni & AddressSmall components to take advantage of bigger screens
- Display referendum & treasury tips voting status
- Add tips close buttons & countdown timer
- Disabled nominations via targets when in election
- Expand targets page to include waiting validators (full overview of all)
- Apply shared filters (name, toggles) on all validator lists
- Display balances in account view sidebar
- Adjust signer dialog ith split sign/send (better status displays)
- Adjust proxy checks for sudo calls to closer align with Polkadot
- Apply i18n caching, with no reload on translation page
- Add "Apply" i18n button to reflect editing changes in the UI
- Support Tuple inputs (params/extrinsics) for custom names
- `@polkadot/api` 1.20.1
- `@polkadot/util` 2.15.1


## 0.45.2 Jun 16, 2020

Contributed:

- I18n for ja (Thanks to https://github.com/SotaWatanabe)
- I18n for pt (thanks to https://github.com/laurogripa)
- I18n for ru (Thanks to https://github.com/illlefr4u)
- Update Encointer types (thanks to https://github.com/brenzi)
- Improve Electron app security settings (Thanks to https://github.com/EthWorks)

Changes:

- Rework signer dialog to cater for proxies (and multisig/proxy combinations)
- Construct payouts with oldest eras first (expire first)
- Show outstanding multisig approvals on accounts page
- Allow for addition of proxied accounts (access to proxy account only)
- Change claims to handle no statements required (new module now on Kusama)
- Publish docker image on release
- update collective calls to handle weights enhancements for latest Substrate
- Allow for tip endorsements with 0 value
- add Centrifuge live as a connection option
- Adjust Polkascan links with current active chains
- When collective proposal is in close state, hide vote buttons
- Cleanup technical committee display (header alignment)
- Adjust IPFS/IPNS network extraction for local gateways
- `@polkadot/api` 1.19.1
- `@polkadot/util` 2.14.1


## 0.44.1 Jun 10, 2020

Contributed:

- Publish electron images on release (Thanks to https://github.com/EthWorks)
- Adjust with latest Arcardia types (Thanks to https://github.com/ETeissonniere)
- Extensions and fixes to the russian translations (Thanks to https://github.com/illlefr4u)
- Rewrite of the contracts app (Thanks to https://github.com/kwingram25)
- New types for SubstrateTEE (Thanks to https://github.com/brenzi)

Changes:

- Adjust for new Polkadot CC1 & Kusama types
- Cater for new multisig module location
- Filter multisig signatories based on approvals, set final state based on threshold
- Adapt QR codes to cater for hashing on large payloads
- Adjust collective extrinsics to cater for weight & lengths
- Allow bonding with full free amount (this fixes bonding for vesting)
- Fixes for Kusama as well as Polkadot claims
- Allow Polkadot CC1 links to Polkascan & Subscan
- Update Polkascan links with new formats
- Don't display era progress when Forcing `isForceNone`
- Overall styling adjustments
- Cater for `{kusama,polkadot,westend}.dotapps.io` redirects
- `@polkadot/api` 1.18.1
- `@polkadot/util` 2.13.1


## 0.43.1 May 26, 2020

Contributed:

- Support for Polkadot CC1 Claims (Thanks to https://github.com/amaurymartiny & https://github.com/Tbaut)
- Small typo fixes (Thanks to https://github.com/Swader)
- updates to russian translation (Thanks to https://github.com/illlefr4u)
- Adjustments to Electron build support (Thanks to https://github.com/EthWorks)

Changes:

- Support for Polkadot CC1 types & RPC endpoints
- Detect & support new proposal close process in Substrate
- Adjust checks for on-click validator (immediate isActive)
- `@polkadot/api` 1.16.1
- `@polkadot/util` 2.11.1


## 0.42.1 May 22, 2020

Contributed:

- Adjust Subscan proposal links (Thanks to https://github.com/illlefr4u)
- Add environment suport for docker images (Thanks to https://github.com/chevdor)
- Adjust overflows on small screens (Thanks to https://github.com/dushaobindoudou)
- Add links to Polkaassembly (Thanks to https://github.com/Tbaut)
- Address popup with detailed info (Thanks to https://github.com/kwingram25)
- Add Russian translation (Thanks to https://github.com/gregzaitsev)
- Russian translation adjustments (Thanks to https://github.com/illlefr4u)
- Add Nodle RPC endpoint (Thanks to https://github.com/ETeissonniere)
- Update Kulupu types (Thanks to https://github.com/sorpaas)
- Update Edgeware types (Thanks to https://github.com/drewstone)
- Update Encointer types (Thanks to https://github.com/brenzi)
- Update node-template types (Thanks to https://github.com/shawntabrizi)
- Update node-template types (Thanks to https://github.com/JoshOrndorff)
- Higher default contracts gas limit (Thanks to https://github.com/Stefie)
- Add block number display to event overview (Thanks to https://github.com/danforbes)
- Basic Electron support (Thanks to https://github.com/EthWorks)
- Documentation around IPFS pinning (Thanks to https://github.com/chevdor)

Changes:

- Added IPFS/IPNS publishing (ipns via dotapps.io)
- Support for multisig wallets
- Ledger address on-wallet display option
- Add support for new per-staker payouts
- Allow for "best" selection in staking
- Simplified nominator & validator creation flows
- Display >64 nominators on staking pages (clipped payouts)
- Remove tooltips on staking and elsewhere (large number causes performance issues)
- Council isMember checks uses council in addition to elections
- Allow closing of council proposals
- Expand Treasury proposal inline in council (for approve/reject)
- Expand external proposals in council (preimage lookups)
- Allow for sudo with unchecked weight
- Adjust referendums to display turnout and sentiment
- Add columar modals with extra info
- Add table summaries with totals for free, bonded & stash payouts
- Add images to metadata update dropdowns
- Ecdsa keypair support
- Display delegations in voting breakdowns
- Adjust registrar modal with per-account filters
- Add i18n linting script
- Add i18n editor with translation file generator
- Custom i18n loader with caching
- Add JS sample for storage key generation
- Misc UI fixes & adjustments throughout
- Allow for tabes with aliasses (on renames) & redirects
- Align types and calls with latest substrate


## 0.41.1 Apr 20, 2020

Contributed:

- Fix for searching child identities on parent name (Thanks to https://github.com/krogla)
- Support chains with no balances module (Thanks to https://github.com/Voxelot)
- Add out-of-the-box support for Encointer (Thanks to https://github.com/brenzi)
- Add ava.do endpoint for Kusama (Thanks to https://github.com/Swader)

Changes:

- Show remaining time on staking payout actions, link payouts from actions
- Display per-validator nominators on waiting list
- Add support for Treasury tipping (display of available & creation)
- Adjust display of passing/failing calcs in democracy (incl. no display when other side is 0)
- Enable use of `system_chainType` to detect development chains
- Adjust Expander display for balances as used in accounts
- Adjust formatting outputs (via cleanup) for state queries
- Cleanup nowrap on Extender as part of tables
- Optimize retrieval of old-style validator/nominator payouts (not full historyDepth)
- Optimize AccountName with caching & when used in lists (no lookup information attached, but not shown)
- Optimize IdentityIcon with removal of extra queries
- Optimize Transfers, no unneeded useEffect
- Cleanups, remove unused components with no references (dropped in earlier refactoring)
- More components to functional, specific focus on TxModal extends
- Bumps to all @polkadot/* packages for latest support everywhere


## 0.40.1 Apr 9, 2020

Contributed:

- Swap voting to aye/nay toggles (Thanks to https://github.com/Lowhearth)
- Cater for chains where no tip is present (Thanks to https://github.com/Sushisource)
- Export chain-specific settings via QR (thanks to https://github.com/hanwencheng)
- Improve support for WS_URL usage (Thanks to https://github.com/chevdor)
- Add out-of-the-box support for Centrifuge (Thanks to https://github.com/philipstanislaus)
- Cleanup docker image construction (Thanks to https://github.com/philipstanislaus)
- Add out-of-the-box support for node template (Thanks to https://github.com/JoshOrndorff)
- Text cleanups (Thanks to https://github.com/x5engine)
- Text cleanups (Thanks to https://github.com/ltfschoen)
- update Parachains to support latest Polkadot (Thanks to https://github.com/kwingram25)
- Rework multi address inputs (e.g. nominations & council) (Thanks to https://github.com/kwingram25)

Changes:

- Introduce apps-config as a single source of config information
- Cater for metadata updates to extensions
- Rework explorer layouts, combining extrinsics & events into a single view
- Swap all layouts to be explicitly table-based (instead of table-like)
- Cater for latest Substrate referendum updates
- Allow for fast-tracking proposals
- Time countdowns where applicable, e.g. referendums
- Show referendum pass/fail status as well as change information
- Combine Accounts & Contacts into a single app
- Support for display of parent/child relationships in accounts
- Add ErrorBoundary around components
- Update Westend after reset
- Enable Subscan explorer
- Support for simple payouts on Substrate, with Payouts screen
- Extensive use of useCallback & React.memo for functional components
- Add Expander component for consistent UI
- Loading spinners used consistently
- Specific names for society & treasury addresses
- Cleanup all voting lock, consistent display
- ... loads of other under-the-hood improvements and cleanups


## 0.39.1 Jan 31, 2020

- **Breaking** Drop support for V1 Substrate chains

Contributed:

- Translation into Chinese (Thanks to https://github.com/dushaobindoudou)
- Support for sign-only transactions (Thanks to https://github.com/mzolkiewski)

Changes:

- Add support for WestEnd testnet
- Add support for social recovery in accounts
- Add counters for all proposal-based apps
- Disable spellcheck on all input fields (privacy)
- Query the paymentInfo API to get weight fee information
- Remove FF warning with https:// -> ws://localhost
- Staking now supports where the controller or stash accounts are not local
- Social app
- Add support for identity setting (via identity module)
- Add support for registrars to hand out identity judgements
- Use both internal and lib hooks as applicable (refactoring)
- Support QR codes (accounts) with optional names
- Cleanup all Modals, simplify
- Adjust balance display formats
- Update to latest libraries (incl. util 2.0 & api 1.0)


## 0.38.1

Contributed:

- Fix summarybar in 123-code (Thanks to https://github.com/anakornk)
- Update Edgeware with correct keys (Thanks to https://github.com/drewstone)

Changes:

- Add InputAddressMulti inputs, both to council and staking nominators
- Rework all layouts, removing cards for table-ike-layouts
- Technical comittee app
- Allow for external proposal and queued for dispatch in democracy
- Add pre-image support to democracy proposals (including imminent)
- Improved staking page rendering (background)
- Update to latest libraries


## 0.37.1

Contributed:

- Support for contracts with new ABI v2 (Thanks to https://github.com/kwingram25)

Changes:

- Support for Kusama CC3
- Support for on-chain nicks
- Speed improvements for the staking pages
- Add account derivation from existing account
- Council voting with runner up & phragmen
- Allow favorites in validators pages
- Rework nominations to take favorites & current into account
- Enhance AddressCard with additional info (incl. vested)
- Move account/address actions to popup menu
- Convert a large number of components to use hooks
- Display validator graphs
- Refactor of backup modal (Thanks to @LukeSugiura)
- Enable language setting options (Thanks to @LukeSugiura)
- Allow for signRaw to be used in the signing toolbox (injected accounts)
- Display account names in status events
- Nomination targets dashboard
- Validator preferences are expressed as commission % as supported by chains
- Account locks are applied on a genesis range (e.g. CC2 & CC3 allow availability)
- ... lots of smaller enhancements & bug fixes


## 0.36.1

Changes:

- Api 0.95.1, Util 1.6.1, Extension 0.13.1
- Support latest contracts ABI (via API), incl. rework of contracts UI
- Support for Kusama CC2
- Support for Edgeware mainnet
- Experimental Ledger support
- Display forks on explorer (limited to Babe)
- Change settings to have Save as well as Save & Reload (depending on changes made)
- Updates to struct & enum rendering (as per extrinsic app)
- Backup, Password change & Delete don't show for built-in dev accounts
- Add commissions to the staking overview
- UI theme update
- A large number of components refactored for React functional components
- Allow dismiss of all notifications (via bounty)
- Migrate all buttons to have icons (via bounty)
- Proposal submission via modal (via bounty)
- i18n string extraction (via bounty)
- adjust signature validity (via bounty)
- Make the network selection clickable on network name (via bounty)
- ... and a number of cleanups all around


## 0.35.1

Changes:

- Api 0.91.1, Util 1.2.1, Extension 0.10.1
- Support for accounts added via Qr (for instance, the Parity Signer)
- Support for accounts tied to specific chains (instead of just available to all)
- GenericAsset app transfers
- Support for Edgeware with default types
- Display received heartbeats for validators
- Allow optional params (really as optional) in RPC toolbox
- Add Polkascan for Kusama
- Fix account derivation with `///password`
- Lots of component & maintainability cleanups


## 0.34.1

Changes:

- Kusama support
- Full support for Substrate 2.x & Polkadot 0.5.0 networks
- Lots of UI updated to support both Substrate 1.x & 2.x chains
- Add of claims app for Kusama (and Polkadot)
- Basic Council, Parachains & Treasury apps
- Moved ui-* packages to react-*


## 0.33.1

Changes:

- Allow for externally injected accounts (i.e. via extension, polkadot-js & SingleSource)
- Links to extrnisics & addresses on Polkascan
- Rework Account & Address layouts with cards
- Transfer can happen from any point (via Transfer modal)
- Use new api.derive functions
- Introduce multi support (most via api.derive.*)
- Update all account and address modals
- Add seconding of proposals
- Staking updates, including un-bonding & withdrawals
- Update explorer with global query on hash/blocks
- Add filters on the staking page
- Vanitygen now supports sr25519 as well
- Fixes for importing of old JSON
- Latest @polkadot/util & @polkadot/api
- A large number of optimizations and smaller fixes


## 0.32.1

Changes:

- Support for Substrate 1.0 release & metadata v4
- @polkadot/api 0.77.1


## 0.31.1

Changes:

- Cleanups, fixes and features around the poc-4 staking module
- Number of UI enhancements


## 0.30.1

Changes:

- Staking page indicator for offline nodes (count & block)
- Rework page tabs and content layouts
- Cleanup of all UI summary headers
- Emberic Elem support (replaces Dried Danta)


## 0.29.1

Changes:

- @polkadot/util & @polkadot/api 0.75.1


## 0.28.1

Changes:

- Support for substrate 1.0-rc


## 0.27.1

Changes:

- Bring in new staking & nominating functions
- Swap default keyring accounts (on creation) to sr25519
- New faster crypto algorithms
- Misc. bug fixes all around


## 0.26.1

Changes:

- Swap keyring to HDKD derivation, mnemonic keys are now not backwards compatible with those created earlier. (Defaults are still for ed25519)
- Swap crypto to new WASM-backed version (and remove libsodium dependency)
- UI to allow for derived keys for ed25519 and sr25519
- New mobile-friendly sidebar
- Fix issues with nominating (old non-bonds interface)


## 0.25.1

Changes:

- Swap to publishing -beta.x on merge (non-breaking testing)


 ## 0.24.1

Changes:

 Storage now handles Option type properly


 ## 0.23.1

Changes:

 JavaScript console introduced


## 0.22.1

Changes:

- Use new Compact<Index> transaction format - this requires the latest binaries from either Polkadot or Substrate


## 0.21.1

Changes:

- PoC-3 support with latest Substrate master & Polkadot master
- Add support for Charred Cherry (Substrate) and Alexander (Polkadot) testnets
- Too many changes to mention, master now only supports latest PoC-3 iteration
- Use https://poc-2.polkadot.io if access is required to PoC-2 era networks
