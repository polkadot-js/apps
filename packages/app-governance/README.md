# @polkadot/app-governance

## Council Voting

* Create a motion where Charlie (Council Member) makes a Proposal
  * Go to Extrinsics tab at: http://localhost:3000/#/extrinsics
  * Select for "Account": CHARLIE (associated test DOT balance is shown on the right)
  * Select for "Extrinsic Section": councilVoting
  * Select for "Submit the Following Extrinsic": propose(proposal)
  * Select for "Proposal Section": consensus
  * Select for "Proposal Extrinsic": setStorage(entries)
  * Drag-and-drop a smal image into the browser for: setCode(code)
  * Click "Submit Transaction"

* View the Proposal 
  * Go to Governance tab 
  * Select for "councilVoting": proposals
  * Click "+" to show the Block and associated Hash of the Proposal.
    * Note: If you do not view the Proposal quickly before expires it will return `empty`)

## Referendum

* Create two proposals, each with a Referendum ID, and vote on each proposal

* Proposal #1
  * Go to Extrinsics tab at: http://localhost:3000/#/extrinsics
  * Select for "Account": BOB
  * Select for "Extrinsic Section": democracy
  * Select for "Submit the Following Extrinsic": propose(proposal, value)
  * Select for "Proposal Section": consensus
  * Select for "Proposal Extrinsic": setCode(code)
  * Drag-and-drop a text file with contents "0x00" into the drag and drop area
  * Enter for "Value": 10
  * Note down the value of "with an index" as this becomes the associated Referendum Index
  * Click "Submit Transaction"

* Proposal #2
  * Repeat above but for CHARLIE, a file with contents "0x01" and note that the Referendum Index will be 1

* Vote on Proposal #1
  * Go to Extrinsics tab, select DAVE > democracy > vote, enter the Referendum Index generated with first proposal (i.e. 0), choose "Yes" on how to vote, click Submit Transaction

* Vote on Proposal #1
  * Go to Extrinsics tab, select EVE > democracy > vote, enter the Referendum Index generated with second proposal (i.e. 1), choose "Yes" on how to vote, click Submit Transaction