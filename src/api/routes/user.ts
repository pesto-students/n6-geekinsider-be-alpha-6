import { Router, Request, Response } from 'express';
import middlewares from '../middlewares';
import jwt_decode from 'jwt-decode'
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';
import CandidateService from './../../services/candidate';
import CompanyService from './../../services/company';

const route = Router();

export default (app: Router) => {
  /*
  * Under the User Route we have both condidate and recruiter profile routes 
  */
  app.use('/users', route);

  /*
  * Method to attach role to a user
  */
  route.post('/auth', middlewares.attachRole);

  
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
        console.log("Getting the user info");
        var userDetails= {
          ['cognito:groups']:null
        }
        
        userDetails = await jwt_decode(req.header('authorization'));

        console.log(userDetails);
        
        if( userDetails['cognito:groups'][0] == 'userCandidate' ){      //middlewares.submitCandidate(req, res, next, userDetails)

          console.log("filling up the candidate information ");

          const candidateServiceInstance = Container.get(CandidateService);
          const { candidateRecord } = await candidateServiceInstance.SetCandidate(userDetails,req);    

          console.log(candidateRecord);

          if(candidateRecord['_id'] == null)                             // console.log(console.log(userRecord)) // to see the userRecord in the debug logs
          {
              return res.sendStatus(401);     // Need to add a role back here if user role not succeefully set so as to loop again unless the role is added         
          }
          else{
            // Adding the data to the github model with candidateid in here
            const canGitServiceInstance = Container.get(CandidateService);
            const canGitRecord = await canGitServiceInstance.SetGithub(userDetails,req);
            console.log(canGitRecord);
            return res.json({ "success" : true }).status(200);  //console.log("User role set successfully in Mongo Db");           // successful response           
          }
        }
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

  /*
   * Method to get full profile of a given user 
   */
  route.post(
    '/apply',
    middlewares.isAuth, 
    async (req, res) => 
    {
      try
      {

        //console.log(req.body);
        var jobid;

        if(req.body.jobid != null)
        {
            jobid = req.body.jobid;    
        }

        console.log("Applying for job based on job slug.");
        var userDetails= {
          ['cognito:groups']:null
        }
        
        userDetails = await jwt_decode(req.header('authorization'));

        //console.log(userDetails);
        
        if( userDetails['cognito:groups'][0] == 'userCandidate' ){      //middlewares.submitCandidate(req, res, next, userDetails)

          console.log("filling up the candidate information ");

          //console.log(CandidateService);
          let candidateServiceInstance = Container.get(CandidateService);
          
          //console.log(candidateServiceInstance);
          const candidateRecord = await candidateServiceInstance.ApplyJob(userDetails,jobid);    
          
          if(candidateRecord['_id'] == null)                             // console.log(console.log(userRecord)) // to see the userRecord in the debug logs
          {
              return res.sendStatus(401);     // Need to add a role back here if user role not succeefully set so as to loop again unless the role is added         
          }
          else
          {
            return res.json({ "success" : true }).status(200);  //console.log("User role set successfully in Mongo Db");           // successful response             
          }
        }
      }
      catch(e)
      {
        console.log(e)
        console.log("Failed to add the user data");
        return res.sendStatus(500);
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
        try
        {
  
          console.log("fetching the candidates applied based on job id");
          var jobid;
  
          // console.log(req.query);
          if(req.query.jobid != null)
          {
              jobid = req.query.jobid;    
          }

          console.log(jobid);
  
          // console.log("Applying for job based on job slug.");
          var userDetails= {
            ['cognito:groups']:null
          }
          
          userDetails = await jwt_decode(req.header('authorization'));
  
          console.log( userDetails['cognito:groups'][0]);
          
          if( userDetails['cognito:groups'][0] == 'userRecruiter' ){      //middlewares.submitCandidate(req, res, next, userDetails)
  
            console.log("filling up the candidate information ");
  
            //console.log(CandidateService);
            let candidateServiceInstance = Container.get(CompanyService);
            
            //console.log(candidateServiceInstance);
            console.log("Fetching the applied can");
            
            const candidateRecord = await candidateServiceInstance.AppliedApplicant(jobid, userDetails);    
            
            console.log(candidateRecord);

            if(candidateRecord == null)                             // console.log(console.log(userRecord)) // to see the userRecord in the debug logs
            {
                return res.sendStatus(401);     // Need to add a role back here if user role not succeefully set so as to loop again unless the role is added         
            }
            else
            {
              return res.json({ "success" : true , "enrolledCandidate" : candidateRecord }).status(200);  //console.log("User role set successfully in Mongo Db");           // successful response             
            }
          }
        }
        catch(e)
        {
          console.log(e)
          console.log("Failed to add the user data");
          return res.sendStatus(500);
        }
    });
  
  
  route.get('/getcans', middlewares.isAuth, async (req: Request, res: Response) =>{

      var userDetails= {
        ['cognito:groups']:null
      }
      
      userDetails = await jwt_decode(req.header('authorization'));

      if(userDetails['cognito:groups'][0] == 'userRecruiter')       //middlewares.submitCompany(req, res, next, userDetails)
      {        
        console.log("Fetching userdetails of recommended candidate");

        userDetails = await jwt_decode(req.header('authorization'));

        const companyServiceInstance = Container.get(CompanyService);

        const candidateRecords = await companyServiceInstance.GetCanList(userDetails);           
        
        // const candidateList="";
        return res.json({ "success" : true , user: candidateRecords }).status(200);    
      }
    })

    route.get('/search-can', middlewares.isAuth, async (req: Request, res: Response) =>{

      var userDetails= {
        ['cognito:groups']:null
      }
      
      userDetails = await jwt_decode(req.header('authorization'));

      if(userDetails['cognito:groups'][0] == 'userRecruiter')       //middlewares.submitCompany(req, res, next, userDetails)
      {        
        console.log("Fetching userdetails of recommended candidate");

        userDetails = await jwt_decode(req.header('authorization'));

        const companyServiceInstance = Container.get(CompanyService);

        const candidateRecords = await companyServiceInstance.GetCanFromSearch(userDetails, req);           
        
        // const candidateList="";
        return res.json({ "success" : true , user: candidateRecords }).status(200);    
      }
    })


    /*
     *   Method to get full profile of a given user
     */ 
  
    route.get('/getcan', middlewares.isAuth, async (req: Request, res: Response) => {
  
      var canid;
      if(req.query.canid != null)
      {
        canid = req.query.canid;    
      }

      var userDetails= {
        ['cognito:groups']:null
      }

      userDetails = await jwt_decode(req.header('authorization'));

      if(userDetails['cognito:groups'][0] == 'userRecruiter')       //middlewares.submitCompany(req, res, next, userDetails)
      {        
        console.log("fetching the userdetails for the company to view");

        const candidateServiceInstance = Container.get(CandidateService);

        const candidateRecord = await candidateServiceInstance.GetCandidateInfo(canid);           

        const canGitRecord = await candidateServiceInstance.GetGitInfo(canid);           

        // here we need to call another service th

        const candidateInfo = {
          'about':candidateRecord.about,
          'gitInfo': canGitRecord
        };

        console.log(candidateInfo)

        return res.json({ "success" : true , user: candidateInfo }).status(200);    
      }

    });



    
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

        const { candidateRecord , aboutRecord } = await candidateServiceInstance.GetCandidate(userDetails);           

        const canGitRecord = await candidateServiceInstance.GetGitInfo(userDetails['sub']);           

        // here we need to call another service th

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
          'skillsOrder' : canGitRecord.skillsOrder
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

