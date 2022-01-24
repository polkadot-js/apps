# CHANGELOG

## 0.103.1 Jan 24, 2022

Contributed:

- Update Equilibrium version (Thanks to https://github.com/mn13)
- Update Polish i18n (Thanks to https://github.com/jimmy-tudeski)
- Adjust proxy usage text (Thanks to https://github.com/gilescope)
- Adjust extension plural descriptions (Thanks to https://github.com/xnorly)
- Add Polkadex parachain information (Thanks to https://github.com/arrudagates)
- Add Litentry parachain info (Thanks to https://github.com/chenzongxiong)
- OnFinality endpoint for Nodle (Thanks to https://github.com/RossAtOnfinality)
- Update Clover types (Thanks to https://github.com/pangwa)
- Add Sora parachain info (Thanks to https://github.com/stefashkaa)
- Dwellir endpoint for Kilt (Thanks to https://github.com/Maharacha)
- Update Rococo genesis hash (Thanks to https://github.com/cmichi)

Changes:

- Make relay accounts visible on common-good & system parachains
- Adjust parachain display, preparing for expandable rows
- Adjust storage app, adjustment for start values
- Adjust status overlays (expandable content)
- Bump 3rd party dependencies (same version range)
- Allow for teleport where destination has no balances pallet
- Endpoint sorting adjustments
- Mark unreachable endpoints as disabled


## 0.102.1 Jan 17, 2022

Contributed:

- Reactivate Dwellir Kusama RPC (Thanks to https://github.com/Maharacha)
- Update Robonomics color and logo (Thanks to https://github.com/vol4tim)
- Update Moonbeam RPC (Thanks to https://github.com/joelamouche)
- Update InterBTC with derive for balances (Thanks to https://github.com/gregdhill)
- Add OnFinality endpoint for Quartz (Thanks to https://github.com/alanchang124)
- Update Bifrost endpoints (Thanks to https://github.com/awesomepan)
- Update SherpaX mainnet endpoint (Thanks to https://github.com/wbh1328551759)
- Update Polkadot and Canvas logos (Thanks to https://github.com/cmichi)
- Singular profiles for Kusama/Statemine/Acala/Bifrost (Thanks to https://github.com/abzen)
- Update types for AresGladios (Thanks to https://github.com/jiyilanzhou)
- Add hi_IN i18n (Thanks to https://github.com/itssravi)
- Add ur_IN i18n (Thanks to https://github.com/itsonal)

Changes:

- Align build steps with the rest of the polkadot-js repos
- Mark unreachable endpoints as disabled


## 0.101.1 Jan 10, 2022

Contributed:

- Add derive for Interbtc native balances (Thanks to https://github.com/gregdhill)
- Adjust transfer checks for non-available tx (Thanks to https://github.com/gregdhill)
- Update Interbtc types (Thanks to https://github.com/nud3l)
- Update Mandala (Thanks to https://github.com/nnnnnnnnnni)
- Update Robonomics types (Thanks to https://github.com/akru)
- Add RPC types of Interbtc (Thanks to https://github.com/nud3l)
- Add Competitors Club network (Thanks to https://github.com/jesselurie)
- Add Neumann network (Thanks to https://github.com/imstar15)
- Add Crab parachain (Thanks to https://github.com/sxlwar)
- Re-add Polkadex testnet (Thanks to https://github.com/simonsso)
- Added Dwellir Polkadot endpoints (Thanks to https://github.com/Maharacha)
- Add SherapX live network (Thanks to https://github.com/wbh1328551759)
- Add SherpaX testnet (Thanks to https://github.com/wbh1328551759)
- Remove all Elara endpoints (Thanks to https://github.com/zzcwoshizz)
- Update Crust Shadow endpoint (Thanks to https://github.com/yashirooooo)
- Adjust teleport fees message (Thanks to https://github.com/DrW3RK)
- Enable Subscan for Polkadot parachains (Thsnks to https://github.com/niklabh)
- Update OAK logo (Thanks to https://github.com/imstar15)

Changes:

- Remove inaccurate teleport destination fees
- Show empty logo for unknown extensions (instead of broken)
- Adjust asset table breakpoints
- Remove all Geometry endpoints
- Use relay identity for common good parachains
- Extract `derive.account.*` into hooks
- Test for duplicate endpoint URLs (& cleanup duplication)
- Adjust Subsocial imports (remove package use duplication)
- Update types from chain teams (external dependencies)


## 0.100.1 Dec 27, 2021

Contributed:

- Support for contracts storage deposit (Thanks to https://github.com/statictype)
- Remove Rococo Tick, Trick & Track (Thanks to https://github.com/BulatSaif)
- Add HydraX Polkadot parachain (Thanks to https://github.com/lumir-mrkva)
- Add Phala Polkadot parachain (Thanks to https://github.com/jasl)
- Update Clover endpoints (Thanks to https://github.com/jamesbayly)
- Add Sherpax testnet node (Thanks to https://github.com/wbh1328551759)
- Update Opportunity/Standard types (Thanks to https://github.com/firke)
- Staking tooltip grammar fix (Thanks to https://github.com/tarrball)
- Support new Moonbeam author extraction (Thanks to https://github.com/joelamouche)

Changes:

- Disable unreachable endpoints
- Bump to latest `@polkadot/api`


## 0.99.1 Dec 21, 2021

Contributed:

- Adjust Parity Statemine endpoints (Thanks to https://github.com/PierreBesson)
- Add Parity Statemint endpoints (Thanks to https://github.com/PierreBesson)
- Enable Teleport on Rococo (Thanks to https://github.com/PierreBesson)
- Adjust Rococo Tick endpoint (Thanks to https://github.com/BulatSaif)
- Adjust teleport weights (Thanks to https://github.com/apopiak)
- Styling fix for asset balance input (Thanks to https://github.com/goldsteinsveta)
- Adjust NFTMart staking params (Thanks to https://github.com/btwiuse)
- Adjust Genshiro information (Thanks to https://github.com/equilibrium-de)
- Adjust Heiko Parallel endpoints (Thanks to https://github.com/GopherJ)
- Adjust Dock endpoints (Thanks to https://github.com/SamHellawell)
- Add Parallel Polkadot parachain (Thanks to https://github.com/GopherJ)
- Add Bitfrost Polkadot parachain (Thanks to https://github.com/awesomepan)
- Add Crust Polkadot parachain (Thanks to https://github.com/mmyyrroonn)
- Add Clover Polkadot parachain (Thanks to https://github.com/pangwa)
- Add Moonbeam Polkadot parachain (Thanks to https://github.com/crystalin)
- Add Manta Polkadot parachain (Thanks to https://github.com/stechu)
- Add Acala Polkadot parachain (Thanks to https://github.com/qwer951123)
- Add Astar Polkadot parachain (Thanks to https://github.com/sirius651)
- Add Subsocial Polkadot parachain (Thanks to https://github.com/olehmell)
- Add Litentry Polkadot parachain (Thanks to https://github.com/chenzongxiong)
- Add Subgame Polkadot parachain (Thanks to https://github.com/xtony77)
- Add Efinity Polkadot parachain (Thanks to https://github.com/coinfork)
- Add Centrifuge Polkadot parachain (Thanks to https://github.com/mikiquantum)
- Add Pichiu Kusama parachain (Thanks to https://github.com/samelamin)
- Add Interlay Polkadot parachain (Thanks to https://github.com/nud3l)
- Add Equilibrium Polkadot parachain (Thanks to https://github.com/VladSemenik)
- Update Robonomics parachain info (Thanks to https://github.com/akru)
- Add Nodle parachain info (Thanks to https://github.com/ETeissonniere)
- Add Integritee mainnet (Thanks to https://github.com/brenzi)
- Add Composable Finance network (Thanks to https://github.com/composerpeter)
- Add Subspace Farmers network (Thanks to https://github.com/1devNdogs)
- Update Polymesh networks (Thanks to https://github.com/adamdossa)
- Update Bifrost types (Thanks to https://github.com/awesomepan)
- Bump Darwinia types (Thanks to https://github.com/sxlwar)
- Bump LBP types (Thanks to https://github.com/chenzongxiong)
- Bump Subsocial types (Thanks to https://github.com/olehmell)
- Bump Moonbeam types (Thanks to https://github.com/joelamouche)
- Bump Astar types (Thanks to https://github.com/bobo-k2)
- Bump GameDao types (Thanks to https://github.com/2075)
- Bump Kulupu types (Thanks to https://github.com/sorpaas)
- Bump Ternoa types (Thanks to https://github.com/markopoloparadox)
- Opal & Quartz updates for metadata v14 (Thanks to https://github.com/gregzaitsev)
- Adjust Encointer deployment (Thanks to https://github.com/brenzi)
- Add Pichiu network (Thanks to https://github.com/samelamin)
- Add Subdao networks (Thanks to https://github.com/sharkygg)
- Add Web3Games testnet (Thanks to https://github.com/Zombieliu)
- Add Ares Oddyssey network (Thanks to https://github.com/jiyilanzhou)
- Add Coinversation network (Thanks to https://github.com/LaceLetho)
- Add Automata & ContextFree testnets (Thanks to https://github.com/RyuH1)
- Add Geometry Labs endpoints (Thanks to https://github.com/robcxyz)
- Add Zeitgeist parachain config (Thanks to https://github.com/lsaether)
- Add Dolphin testnet (Thanks to https://github.com/dansofter)
- Add Kusari network (Thanks to https://github.com/masterdubs)
- Adjust Sora logos (Thanks to https://github.com/NoodleSploder)
- Update Acala endpoints (Thanks to https://github.com/ntduan)
- Update Astar live endpoints (Thanks to https://github.com/akru)
- Update Bifrost endpoints (Thanks to https://github.com/awesomepan)
- Update Aleph Zero endpoints (Thanks to https://github.com/timorl)
- Update ChainX endpoints (Thanks to https://github.com/icodezjb)
- Update InterBTC naming to Interlay (Thanks to https://github.com/savudani8)
- Updata Klaha network naming (Thanks to https://github.com/jasl)
- OnFlinality endpoint for Acala (Thanks to https://github.com/RossAtOnfinality)
- OnFinality endpoint for Statemint (Thanks to https://github.com/454076513)
- OnFinality endpoint for Shiden fix (Thanks to https://github.com/alanchang124)
- OnFinality endpoint for Bit.Country (Thanks to https://github.com/alanchang124)
- OnFinality endpoint for Parallel (Thanks to https://github.com/RossAtOnfinality)
- OnFinality endpoint for Moonbeam (Thanks to https://github.com/alanchang124)
- OnFinality endpoint for Clover & Astar (Thanks to https://github.com/alanchang124)
- Adjust Elara endpoints (Thanks to https://github.com/FreePoi)
- Adjust Calamari endpoints (Thanks to https://github.com/grenade)
- Adjust Moonbeam endpoints (Thanks to https://github.com/joelamouche)
- Dwellir Kusama endpoints (Thanks to https://github.com/Maharacha)
- Add external links to Subsquare (Thanks to https://github.com/wliyongfeng)
- Adjust tokendecimal retrieval (Thanks to https://github.com/sxlwar)
- Update Subspace derives (Thanks to https://github.com/1devNdogs)
- Support Subspace blockchain calculations (Thanks to https://github.com/1devNdogs)

Changes:

- Allow for storage queries at a specific block
- Add support for `limitedTeleportAssets`
- Fix `?rpc=` param not taking effect
- Adjust assets to cater for latest Substrate
- Update unreachable endpoints
- Add a rebond staking modal
- Adjust warning on ,large bond amounts
- Adjust parachain display (no hrmp)
- Adjust uncaught error displays
- Adjust hooks with named variants (error-catch related)
- Remove derivation option for Ethereum accounts (not implemented)
- Disable Settings -> Developer for metadata v14
- Bump to latest `@polkadot/api` & `@polkadot/util`


## 0.98.1 Oct 25, 2021

Contributed:

- Fix number inputs in Vote value (Thanks to https://github.com/awesomepan)
- Update nominations warning message (Thanks to https://github.com/DrW3RK)
- Update Acala types (Thanks to https://github.com/qwer951123)
- update Bifrost types (Thanks to https://github.com/awesomepan)
- Update Dawninia types (Thanks to https://github.com/sxlwar)
- Update Dock testnet (Thanks to https://github.com/SamHellawell)
- Update Realis types (Thanks to https://github.com/Daelon02)
- Update Subspace testnet (Thanks to https://github.com/1devNdogs)
- Add Altair network (Thanks to https://github.com/mikiquantum)
- Add Bit.County Pioneer to Kusama parachains (Thanks to https://github.com/justinphamnz)
- Add Quartz network (Thanks to https://github.com/gregzaitsev)
- Re-enable Statemine via OnFinality (Thanks to https://github.com/454076513)

Changes:

- Adjust `Bytes` input to show IdentityIcon when ss58 is detected
- Use `*RuntimeProxyType` as applicable to detect enum entries
- Use type overrides as available in metadata variants
- Override `*RuntimeSessionKeys` to allow for rotateKeys inputs
- Fix depositor check inside multisig cancel operations
- Adjust type labels with overrides & overflow formatting
- Adjust multisig calls to be made in parallel
- Cater for Ledger 25 word mnemonic imports
- Adjust query button to a link (allow for open in a new window)
- Some css warning fixes
- Remove any unavilable endpoints from the list
- Attempt allowing Ledger desktop connections (via node HID)
- Ensure non-detected signature types result in a failure
- Filter proxy selection with only those non-delayed
- Swap warnings on mismatched import JSON types to an error
- Ensure addresses are searchable when lists are filtered by identity
- Display warning on tip creation when no recipient account is found
- Correctly show disabled menu items as disabled (non-clickable)
- Expand proposal hashes for fastTrack proposals in TC
- Display society vouch tip column
- Alow for society Unvouch and Vouching operations
- Ensure accounts are non-editable when `isEditable` flag is not set
- Ensure proposal weight is calculated before allowing proposal close
- User `balances.transferAll` if available and full amount is transferred


## 0.97.1 Oct 19, 2021

Contributed:

- Add support for substracte-contracts-node (Thanks to https://github.com/cmichi)
- Align contracts styling with accounts (Thanks to https://github.com/ekowalsk)
- Fix table coloring when applying filters (Thanks to https://github.com/ekowalsk)
- Apply styles to unbonding icon (Thanks to https://github.com/MiZiet)
- Style account badges (Thanks to https://github.com/ekowalsk)
- Style redeemable balances (Thanks to https://github.com/MiZiet)
- Split display of registrars (Thanks to https://github.com/MiZiet)
- Disable unreachable networks (Thanks to https://github.com/krzysztof-jelski)
- Increase UI test timeouts (Thanks to https://github.com/krzysztof-jelski)
- Update French i18n (Thanks to https://github.com/tomaka)
- Update Italian i18n (Thanks to https://github.com/fomod-in)
- Update Subscan links (Thanks to https://github.com/carlhong)
- Fix typos (Thanks to https://github.com/xnorly)
- Use latest substrate connect (Thanks to https://github.com/wirednkod)
- Add OnFinality endpoint for Altair (Thanks to https://github.com/454076513)
- Add OnFinality endpoint for Kintsuigi (Thanks to https://github.com/454076513)
- Add OnFinality endpoint for Sora (Thanks to https://github.com/454076513)
- Add OnFinality endpoint for Subsocial (Thanks to https://github.com/454076513)
- Add Zeitgeist Battery endpoints (Thanks to https://github.com/saboonikhil)
- Fix Kintsuigi parachain key (Thanks to https://github.com/savudani8)
- Remove old endpoints for Hydra (Thanks to https://github.com/lumir-mrkva)
- Add Ares testnet (Thanks to https://github.com/jiyilanzhou)
- Add MathChain mainnet (Thanks to https://github.com/hging)
- Add NFTMart mainnet (Thanks to https://github.com/btwiuse)
- Add Opal network (Thanks to https://github.com/gregzaitsev)
- Add Polkadex mainnet (Thanks to https://github.com/Gauthamastro)
- Add Spartan network (Thanks to https://github.com/1devNdogs)
- Add Unorthodox parachain (Thanks to https://github.com/billjhlee)
- Adjust Bifrost types (Thanks to https://github.com/awesomepan)
- Adjust Edgeware logo (Thanks to https://github.com/Depth-Hoar)
- Adjust Acala types (Thanks to https://github.com/qwer951123)
- Adjust Basilisk types (Thanks to https://github.com/lumir-mrkva)
- Adjust Darwinia types (Thanks to https://github.com/sxlwar)
- Adjust Equilibrium types (Thanks to https://github.com/mn13)
- Adjust Kilt types (Thanks to https://github.com/wischli)
- Adjust Moonbeam types (Thanks to https://github.com/joelamouche)
- Adjust Phala types (Thanks to https://github.com/jasl)
- Adjust Pontem types (Thanks to https://github.com/idimetrix)
- Adjust Realis types (Thanks to https://github.com/Daelon02)
- Adjust Shiden types (Thanks to https://github.com/akru)
- Adjust Shiden types (Thanks to https://github.com/hoonsubin)
- Adjust Snowbridge types (Thanks to https://github.com/vgeddes)
- Adjust Subgame types (Thanks to https://github.com/xtony77)
- Adjust Subsocial types (Thanks to https://github.com/olehmell)
- Adjust Ternoa types (Thanks to https://github.com/markopoloparadox)

Changes:

- Display multiple vesting schedules as found
- Expand error messaging when zero claim balance is found
- Fix map queries for metadata v14
- Display correct types for metadata v14 in constants
- Don't show unused enum fields from metadata v14
- Remove contracts rent projection (removed from Substrate)
- Adjust for latest Rococo reset
- Adjust base Xcm weights (now all aligned with Kusama)
- Adjust handling for old dedupeKeyPrefix (now unused)
- Align signing output with extension (w/ `<Bytes>`)
- Remove non-working endpoints as detected
- Support metadata v14 lookupName in type extraction
- Adjust formatting for `everything` Balance displays
- Small fixes to input boxes
- Expand events with lookup types
- Cater for versioned teleport operations
- Add support for contracts with scale-info v1
- Adjust types output display from `toHuman` formatters
- Fix payloads for Westmint 500


## 0.96.1 Sep 20, 2021

Contributed:

- Rebrand interBTC (Thanks to https://github.com/savudani8)
- Replace interBTC production chain (Thanks to https://github.com/savudani8)
- Update interBTC types (Thanks to https://github.com/gregdhill)
- Add interBTC to Westend (Thanks to https://github.com/gregdhill)
- Add interBTC Kintsugi (Thanks to https://github.com/nud3l)
- Update Snowbridge types (Thanks to https://github.com/vgeddes)
- Move Shibuya testnet to dedicated (Thanks to https://github.com/akru)
- Fix Shiden network names (Thanks to https://github.com/akru)
- OnFinality endpoint for Kilt (Thanks to https://github.com/454076513)
- OnFinality endpoint for Calamari (Thanks to https://github.com/454076513)
- OnFinality endpoint for Basilisk (Thanks to https://github.com/454076513)
- Update Kilt types & UI components (Thanks to https://github.com/wischli)
- Subscan links for Kilt (Thanks to https://github.com/wischli)
- Add Polkassembly community endpoints (Thanks to https://github.com/wischli)
- Dwellir endpoints for Kusama (Thanks to https://github.com/Maharacha)
- Add Spanner network (Thanks to https://github.com/igorgogo)
- Update Robonomics endpoints (Thanks to https://github.com/vol4tim)
- Update Bifrost Foundation to Liebi (Thanks to https://github.com/awesomepan)
- Update Bifrost types (Thanks to https://github.com/awesomepan)
- Update types for Realis (Thanks to https://github.com/Daelon02)
- Update Crust endpoints (Thanks to https://github.com/yuhui1208)
- Updata Darwinia types (Thanks to https://github.com/WoeOm)
- Update Phala Poc-4 to Chala (Thanks to https://github.com/jasl)
- Update Phala types (Thanks to https://github.com/jasl)
- Update Subgame types (Thanks to https://github.com/momo200e)
- Update OriginTrail types (Thanks to https://github.com/NZT48 & https://github.com/kotlarmilos)
- Update Acala types (Thanks to https://github.com/qwer951123)
- Update UniArts providers (Thanks to https://github.com/sunnyCoCosun)
- Update KILT paraId (Thanks to https://github.com/weichweich)
- Update Charcoal paraId (Thanks to https://github.com/mikiquantum)
- Update Basilisk paraId (Thanks to https://github.com/lumir-mrkva)
- Update Altair paraId (Thanks to https://github.com/mikiquantum)
- Update Moonbeam types (Thanks to https://github.com/joelamouche)
- Update WILT paraId & types (Thanks to https://github.com/weichweich)
- Update Genshiro paraId (Thanks to https://github.com/alex-nax)
- Add Lavendar parachain (Thanks to https://github.com/phamsonha)
- Add Genshiro standalone (Thanks to https://github.com/alex-nax)
- Add Crown Sterling chain (Thanks to https://github.com/crownsterlingllc)
- Add external types for Zero (Thanks to https://github.com/2075)
- Update Integritee homepage and RPcs (Thanks to https://github.com/brenzi)
- Add additional endpoints (Thanks to https://github.com/brenzi)
- Update Calamari homepage link (Thanks to https://github.com/Dengjianping)
- Remove Crab Redirect (Thanks to https://github.com/sxlwar)
- Add Picasso mainnet (Thanks to https://github.com/composabledev)
- Add Parallel Heiko chain (Thanks to https://github.com/GopherJ)
- Add Statescan to as external explorer (Thanks to https://github.com/wliyongfeng)
- Add Dottreasury as external explorer (Thanks to https://github.com/wliyongfeng)
- Add Sub.Id as an external explorer (Thanks to https://github.com/olehmell)
- Update endpoints for Elara v2 (Thanks to https://github.com/FreePoi)
- Update Pinknode endpoints (Thanks to https://github.com/Capeguy)
- Update Pontem types (Thanks to https://github.com/idimetrix)
- Add Netcoin chain (Thanks to https://github.com/sorpaas)
- Add Pangoro testchain (Thanks to https://github.com/sxlwar)
- Add additional nodes for Calamari (Thanks to https://github.com/grenade)
- Change Aleph Zero testnet name (Thanks to https://github.com/maciejnems)
- Adjust Bit.Country endpoint (Thanks to https://github.com/justinphamnz)
- Allow tx submission for decoding tab (Thanks to https://github.com/xlc)
- Adjust max balance on transfer modal (Thanks to https://github.com/maciejnems)
- Clarify conviction locking (Thanks to https://github.com/JoshOrndorff)
- Adjust minimumPeriod thresholds (Thanks to https://github.com/fixxxedpoint)
- Style UI tags (Thanks to https://github.com/MiZiet & https://github.com/ekowalsk)
- Set width to flags (Thanks to https://github.com/MiZiet)
- Add summary to accounts (Thanks to https://github.com/vitaliyworks & https://github.com/krzysztof-jelski)
- Style account rows (Thanks to https://github.com/wachulski, https://github.com/vitaliyworks, https://github.com/MiZiet & https://github.com/ekowalsk)
- Replace SUI modal with apps-specific modal (Thanks to https://github.com/MiZiet)
- Replace sidebar links with icons (Thanks to https://github.com/ekowalsk)
- Replace SUI popup with apps-specific version (Thanks to https://github.com/MiZiet)
- Allow keyboard navigation in create modal (Thanks to https://github.com/MiZiet & https://github.com/ekowalsk)
- Dedupe create & derive account modals (Thanks to https://github.com/vitaliyworks & https://github.com/MiZiet)
- Add account view sorting (Thanks to https://github.com/vitaliyworks, https://github.com/krzysztof-jelski, https://github.com/MiZiet & https://github.com/ekowalsk)
- Adjust sidebar editing via single button (Thanks to https://github.com/ekowalsk & https://github.com/MiZiet)
- Account page styling adjustments (Thanks to https://github.com/MiZiet)
- Align address view with accounts (Thanks to https://github.com/ekowalsk & https://github.com/MiZiet)
- Fixes for UI tests and setup (Thanks to https://github.com/krzysztof-jelski)
- Reduce warning in tests (Thanks to https://github.com/krzysztof-jelski)

Changes:

- Discard invalid minimumPeriod values (block times)
- Cater for metadata v14 & latest API
- Hide/disable non-available network endpoints
- Adjust detection for parachain module locations
- Ensure unreachable endpoints are sorted & checked
- Extract teleport weight constants on a per-genesis basis
- Only allow gilt bids via pure proxy
- Pass open/aye votes for TC in batch
- Allow collective proposal close for any account
- Cleanup `@polkadot/app-config` exports
- Adjust `@polkadot/apps-config` to latest chain types


## 0.95.1 Aug 2, 2021

Contributed:

- Integrate Substrate connect (Thanks to https://github.com/wirednkod)
- Bump Substrate connect dependencies (Thanks to https://github.com/raoulmillais)
- Robonomics Kusama parachain (Thanks to https://github.com/ensrationis)
- Typo fix (Thanks to https://github.com/gangelop)
- Update Robomonics logo (Thanks to https://github.com/vol4tim)
- Bump Acala types (Thanks to https://github.com/xlc)
- Enable Subscan on Karura (Thanks to https://github.com/xlc)
- Adjust PureStake provider name (Thanks to https://github.com/albertov19)
- Bump Phala types (Thanks to https://github.com/limichange)
- Update Altair crowdloan values (Thanks to https://github.com/mikiquantum)
- Update Altair endpoint (Thanks to https://github.com/branan)
- Add Kpron (Thanks to https://github.com/sharkygg & https://github.com/Apron2050)
- Add Bifrost OnFinality provider (Thanks to https://github.com/454076513)
- Add OriginTrail para testnet (Thanks to https://github.com/NZT48 & https://github.com/kotlarmilos)
- Update Edgeware production/testing (Thanks to https://github.com/drewstone)
- Add chainType for chain info transfer (Thanks to https://github.com/joelamouche)
- Update Equilibrium types (Thanks to https://github.com/alex-nax & https://github.com/pr0fedt)
- Update Realis types (Thanks to https://github.com/Daelon02)
- Update for Qr address imports (Thanks to https://github.com/joelamouche)
- Elara providers for Karura, Moonriver & Bifrost (Thanks to https://github.com/zzcwoshizz)
- Update Sora providers (Thanks to https://github.com/stefashkaa)
- Add Basilik Kusama details (Thanks to https://github.com/lumir-mrkva)
- Add Zeitgeist parachain for Kusama (Thanks to https://github.com/c410-f3r)
- Update Pangolin & Crab types (Thanks to https://github.com/WoeOm)
- Add Fantour network config (Thanks to https://github.com/noodleslove)
- Add Loom Kusama parachain (Thanks to https://github.com/NightingaleAsh & https://github.com/enlight)
- Integritee parachain config (Thanks to https://github.com/brenzi)
- Update Unique types (Thanks to https://github.com/gregzaitsev)
- Add zCloak network (Thanks to https://github.com/Lohsea)
- Update Dotscanner URLs (Thanks to https://github.com/Deekor)
- Dotscanner support for Kusama (Thanks to https://github.com/Deekor)
- Update NFTMart logo (Thanks to https://github.com/caosbad)
- Update Moonbeam types (Thanks to https://github.com/joelamouche)
- Add Calamari network logo (Thanks to https://github.com/Dengjianping)
- Update Westend logos (Thanks to https://github.com/wirednkod)
- Add Trustbase network (Thanks to https://github.com/ygsgdbd)
- Add type check on address import (Thanks to https://github.com/joelamouche)
- Update Bifrost types (Thanks to https://github.com/awesomepan)
- Fix translation typos (Thanks to https://github.com/anvie)
- Add Aleph testnet (Thanks to https://github.com/timorl)
- Accounts testing infrastructure (Thanks to https://github.com/wachulski)
- Update Khala types (Thanks to https://github.com/jasl)
- Set Subscan link for Shiden (Thanks to https://github.com/akru)

Changes:

- Remove providers with reliability & availability problems
- taxIndex -1 for all hints
- Fix InputNumber max check
- Correctly use si values on InputNumber on disabled
- Derive treasury account from palletId
- Adjust Ledger app lookups via hash
- Warn about off-chain crowdloan contributions
- Fix isDisabled rendering for Option
- Rework collective queries (multiple instances)
- Don't show council elections with no pallet
- Use gasRequired (as available) for contract estimations
- Clear dispatch queue display on dispatch


## 0.94.1 Jun 28, 2015

Contributed:

- Fix Electon QR scanning on Mac (Thanks to https://github.com/wachulski)
- Update Bifrost homepage (Thanks to https://github.com/awesomepan)
- Update Darwinia Redirect endpoint (Thanks to https://github.com/sxlwar)
- Additional Sora endpoint (Thanks to https://github.com/pgolovkin)
- OnFinality endpoints for Khala, Moonriver, Shiden (Thanks to https://github.com/454076513)
- Add Pinknode endpoints for relays & parachains (Thanks to https://github.com/Capeguy)
- Additional Karura endpoints (Thanks to https://github.com/xlc)
- Polkawallet endpoint for Karura (Thanks to https://github.com/qwer951123)
- Update Phala types (Thanks to https://github.com/limichange)
- Update Subsocial types (Thanks to https://github.com/olehmell)
- Update Beresheet types (Thanks to https://github.com/raykyri)
- Update Datahighway types (Thanks to https://github.com/ayushmishra2005)
- Update Realis types (Thanks to https://github.com/Daelon02)
- Update Genshiro details (Thanks to https://github.com/alex-nax & https://github.com/pr0fedt)
- Update Zeitgeist details (Thanks to https://github.com/c410-f3r & https://github.com/lsaether)
- Update OriginTrail details (Thanks to https://github.com/kotlarmilos & https://github.com/NZT48)
- Add support for new Moonbeam authors (Thanks to https://github.com/joelamouche)
- Adjust Neatcoin inflation params (Thanks to https://github.com/sorpaas)
- Update Kilt logo (Thanks to https://github.com/rflechtner)
- Fix language in chain specifications (Thanks to https://github.com/andresilva)
- Fix docker build (Thanks to https://github.com/sorpaas)

Changes:

- Change endpoint display naming
- Interleave crowdloans even with no bids
- Filter auctions with `isWinner` flag
- Filter crowdloan active raises on `isWinner`
- Randomize parachain API endpoint usage
- Split CI checks for types & availability
- Add support for `state_queryStorage` results on RPC execution pages
- Remove support for Substrate 2.0 payouts
- Split endpoint selection menu with relays
- Add warning for staking minium bonds
- Remove reference to defunct vanity wildcard
- Adjust explorer display with no extrinsics
- Adjust fasttrack delay default to 1 hr
- Add loading indicator for contributions
- Display overall total nominator counts


## 0.93.1 Jun 14, 2021

Contributed:

- Fix Electon QR scanning on Mac (Thanks to https://github.com/wachulski)
- Add Altair & Charcoal networks (Thanks to https://github.com/branan)
- Add Opportunity network (Thanks to https://github.com/billjhlee & https://github.com/hskang9)
- Add Genshiro network (Thanks to https://github.com/alex-nax & https://github.com/pr0fedt)
- Add Ares Mars network (Thanks to https://github.com/jiyilanzhou)
- Add Subgame networks (Thanks to https://github.com/momo200e)
- Update types for Realis (Thanks to https://github.com/Daelon02)
- Update logo/colors for Kilt (Thanks to https://github.com/wischli)
- Add OnFinality Kuarura endpoint (Thanks to https://github.com/454076513)
- Update PolkaSmith title (Thanks to https://github.com/hoangnl2112)
- Update Shiden homepage (Thanks to https://github.com/akru)
- Update Darwinia Crab Redirect homepage (Thanks to https://github.com/sxlwar)

Changes:

- Fix docker build commands
- Adjust crowdloan display delays
- Update network entries with no DNS
- Update theme config with name-checked records
- Check endpoint ordering on CI
- Adjust parachain hooks using mounted references
- Remove Flaming Fir network (RPCs inoperational)


## 0.92.3 Jun 9, 2021

Changes:

- Downgrade electron-builder


## 0.92.2 Jun 9, 2021

Contributed:

- Add OnFinality providers for Statemine & Westmint (Thanks to https://github.com/xsteadybcgo)
- Extract Moonbeam author ids (Thanks to https://github.com/joelamouche)
- Add Whala network (Thanks to https://github.com/jasl & https://github.com/limichange)
- Add Moonriver network (Thanks to https://github.com/crystalin)
- Add Basilisk Egg network (Thanks to https://github.com/lumir-mrkva)
- Add Kilt to Westend (Thanks to https://github.com/wischli)
- Update Crab network (Thanks to https://github.com/WoeOm)
- Update Jupiter types (Thanks to https://github.com/zzcwoshizz)
- Update Polkadex types (Thanks to https://github.com/Gauthamastro)
- Update Dock types (Thanks to https://github.com/lovesh)
- Update Moonbeam types (Thanks to https://github.com/joelamouche)
- Update Realis types (Thanks to https://github.com/Daelon02)

Changes:

- Adjust apps-electron, taking care of 0.92.1 launching
- Allow teleport for Kusama <-> Statemine
- Calculate and display teleport fees
- Fix Patract Elara endpoints on Westend
- Fix calculation of auction end slots
- Fix crowdloan own contribution extraction
- Display own contribution on crowdloans
- Add link to chain homepages on crowdloans
- Display blocknumber on calendar
- Adjust Polkadot-icons based on specName
- Adjust payout button layout (no content shift)
- Mark endpoints as unreachable (via cron detection)
- Randomize provider selection


## 0.92.1 Jun 7, 2021

Contributed:

- Update WarmUp script with isReady checks (Thanks to https://github.com/wirednkod)
- Update validator graphs to take theme into account (Thanks to https://github.com/gngchrs)
- Add Darwinia Crab Kusama parachain (Thanks to https://github.com/WoeOm)
- Add Encointer Kusama parachain (Thanks to https://github.com/brenzi)
- Add IntegiTEE Kusama parachain (Thanks to https://github.com/brenzi)
- Add Genshiro Kusama parachain (Thanks to https://github.com/alex-nax)
- Add Karura Kusama parachain (Thanks to https://github.com/ntduan)
- Add Shiden Kusama parachain (thanks to https://github.com/akru)
- Adjust Bifrost branding (Thanks to https://github.com/awesomepan)
- Adjust Crust Shadow branding (Thanks to https://github.com/zikunfan)
- Adjust Equilibrium definitions (Thanks to https://github.com/alex-nax & https://github.com/pr0fedt)
- Add Kylin as Rococo parachain (Thanks to https://github.com/samelamin)
- Add Moonshadow as Westend parachain (Thanks to https://github.com/crystalin & https://github.com/joelamouche)
- Add Manta testnet (Thanks to https://github.com/Kevingislason)
- Add Pontem testnet (Thanks to https://github.com/idimetrix)
- Add KlugDossier testnet (Thanks to https://github.com/sbnair)
- Add Oak testnet (Thanks to https://github.com/chrisli30 & https://github.com/imstar15)
- Add Sakura parachain (Thanks to https://github.com/pangwa)
- Add Shibuya Westend parachain (Thanks to https://github.com/akru)
- Update Manta types (Thanks to https://github.com/stechu)
- Update Zero.io types (Thanks to https://github.com/2075)
- Update types for HydraDX (Thanks to https://github.com/jak-pan)
- Update Moonbeam types (Thanks to https://github.com/joelamouche)
- Update PolkaBTC types (Thanks to https://github.com/savudani8)
- Update Acala types (thanks to https://github.com/qwer951123)
- Update Plasm types (Thanks to https://github.com/hoonsubin)
- Update Realis types (Thanks to https://github.com/Daelon02)
- Update Phala types (Thanks to https://github.com/krhougs)
- Update Pangolin types (Thanks to https://github.com/sxlwar)
- Update Polkafoundry types (Thanks to https://github.com/hoangnl2112)
- Update DataHighway specName (Thanks to https://github.com/ayushmishra2005)
- Update Bifrost WSS url (Thanks to https://github.com/awesomepan)
- Update Westmint WSS url (Thanks to https://github.com/PierreBesson)
- Update VLN WSS url (Thanks to https://github.com/stanly-johnson)
- Add OnFinality endpoint for Statemine (Thanks to https://github.com/454076513)

Changes:

- Allow for XCM asset teleport
- Add support for Kusama Statemine parachain
- Add support for Kusama Shell parachain
- Add support for Westend Westmint parachain
- Adjust branding details for Statemine, Statemint & Westmint
- Adjust proposal threshold for staking slash cancel
- Allow for color/logo definition based on specName
- Adjust autoFocus on Validate & Session key staking partials
- Fully expand DispatchResult in explorer
- Display current approvals on multisig modals
- Display expanded call data on multisig modal
- Correct validator mapping to assignment groups
- Display currently selected parachain validators
- Display current validator group in parachains page
- Don't display renamed inclusion/backed events
- Simplify validator list rendering
- Allow for inflation adjustment based on auctions
- Display ideal staked info on staking
- Adjust TC fasttrack thresholds based on voting input
- Sort Westend parachain ids
- Adjust Tabs imports (code consistency & usage)
- Update tests to cater for Jest 27
- Allow for verifier signature on crowdloan
- Adjust Rococo parachains (& genesis) after reset
- Add option for Ledger via WebHID
- Add call decoder of extrinsics page
- Use type-only BN imports (as applicable)
- Always show development chain in dev colors
- Re-format static Balance displays for detected SI units
- Add cron detection for invalid WS endpoints


## 0.91.2 May 17, 2021

Changes:

- Update electron-builder dependency, attempting to fix publish from CI


## 0.91.1 May 17, 2021

Contributed:

- Fix elapsed time minute formatting (Thanks to https://github.com/andresilva)
- Fix i18n loading with no data (Thanks to https://github.com/fadomire)
- Update BitCountry types (Thanks to https://github.com/justinphamnz)
- Update VLN types (Thanks to https://github.com/stanly-johnson)
- Update types for Zeitgeist (Thanks to https://github.com/lsaether)
- Update types for Darwinia (Thanks to https://github.com/WoeOm)
- Update types for Galital (Thanks to https://github.com/masterdubs)
- Update types for Moonbeam (Thanks to https://github.com/joelamouche)
- Update types for Dusty (Thanks to https://github.com/hoonsubin)
- Update types for SORA (Thanks to https://github.com/stefashkaa)
- Update types for Ternoa (Thanks to https://github.com/ETeissonniere)
- Update types for Polkafoundry (Thanks to https://github.com/hoangnl2112)
- Update Gamepower types (Thanks to https://github.com/GamePowerDev)
- Update Uni Arts types (Thanks to https://github.com/tianxiemaochiyu)
- Update Steam types (Thanks to https://github.com/johnwhitton)
- Support for Snakenet gen-3 (Thanks to https://github.com/jak-pan)
- Add Zeitgeist Rococo parachain (Thanks to https://github.com/c410-f3r)
- Add Moonrock Rococo parachain (Thanks to https://github.com/crystalin)
- Adjust Crust Rococo paraId (Thanks to https://github.com/yuhui1208)
- Adjust Eave Rococo paraId (Thanks to https://github.com/johnwhitton)
- Add GamePower testnet (Thanks to https://github.com/GamePowerDev & https://github.com/MikeHuntington)
- Add Pangolin testnet (Thanks to https://github.com/sxlwar)
- Add Geeknet testnet (Thanks to https://github.com/nasa8x)
- Add Centrifuge Rococo endpoint (Thanks to https://github.com/mikiquantum)
- Add Khala Kusama parathread (Thanks to https://github.com/h4x3rotab)
- Add Prism Kusama parathread (Thanks to https://github.com/chrissoso)
- Add Cust Shadow Kusama parathread (Thanks to https://github.com/zikunfan)
- Add Kilt Kusama parathread (Thanks to https://github.com/wischli)
- Add SherpaX Kusama parathread (Thanks to https://github.com/icodezjb)
- Add Bifrost Kusama parathread (Thanks to https://github.com/awesomepan)
- Add Patract Elara endpoint for Moonbase (Thanks to https://github.com/zzcwoshizz)
- Add Patract Elara endpoint for Subsocial (Thanks to https://github.com/zzcwoshizz)
- Add Polymath provider (Thanks to https://github.com/satyamakgec & https://github.com/Tamir-Polymath)

Changes:

- Display specName/specVersion for current chain
- Adjust parachains for Westend & Kusama modules
- Show call data and call hash on extinsics page
- Fix auction first-last display (based on chain constants)
- Allow file hash upload to `H256` types
- Use registration nextId for parachain setup
- Show treasury details in council proposals
- Ensure alphabetical chain ordering
- Show reserved amount for proxy creation
- Sort by and display ss58 in chain settings
- Adjust logo/color overrides to be alphabetical
- Check for registered code for allowing parachain bidding
- Always populate paraId from owners (after registration)
- Add Shell parachain to Westend
- Allow UI to work with no balances/timestamp modules (as per Shell)
- Display parathread info via para API (in addition to parachain)
- Cater for electionsPhragmen -> phragmenElection modules
- Cater for council votes on prev-generation chains

## 0.90.1 May 3, 2021

Contributed:

- Simplify derivation for ETH-like accounts (Thanks to https://github.com/joelamouche)
- Added Westend OnFinality endpoint (Thanks to https://github.com/454076513)
- Update Apron Rococo config (Thanks to https://github.com/guenit)
- Add support for Dotscanner links (Thanks to https://github.com/Deekor)
- Update Dusty types (Thanks to https://github.com/akru)
- Upgrade Zeitgeist types (Thanks to https://github.com/lsaether)
- Update Manta Rococo config (Thanks to https://github.com/zhenfeizhang & https://github.com/Dengjianping)
- Update Darwinia types (Thanks to https://github.com/WoeOm)
- Update IPSE config (Thanks to https://github.com/shareven)
- Update Ares paraId on Rococo (Thanks to https://github.com/lyxyx)
- Add Sora mainnet (Thanks to https://github.com/Nikita-Polyakov)
- Add Konomi config for Rococo (Thanks to https://github.com/willeslau)
- Added Edgeware OnFinality endpoint (Thanks to https://github.com/454076513)
- Added Vodka testnet (Thanks to https://github.com/sorpaas)
- Add Netcoin mainnet (Thanks to https://github.com/sorpaas)
- Optimize staking accounts tabs with loaded flag (Thanks to https://github.com/krzysztof-jelski)
- Update Realis network logo (Thanks to https://github.com/Daelon02)

Changes:

- Display extrinsic weights in explorer details
- Display block stats in explorer block details
- Allow for asset display when no metadata is present
- Add app for Membership (as deployed on Rococo)
- Reworks global events extraction
- Adjust line breaks on Table columns at 100%
- Added `useMap{Entries, Keys}` hooks
- Optimize crowdloan data extraction
- Adjust event trigger hooks with explicit blockhash
- Show reserved amounts for council voting
- Add error when reward destination account doesn't exist
- Remove support for v2 contracts
- Fix copy on explorer expanded block page
- Make balances & timestamp optional for chains
- Align bounty display with UI colors


## 0.89.1 Apr 26, 2021

Contributed:

- Update Phala Rococo paraId (Thanks to https://github.com/h4x3rotab)
- Update config for Phala Poc-4 (Thanks to https://github.com/Anonymous-Hentai)
- Update Jupiter Rococo paraId (Thanks to https://github.com/zzcwoshizz)
- Update ChainX & Zenlink Rococo paraIds (hanks to https://github.com/icodezjb)
- Update Nftmart config (Thanks to https://github.com/caosbad)
- Update balances retrieval on Equilibrium (Thanks to https://github.com/alexdniep)
- Update HydraDx config with archive nodes (Thanks to https://github.com/lumir-mrkva)
- Update Web3Games config (from Sgc, Thanks to https://github.com/Zombieliu)
- Update Darwinia Crab config (Thanks to https://github.com/WoeOm)
- Update Parami text (Thanks to https://github.com/hellotrongo)
- Swap Kilt types to npm package (Thanks to https://github.com/Dudleyneedham)
- Added Patract Elara support for Westend (Thanks to https://github.com/zzcwoshizz)
- Added IPSE network config (Thanks to https://github.com/shareven)
- Fr i18n fixes (thanks to https://github.com/n3wborn)

Changes:

- Remove display for empty prior democracy locks
- Add endpoint for Statemint to Rococo
- Adjust asset create to use batch hook
- Adjust signer fee calc & displays
- Adjust canvas types for `Address` usage
- Show asset total supply
- Allow balance inputs to take configurable decimal/symbol
- Add support for asset minting
- Add support for asset transfers


## 0.88.1 Apr 19, 2021

Contributed:

- Added Nftmart config (Thanks to https://github.com/caosbad)
- Update Zenlink config (Thanks to https://github.com/icodezjb)
- Update Darwinia Crab config (Thanks to https://github.com/WoeOm)
- Added Riochain config (Thanks to https://github.com/david-rio)
- Update Bifrost Rococo config (Thanks to https://github.com/yooml)
- Added VLN Rococo config (Thanks to https://github.com/stanly-johnson)
- Added Datahighway Westlake config (Thanks to https://github.com/cgroeschel)
- Update Polkafoundry config (Thanks to https://github.com/hoangnl2112)
- Adjust Parami logo (thanks to https://github.com/hellotrongo)
- Update Galital config (thanks to https://github.com/masterdubs)
- Add Prism Rococo parachain (Thanks to https://github.com/chrissoso)
- Add HydraDx Snakenet Gen 2 (Thanks to https://github.com/lumir-mrkva)
- Update Apron Rococo paraId (thanks to https://github.com/Apron2050)
- Update Clover logo (Thanks to https://github.com/pangwa)
- Update Sora spec name (Thanks to https://github.com/KalitaAlexey)
- Add Galital Rococo config (Thanks to  https://github.com/masterdubs)
- Update Mybank config (Thanks to https://github.com/armatrix)

Changes:

- Fix Elapsed formatting (previously would only show s units)
- Show unlocking when democracy has been undelegated
- Disable all parachain < 1000 networks (now reserved)
- Params now deals defaults to hex-only for H160/256/512


## 0.87.1 Apr 12, 2021

Contributed:

- Update Kilt types (Thanks to https://github.com/wischli)
- Update Zero types (Thanks to https://github.com/2075)
- Add Polkafoundry chain (Thanks to https://github.com/thanhtung6824)
- Update Acala endpoint (Thanks to https://github.com/qwer951123)
- Add Equilibrium Rococo endpoint (Thanks to https://github.com/mn13)
- Add Galois SessionKey type (Thanks to https://github.com/hging)
- Update Datahighway endpoint (Thanks to https://github.com/cgroeschel)
- Add Zeitgeist (Thanks to https://github.com/lsaether)
- Add Subsocial Rococo parachain (Thanks to https://github.com/siman)
- Add Parami Rococo parachain (Thanks to https://github.com/chenwei767)
- Update Robonomics types (Thanks to https://github.com/akru)
- Add Galitial Rococo parachain (Thanks to https://github.com/masterdubs)
- Update Jupiter types (Thanks to https://github.com/ii-ii-ii)
- Update SubDAO logo (Thanks https://github.com/chenwei767)
- Add Sunrock Rococo parachain (Thanks to https://github.com/crystalin)
- Update Edgeware live endpoint (Thanks to https://github.com/ShankarWarang)
- Add Mybank network (Thanks to https://github.com/armatrix)
- Add Steam & Beast Rococo parachain (Thanks to https://github.com/johnwhitton)
- Update Unit network logo (Thanks to https://github.com/paulhealy09)
- Update Encointer types (Thanks to https://github.com/brenzi)
- Add Apron network (Thanks to https://github.com/Apron2050)
- Add Manta Rococo parachain (Thanks to https://github.com/zhenfeizhang)
- Correct Bifrost usage (Thanks to https://github.com/awesomepan)
- Update Uart test types (Thanks to https://github.com/tianxiemaochiyu)
- Update Mandala paraId (Thanks to https://github.com/xlc)
- Update PolkaFoundry paraId (Thanks to https://github.com/hoangnl2112)
- Update Clover types (Thanks to https://github.com/pangwa)

Changes:

- Extend parachain support to cater for new Rococo usages
- Display parachain specVersion (in addition to best block)
- Move batch transaction creation into hook (& apply to all uses)


## 0.86.2 Mar 29, 2021

Contributed:

- Adjustments for Crust pinning (Thanks to https://github.com/zikunfan)
- Adjustments for KILT XCM types (Thanks to https://github.com/wischli)


## 0.86.1 Mar 29, 2021

Contributed:

- Change global menu styling (Thanks to https://github.com/MiZiet)
- Update Unique colors & types (Thanks to https://github.com/gregzaitsev)
- Update Sora types (Thanks to https://github.com/modbrin)
- Update Realis network (Thanks to https://github.com/Daelon02)
- Update PolkaBtc types (thanks to https://github.com/gregdhill)
- Update Moonbeam types (Thanks to https://github.com/joelamouche)
- Update Acala endpoints (Thanks to https://github.com/xlc)
- Update Darwinia Crab logo (Thanks to https://github.com/sxlwar)
- Update Darwinia Crab RPC & types (thanks to https://github.com/WoeOm)
- Update Clover types (Thanks to https://github.com/pangwa & https://github.com/superpw)
- Updata Equilibrium types (Thanks to https://github.com/pr0fedt)
- Add Phoenix chain to Rococo (Thanks to https://github.com/yuyunhong)
- Add Litentry testnet (Thanks to https://github.com/chenzongxiong)
- Update types for DOTMog (Thanks to https://github.com/darkfriend77)
- Fix language on staking (Thanks to https://github.com/SimonKraus)
- Add pinning of apps UI IPFS to Crust (Thanks to https://github.com/zikunfan)

Changes:

- Display justifications in block explorer
- Expansion of crowdloan, auctions & parachain views
- Basic functionality for asset module
- Adjust ordering of democracy & tips buttons
- Cater for new Rococo chain reset/deployment
- Ensure treasury does not depend on council or tips


## 0.85.1 Mar 22, 2021

Contributed:

- Adjust dusty spec name (Thanks to https://github.com/akru)
- Update Galois types (Thanks to https://github.com/hging)
- Update Crust types (Thanks to https://github.com/zikunfan)
- Add Vln testnet (thanks to https://github.com/stanly-johnson)
- Update Datahighway types (Thanks to https://github.com/cgroeschel)
- Language fixes (Thanks to https://github.com/wirednkod)

Changes:

- Display validator votes on parachains
- Adjust society (display split, expand member/candidate info & payouts)
- Adjust inflation calculation for zero staked/issuance
- Display call hash on signer modal
- Cleanup Modal layouts & de-dupe tags
- Cleanup global tabs displays (optimize elements)


## 0.84.1 Mar 15, 2021

Contributed:

- Added ReAlis network & types (Thanks to https://github.com/Daelon02)
- Added OnFinality endpoint for Moonbeam (Thanks to https://github.com/joelamouche)
- Update Moonbeam types (Thanks to https://github.com/joelamouche)
- Update PolkaBTC types (Thanks to https://github.com/savudani8)
- Update Kilt types (Thanks to https://github.com/wischli)
- Update Bifrost types (Thanks to https://github.com/awesomepan)
- Update Bit.Country paraId (Thanks to https://github.com/justinphamnz)
- Update Dusty types (Thanks to https://github.com/akru)
- Update Zenlink types (Thanks to https://github.com/Hayden0323)
- Update Sgc node types (Thanks to https://github.com/Zombieliu)
- Update DataHighway chain colors (Thanks to https://github.com/cgroeschel)
- Update specName for ChainX & Zenlink (Thanks to https://github.com/icodezjb)
- Update it i18n (thanks to https://github.com/fomod-in)

Changes:

- Add display of blocking stashes (& removal from nomination lists)
- Cater for Rococo reset (genesisHash updates)
- Add support for parachain auctions
- Add support for contributions in crowdloan app
- Update crowdloan app for latest Polkadot types
- Fix upcoming retrievals for new parachain interfaces
- Display lease period countdown for parachains
- show parachain lifecycles (& action countdowns as applicable)
- Flatten Modal layouts (explicit hint, single column data only)
- Move theme definitions to CSS variables
- Add correct keys for account menu (rendering warnings)
- Add additional errors on invalid keypair retrieval


## 0.83.1 Mar 8, 2021

Contributed:

- Update Jupiter networks alongside Rococo (Thanks to https://github.com/zzcwoshizz)
- Add ChainX support on Rococo (Thanks to https://github.com/qinghuan-chain)
- Update Kulupu types for next upgrade (Thanks to https://github.com/sorpaas)
- Bump Acala types package (Thanks to https://github.com/ntduan)
- Update HydraDX types (Thanks to https://github.com/lumir-mrkva)
- Add ETH dev accounts on Frontier-like networks (Thanks to https://github.com/joelamouche)
- Fix Unique type injection (Thanks to https://github.com/gregzaitsev)
- Update account help around ED (Thanks to https://github.com/NukeManDan)

Changes:

- Fix address ion display in explorer (compatibility with `MultiAddress`)
- Add block status to validator preferences setup
- Allow validators to remove nominators (currently active-only)
- Stash derives now check for events for refresh triggers
- Adjust Electron CSP to allow workers as used in QR operations
- Swap code-generation to ESM modules
- Adjust funding warnings with explicit free balance mention


## 0.82.1 Mar 1, 2021

Contributed:

- Start of Polish i18n (Thanks to https://github.com/jimmy-tudeski)
- Adjust display of table buttons with gradient themes (Thanks to https://github.com/superpw)
- Update PolkaBTC network URL (Thanks to https://github.com/savudani8)
- Add network types for Snowbridge (Thanks to https://github.com/vgeddes)
- Update Btfrost types (Thanks to https://github.com/awesomepan)
- Update Litentry collator name (Thanks to https://github.com/chenzongxiong)
- Add MathChain PC1 support (Thanks to https://github.com/hging)
- Update Ternoa types (thanks to https://github.com/ETeissonniere)
- Update Scg types (Thanks to https://github.com/Zombieliu)
- Add derivation path support for ETH-compatible accounts (Thanks to https://github.com/joelamouche)

Changes:

- Explicit messages around extension phishing support
- Adjust parachain validators to always show stashes
- Adjust block links display on a per-contract view
- Adjust display of disabled items on popup menus (dark-mode driven)
- Align bounty row display with the rest of the UI


## 0.81.1 Feb 22, 2021

Contributed:

- Add Unique network (Thanks to https://github.com/gregzaitsev)
- Add Sgc testnet (Thanks to https://github.com/Zombieliu)
- Add all known Moonbeam spec names (Thanks to https://github.com/joelamouche)
- Adjust Moonbeam types for v6 upgrade (Thanks to https://github.com/joelamouche)
- Adjust DOTmog logo (Thanks to https://github.com/darkfriend77)
- Add Vedran provider for Westend (Thanks to https://github.com/mpetrunic)
- Fix typo in accounts overlays (Thanks to https://github.com/marksthespots)
- Fix typo in JavaScript app (Thanks to https://github.com/shaunxw)
- Update types for Darwinia Crab (Thanks to https://github.com/WoeOm)
- Update provider for Darwinia (Thanks to https://github.com/WoeOm)
- Updata paraId for Bit.Country (Thanks to https://github.com/justinphamnz)

Changes:

- Display validators for all connected parachains
- Adjust included block parachain calculation
- Align bounties display with UI styling
- Rework calculation for min-available balance warning in signer
- Adjust slashed validators display (check against known eras)
- Cleanup JS console app examples for system.account usage
- Adjust JS console app sending example (incl. Signer fix)
- Display error on contracts deploy pre-3.0 Substrate with no utility.batch
- Adjust table displays with bottom-borders
- Adjust Governance proxy checks to include tips
- Reworks digits formatting for explorer blocks


## 0.80.1 Feb 15, 2021

Contributed:

- Add Trustbase networks (thanks to https://github.com/jizer)
- Add DOTMog network (Thanks to https://github.com/darkfriend77)
- Add Bit.Country PC1 (Thanks to https://github.com/justinphamnz)
- Add Litentry parachain (Thanks to https://github.com/chenzongxiong)
- Update Plasm network types (Thanks to https://github.com/akru)
- Update Nodle network types (Thanks to https://github.com/ETeissonniere)
- Update Sora library version (Thanks to https://github.com/stefashkaa)
- Adjust Moonbeam themes (Thanks to https://github.com/joelamouche)
- Bounties list display enhancements (Thanks to https://github.com/ekowalsk)

Changes:

- Adjust explorer block display to not show unsigned as immortal (no era info)
- Protect against overflows in staking returns calculations
- Add warning on none bonded to not send to validators, but rather bond
- Adjust staking min-bonded overall calculations
- Cleanup accounts loading display (no initial flash)
- Add Register action for parachains (non-proposal mode)
- Adjust council display to cater for new Substrate version
- Adjust bounties pages to align better with UI look and feel
- Start of parachain auctions interface (skeleton-only)
- Adjust `useFavorites` to not re-read storage on re-renders
- Adjust `useLoading` hooks to only fire once
- Convert all spec types to use bundles (single adjustment)
- Consistent sorting for all RPC nodes (live & testing)
- Update Rococo genesis after reset
- Split test parachains into own section on network selector


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
- Add Bifrost Rococo endpoint (thanks to https://github.com/awesomepan)
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
- Add types for Bifrost testnet (Thaks to https://github.com/janpo)
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
- Add Bifrost Asgard testnet (Thanks to https://github.com/janpo)

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
- Staking now supports where the controller
