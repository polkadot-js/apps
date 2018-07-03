# @polkadot/app-governance

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