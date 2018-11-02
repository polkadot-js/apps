export type Actions = 'create' | 'edit' | 'restore' | 'forget';

export type ActionStatus = {
  action: Actions,
  success: boolean,
  message: string
};
