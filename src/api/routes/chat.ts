import { Router, Request, Response } from 'express';
import middlewares from '../middlewares';
import jwt_decode from 'jwt-decode'
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';
import CandidateService from './../../services/candidate';
import CompanyService from './../../services/company';
import ChatService from './../../services/chat';


const route = Router();

export default (app: Router) => {
    /*
    * Under the User Route we have both condidate and recruiter profile routes 
    */
    app.use('/chats', route);
  
    /*
    * Method to get full profile of a given user 
    */
    route.post(
    '/chat',
    middlewares.isAuth, 
    async (req, res) => 
    {
      try
      {
        console.log("Getting the user info");
        
        var userDetails= {
          ['cognito:groups']:null
        }
        
        userDetails = await jwt_decode(req.header('authorization'));

        // if candidate then apply for the job
        if(userDetails['cognito:groups'][0] == 'userCandidate'){      //middlewares.submitCandidate(req, res, next, userDetails)

          const chatServiceInstance = Container.get(ChatService);
          const { candidateRecord } = await chatServiceInstance.ApplyJob(userDetails);    
          if(candidateRecord['_id'] == null)                             // console.log(console.log(userRecord)) // to see the userRecord in the debug logs
          {
              return res.sendStatus(401);     // Need to add a role back here if user role not succeefully set so as to loop again unless the role is added         
          }
          else
          {
            return res.json({ "success" : true }).status(200);  //console.log("User role set successfully in Mongo Db");           // successful response             
          }
        }
        // if recruiter then apply select/reject the candidate
        if(userDetails['cognito:groups'][0] == 'userRecruiter')       //middlewares.submitCompany(req, res, next, userDetails)
        {        

          console.log("filling up the recruiter information ");

          const companyServiceInstance = Container.get(CompanyService);
          const { companyRecord } = await companyServiceInstance.SetCompany(userDetails,req);    
          if(companyRecord['_id'] == null)                             //console.log(console.log(userRecord)) // to see the userRecord in the debug logs
          {
              return res.sendStatus(401);                             // Need to add a role back here if user role not succeefully set so as to loop again unless the role is added            
          }
          else{
            return res.json({ "success" : true }).status(200);        //console.log("User role set successfully in Mongo Db");           // successful response             
          }
        }
      }
      catch(e)
      {
        console.log("Failed to add the user data");
        return res.sendStatus(500);
      }
    });

    route.get('/chats', middlewares.isAuth, async (req: Request, res: Response) =>{

      var userDetails= {
        ['cognito:groups']:null
      }
      
      userDetails = await jwt_decode(req.header('authorization'));
      
      // if recruiter then search based on recruiter id is to be done
      if(userDetails['cognito:groups'][0] == 'userRecruiter')       //middlewares.submitCompany(req, res, next, userDetails)
      {        
        console.log("Fetching userdetails of recommended candidate");

        userDetails = await jwt_decode(req.header('authorization'));

        const companyServiceInstance = Container.get(CompanyService);

        const candidateRecords = await companyServiceInstance.GetCanList(userDetails);           
        
        // var i = 0; 
        // var canRecords = [];
        // for(;i<candidateRecords.length;i++) 
        // {
        //   canRecords[i] = {
        //     candidateRecords[i]['skills']
        //   }
        // }

        // console.log(candidateRecord);

        // here we need to call another service th

        // const companyInfo = {
        //   'name':companyRecord.name,
        //   'whatsappNumber':companyRecord.whatsappNumber,
        //   'preferredIndustry':companyRecord.preferredIndustry,
        //   'location':companyRecord.location,
        //   'skills':companyRecord.skills,
        //   'about':aboutRecord.about,
        //   'empSize':companyRecord.empSize,
        //   'site':companyRecord.site,
        // };

        // const candidateList="";
        return res.json({ "success" : true , user: candidateRecords }).status(200);    
      }



    })

    /*
     *   Method to get full profile of a given user
     */ 
  
    route.get('/user', middlewares.isAuth, async (req: Request, res: Response) => {
      
      var userDetails= {
        ['cognito:groups']:null
      }

      userDetails = await jwt_decode(req.header('authorization'));

      if(userDetails['cognito:groups'][0] == 'userCandidate'){      //middlewares.submitCandidate(req, res, next, userDetails)

        console.log("fetching the userdetails the of the candiadte");

        userDetails = await jwt_decode(req.header('authorization'));

        const candidateServiceInstance = Container.get(CandidateService);

        const { candidateRecord } = await candidateServiceInstance.GetCandidate(userDetails);           

        // here we need to call another service th

        const candidateInfo = {
          'name':candidateRecord.name,
          'jobtitle':candidateRecord.jobTitle,
          'githubUrl':candidateRecord.githubUrl,
          'skills':candidateRecord.skills,
          'whatsappNumber':candidateRecord.whatsappNumber,
          'exp':candidateRecord.exp,
          'ctc':candidateRecord.ctc,
          'location':candidateRecord.location
        };

        return res.json({ "success" : true , user: candidateInfo }).status(200);

      }
      if(userDetails['cognito:groups'][0] == 'userRecruiter')       //middlewares.submitCompany(req, res, next, userDetails)
      {        
        console.log("fetching the userdetails the of the company");

        userDetails = await jwt_decode(req.header('authorization'));

        const companyServiceInstance = Container.get(CompanyService);

        const { companyRecord, aboutRecord } = await companyServiceInstance.GetCompany(userDetails);           
        
        // here we need to call another service th

        const companyInfo = {
          'name':companyRecord.name,
          'whatsappNumber':companyRecord.whatsappNumber,
          'preferredIndustry':companyRecord.preferredIndustry,
          'location':companyRecord.location,
          'skills':companyRecord.skills,
          'about':aboutRecord.about,
          'empSize':companyRecord.empSize,
          'site':companyRecord.site,
        };

        return res.json({ "success" : true , user: companyInfo }).status(200);    
      }

    });

    // GetJobByCan

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
