import { Router } from 'express';
import middlewares from '../middlewares';
import jwt_decode from 'jwt-decode'
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';
import CandidateService from './../../services/candidate';


const route = Router();

export default (app: Router) => {
  app.use('/users', route);

  /*
  * Method to get full profile of a given user 
  */
  route.post('/role', middlewares.attachRole);
    
  /*
   * Method to get full profile of a given user
   * Middleware isAuth = To check wether the user is autheticated or not
   * Middleware isRole = To match the role with the mongoDb and to get the user id from the mongo and match the role
   */ 
  
  route.get('/user', middlewares.isAuth, middlewares.fullProfile);



  /*
   * Method to get full profile of a given user 
   */
  route.post(
    '/user',
    // celebrate({                                            // we will use this celebrate to add the validation for the routes
    //   body: Joi.object({
    //     name: Joi.string().required(),
    //     whatsappNumber: Joi.string(),
    //     jobtitle: Joi.string(),
    //     location: Joi.string()
    //   }),
    // }), 
    middlewares.isAuth, 
    async (req, res, next) => 
    {
      try
      {
        console.log("Adding the user to a group");
        var userDetails= {
          ['cognito:groups']:null
        }
  
        userDetails = await jwt_decode(req.header('authorization'));
  
        if(userDetails['cognito:groups'][0] == 'userCandidate'){      //middlewares.submitCandidate(req, res, next, userDetails)

          const candidateServiceInstance = Container.get(CandidateService);
          const { candidateRecord } = await candidateServiceInstance.SetCandidatRole(userDetails,req);    
          if(candidateRecord._id == null)                             // console.log(console.log(userRecord)) // to see the userRecord in the debug logs
          {
              return res.sendStatus(401);     // Need to add a role back here if user role not succeefully set so as to loop again unless the role is added         
          }
          else{
              return res.sendStatus(200)      //console.log("User role set successfully in Mongo Db");           // successful response             
          }
        }
        if(userDetails['cognito:groups'][0] == 'userRecruiter')       //middlewares.submitCompany(req, res, next, userDetails)
        {        
          const candidateServiceInstance = Container.get(CandidateService);
          const { candidateRecord } = await candidateServiceInstance.SetCandidatRole(userDetails,req);    
          if(candidateRecord._id == null)                             //console.log(console.log(userRecord)) // to see the userRecord in the debug logs
          {
              return res.sendStatus(401);                             // Need to add a role back here if user role not succeefully set so as to loop again unless the role is added            
          }
          else{
              return res.sendStatus(200)                              //console.log("User role set successfully in Mongo Db");           // successful response             
          }
        }
      }
      catch(e)
      {
        console.log("Failed to set the role");
        return res.sendStatus(500);
      }

    });


    route.put('/user', middlewares.isAuth, async (req, res, next) => 
    {

    });


  /* Method to get the profile of a given user
   * if can then can get recruiter
   * if Recruiter then can get Candidate
   */
  // route.get('/:userid', middlewares.isAuth, middlewares.isRole, (req: Request, res: Response) => {
  //   return res.json({ user: req.currentUser }).status(200);
  // });
};
