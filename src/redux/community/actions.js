import { CHANGE_COMMUNITY } from '../constants';

// eslint-disable-next-line import/prefer-default-export
export const changeCommunity = (community) => {
  return {
    type: CHANGE_COMMUNITY,
    payload: community
  };
};
