export interface IUser {
  _id: string; // this is the cognito username 
  email: string; // The email id of the user
  role: string; // there can be two property for a user role either candiadate or recruiter
}

export interface IUserInputDTO {
  role: string;
}
