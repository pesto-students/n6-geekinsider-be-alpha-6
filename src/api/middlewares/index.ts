import isAuth from './isAuth';
import isCandidate from './isCandidate';
import isCompany from './isCompany';
import attachRole from './attachRole';

/*
 *  Middleware isAuth = To check wether the user is autheticated or not.
 *  Middleware isRole = To match the role with the mongoDb and to get the user id from the mongo and match the role.
 *  Middleware attachRole = To attach role to a given user.
 */ 

export default {
  isAuth,
  isCandidate,
  isCompany,
  attachRole
};