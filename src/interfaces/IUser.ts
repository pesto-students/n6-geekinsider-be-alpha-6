/*
* These below interfaces are used to fill info for a given user
*/

export interface IUser {
  _id: string;                              // here we fill the cognito userid 
  email: string;                            // here we fill the email id for the user
  role: string;                             // there can be two property for a user role either candidate or recruiter
}

export interface IUserInputDTO {
  role: string;
}
