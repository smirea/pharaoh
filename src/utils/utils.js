/* @flow */

let uid = 0;
export const getUID = () : string => 'uid-' + (++uid);
