export type FilterProps = {
  showActiveOnly?: boolean,
  showFinalizedOnly?: boolean, // Includes anything but Active.

  // Based on ProposalStatus enum:
  showActive?: boolean,
  showCancelled?: boolean,
  showExpired?: boolean,
  showApproved?: boolean,
  showRejected?: boolean,
  showSlashed?: boolean
};

export default FilterProps;
