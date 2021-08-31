import { Router, Request, Response } from 'express';
import middlewares from '../middlewares';
import jwt_decode from 'jwt-decode'

const route = Router();

export default (app: Router) => {
  app.use('/users', route);

  /*
  * Method to get full profile of a given user 
  */
  route.post('/assign-role', middlewares.attachRole);
    
  /*
   * Method to get full profile of a given user
   * Middleware isAuth = To check wether the user is autheticated or not
   * Middleware isRole = To match the role with the mongoDb and to get the user id from the mongo and match the role
   */ 
  
  route.get('/me', middlewares.isAuth, middlewares.fullProfile);


  //middlewares.isRole we will this middle ware to see the different actions

  /*
   * Method to get full profile of a given user 
   */
  route.post('/me', middlewares.isAuth, async (req, res, next) => 
    {
      var userDetails= {
        ['cognito:groups']:null
      }

      userDetails = await jwt_decode(req.header('authorization'));

      if(userDetails['cognito:groups'][0] == 'userCandidate'){
        middlewares.submitCandidate(req, res, next, userDetails)
      }
      
      if(userDetails['cognito:groups'][0] == 'userRecruiter'){
        middlewares.submitRecruiter(req, res, next, userDetails)
      }
    }
  );


  /* Method to get the profile of a given user
   * if can then can get recruiter
   * if Recruiter then can get Candidate
   */
  // route.get('/:userid', middlewares.isAuth, middlewares.isRole, (req: Request, res: Response) => {
  //   return res.json({ user: req.currentUser }).status(200);
  // });
};
