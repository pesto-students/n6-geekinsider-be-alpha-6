import { Router, Request, Response } from 'express';
import middlewares from '../middlewares';
import jwt_decode from 'jwt-decode'
import { Container } from 'typedi';
import CandidateService from './../../services/candidate';
import CompanyService from './../../services/company';
import skillset from './../../utils/skills'
import cities from './../../utils/cities';
import { Logger } from 'winston';

const route = Router();

export default (app: Router) => {
  /*
  * Under the User Route we have user action of both candidate and recruiter apart from the job fetching options  
  */
  app.use('/users', route);

  /*
  * Method to attach role to a user
  */
  route.post('/auth', middlewares.attachRole);

  /*
  * Method to get a list of predefined skills
  */
  route.get('/skills', middlewares.isAuth, (req: Request, res: Response) => 
  {
    return res.json({ skills: skillset }).status(200);
  });

  /*
  * Method to get a list of predefined cities
  */
  route.get('/cities', middlewares.isAuth, (req: Request, res: Response) => 
  {
    return res.json({ cities: cities }).status(200);
  });

  /*
  * Method to get full profile of a given user 
  */
  route.post(
    '/user',
    middlewares.isAuth, 
    async (req, res, next) => 
    {
      const logger:Logger = Container.get('logger');

      try
      {
        logger.debug('Updating the user info ', req.body );
        
        let userDetails = {
          ['cognito:groups']:null
        }
        
        userDetails = await jwt_decode(req.header('authorization'));

        logger.debug('Id token for the following request : ', userDetails );
        
        if( userDetails['cognito:groups'][0] == 'userCandidate' )
        {

          logger.debug("Updating the candidate information.");

          const candidateServiceInstance = Container.get(CandidateService);

          const { candidateRecord } = await candidateServiceInstance.SetCandidate(userDetails,req);    

          logger.debug("The uploaded information is ",candidateRecord);

          if(candidateRecord['_id'] == null)                             
          {
              return res.sendStatus(401);  
          }
          else
          {
            // Adding the github data for the given user.
            const canGitServiceInstance = Container.get(CandidateService);

            const canGitRecord = await canGitServiceInstance.SetGithub(userDetails,req);
            
            logger.debug("The uploaded candidate's git information is ",canGitRecord);

            return res.json({ "success" : true }).status(200);    
          }
        }
        if(userDetails['cognito:groups'][0] == 'userRecruiter')
        {        
          logger.debug("filling up the recruiter information ");

          const companyServiceInstance = Container.get(CompanyService);
          
          const { companyRecord } = await companyServiceInstance.SetCompany(userDetails,req);    
          
          if(companyRecord['_id'] == null)                        
          {
            return res.json({ "success" : false, "message" : "User already added to a given group" }).status(401);                             // Need to add a role back here if user role not succeefully set so as to loop again unless the role is added            
          }
          else
          {
            return res.json({ "success" : true }).status(200);        //console.log("User role set successfully in Mongo Db");           // successful response             
          }
        }
      }
      catch(e)
      {
        logger.debug("Failed to add the user data");

        return res.json({ "success" : false,  "message" : "Internal server error"  }).status(500);
      }
  });

  /*
   * Method to get full profile of a given user 
   */
  route.post(
    '/apply',
    middlewares.isAuth, 
    async (req, res) => 
    {
      const logger:Logger = Container.get('logger');

      try
      {        
        logger.debug('Updating the user info ', req.body );
        
        let jobid;

        if(req.body.jobid != null)
        {
            jobid = req.body.jobid;    
        }

        logger.debug("Applying for job based on job slug.");

        let userDetails= {
          ['cognito:groups']:null
        }
        
        userDetails = await jwt_decode(req.header('authorization'));

        logger.debug("The user id token is ",userDetails);
        
        if( userDetails['cognito:groups'][0] == 'userCandidate' )
        { 

          logger.debug("Applying for a job post based on a given job slug.");

          let candidateServiceInstance = Container.get(CandidateService);
          
          const candidateAppliedJobRecord = await candidateServiceInstance.ApplyJob(userDetails,jobid);    
          
          logger.debug("The candidate Record added to the db is ",candidateAppliedJobRecord);

          // Need to add a role back here if user role not succeefully set so as to loop again unless the role is added

          if(candidateAppliedJobRecord['_id'] == null)
          {
              return res.sendStatus(401);                                            
          }
          else
          {
            logger.debug("Job applied successfully and the mongo record is ",candidateAppliedJobRecord['_id']);

            return res.json({ "success" : true }).status(200);
          }
        }
      }
      catch(e)
      {
        logger.debug("Failed to add the user data");

        return res.json({ "success" : false,  "message" : "Internal server error"  }).status(500);
      }
  });


  /*
   * Method to get list of applied candidate for a given job in recruiter 
   */
    route.get(
      '/applied',
      middlewares.isAuth, 
      async (req, res) => 
      {
        const logger:Logger = Container.get('logger');
        try
        {
          logger.debug("Fetching the candidates applied based on job id");
          
          let jobid;
  
          // console.log(req.query);
          if(req.query.jobid != null)
          {
              jobid = req.query.jobid;    
          }

          logger.debug("The job slug id was ",jobid);
          
          let userDetails= {
            ['cognito:groups']:null
          }
          
          userDetails = await jwt_decode(req.header('authorization'));
  
          logger.debug( userDetails['cognito:groups'][0] );
          
          if( userDetails['cognito:groups'][0] == 'userCandidate' ){

            logger.debug("User role set successfully in Mongo Db");

            res.json({ "success" : false , "message" : "Unauthorized" }).status(401);     // Need to add a role back here if user role not succeefully set so as to loop again unless the role is added                     

          }

          if( userDetails['cognito:groups'][0] == 'userRecruiter' ){      //middlewares.submitCandidate(req, res, next, userDetails)
  
            logger.debug("initializing the company service instance");
  
            let candidateServiceInstance = Container.get(CompanyService);
            
            logger.debug("Fetching the applied can");
            
            const candidateRecord = await candidateServiceInstance.AppliedApplicant(jobid, userDetails);    
            
            logger.debug("The recruiter for which the candidate info is fetched is ",candidateRecord);

            if(candidateRecord == null)
            {
              res.json({ "success" : false , "message" : "Unauthorized" }).status(401);     // Need to add a role back here if user role not succeefully set so as to loop again unless the role is added         
            }
            else
            {
              logger.debug("User role set successfully in Mongo Db");

              return res.json({ "success" : true , "enrolledCandidate" : candidateRecord }).status(200);             
            }
          }
        }
        catch(e)
        {
          logger.debug("Failed to set the user data ", e);
          
          return res.json({ "success" : false , "message" : "Internal server error" }).status(500);             
        }
    });
  

  /*
  *   Recommendation of candidates based on skills defined by recruiter during the onboarding process of the recruiter
  */ 

  route.get('/getcans', middlewares.isAuth, async (req: Request, res: Response) =>
  {
    let userDetails= {
      ['cognito:groups']:null
    }
    
    userDetails = await jwt_decode(req.header('authorization'));

    const logger:Logger = Container.get('logger');

    if(userDetails['cognito:groups'][0] == 'userRecruiter')
    {        
      logger.debug("Fetching userdetails of recommended candidate for the given recruiter");

      userDetails = await jwt_decode(req.header('authorization'));

      const companyServiceInstance = Container.get(CompanyService);

      const candidateRecords = await companyServiceInstance.GetCanList(userDetails);           
      
      return res.json({ "success" : true , user: candidateRecords }).status(200);    
    }
    else
    {
      logger.debug("Unauthorised access is seen");

      res.json({ "success" : false , "message" : "Unauthorized" }).status(401);
    }
  })

  /*
  *   Recommendation of candidates based on skills searched by the recruiter
  */ 

  route.get('/search-can', middlewares.isAuth, async (req: Request, res: Response) =>
  {
    const logger:Logger = Container.get('logger');

    let userDetails= {
      ['cognito:groups']:null
    }
    
    userDetails = await jwt_decode(req.header('authorization'));

    if(userDetails['cognito:groups'][0] == 'userRecruiter')
    {        
      logger.debug("Fetching user details of recommended candidate");

      userDetails = await jwt_decode(req.header('authorization'));

      const companyServiceInstance = Container.get(CompanyService);

      const candidateRecords = await companyServiceInstance.GetCanFromSearch(userDetails, req);           
      
      return res.json({ "success" : true , user: candidateRecords }).status(200);    
    }
    else
    {
      return res.json({ "success" : false, "message": "unuthorised access is seen" }).status(401); 
    }
  })


  /*
  *   Method to get full profile of a given candidate called by recruiter based on candidate id
  */ 

  route.get('/getcan', middlewares.isAuth, async (req: Request, res: Response) => 
  {
    const logger:Logger = Container.get('logger');

    let canid;

    if(req.query.canid != null)
    {
      canid = req.query.canid;    
    }

    let userDetails= {
      ['cognito:groups']:null
    }

    userDetails = await jwt_decode(req.header('authorization'));

    if(userDetails['cognito:groups'][0] == 'userRecruiter')
    {        
      logger.debug("fetching the userdetails for the company to view candidates based on candidate id");

      const candidateServiceInstance = Container.get(CandidateService);

      // Here we set up the candidate deatils dusing the onboarding process

      const candidateRecord = await candidateServiceInstance.GetCandidateInfo(canid);           

      // Here we the git serivce to update the candidate's git profile

      const canGitRecord = await candidateServiceInstance.GetGitInfo(canid);           

      const candidateInfo = {
        'about':candidateRecord.about,
        'gitInfo': canGitRecord
      };

      logger.debug("The fetched candidate record is ", candidateInfo)

      return res.json({ "success" : true , user: candidateInfo }).status(200);    
    }
    else
    {
      return res.json({ "success" : false, "message": "unuthorised access is seen" }).status(401); 
    }
  });



    
  /*
  *   Method to get full profile of a given user
  */ 

  route.get('/user', middlewares.isAuth, async (req: Request, res: Response) => {
    
    const logger:Logger = Container.get('logger');

    logger.debug('Fetching the candidate information.');

    let userDetails= {
      ['cognito:groups']:null
    }

    userDetails = await jwt_decode(req.header('authorization'));

    if(userDetails['cognito:groups'][0] == 'userCandidate'){      //middlewares.submitCandidate(req, res, next, userDetails)

      logger.debug("Fetching userdetails of the candiadte");

      userDetails = await jwt_decode(req.header('authorization'));

      const candidateServiceInstance = Container.get(CandidateService);

      // here we get the candidate record the about record from the below service method

      const { candidateRecord , aboutRecord } = await candidateServiceInstance.GetCandidate(userDetails);           

      // here we get the git info for a given candidate

      const canGitRecord = await candidateServiceInstance.GetGitInfo(userDetails['sub']);           
      
      const candidateInfo = {
        'name':candidateRecord.name,
        'jobTitle':candidateRecord.jobTitle,
        'githubUrl':candidateRecord.githubUrl,
        'skills':candidateRecord.skills,
        'about':aboutRecord.about,
        'whatsappNumber':candidateRecord.whatsappNumber,
        'exp':candidateRecord.exp,
        'ctc':candidateRecord.ctc,
        'location':candidateRecord.location,
        'gitskills': canGitRecord.skills,
        'skillsOrder' : canGitRecord.skillsOrder,
        'repoCount' : canGitRecord.repoCount
      };

      return res.json({ "success" : true , user: candidateInfo }).status(200);

    }
    if(userDetails['cognito:groups'][0] == 'userRecruiter')       //middlewares.submitCompany(req, res, next, userDetails)
    {        
      logger.debug("fetching the userdetails the of the company");

      userDetails = await jwt_decode(req.header('authorization'));

      const companyServiceInstance = Container.get(CompanyService);

      // here we get the company record the about record from the below service method

      const { companyRecord, aboutRecord } = await companyServiceInstance.GetCompany(userDetails);           
      
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

};



