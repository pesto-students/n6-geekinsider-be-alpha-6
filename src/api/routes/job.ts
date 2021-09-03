import { Router, Request, Response } from 'express';
import middlewares from '../middlewares';
import jwt_decode from 'jwt-decode'
import { Container } from 'typedi';
import JobService from './../../services/job';

const route = Router();

export default (app: Router) => {
    /*
    * Under the Job Route we have both condidate and recruiter profile routes for job relasted action 
    */
    app.use('/jobs', route);
  
    /*
    * Method to get full profile of a given user 
    */
    route.post(
    '/job',
    middlewares.isAuth,
    async (req, res) => 
    {
        try
        {
            console.log("Adding a job");

            var userDetails= {
                ['cognito:groups']:null
            }
            
            userDetails = await jwt_decode(req.headers.authorization);            
            console.log("checking the cognito user role");

            if( userDetails['cognito:groups'][0] != 'userRecruiter' )
            {
                return res.sendStatus(401);         
            }
            console.log("the username validation has crossed");
            const jobServiceInstance = Container.get(JobService);
            const jobRecord = await jobServiceInstance.CreateJob(userDetails, req);

            console.log(jobRecord)
            
            // var createdJobdetail = {
            //     'jobTitle' : jobRecord.jobTitle,
            //     'jobLocation' : jobRecord.jobLocation,
            // }
            return res.json({ "success" : true , "jobDetail" : jobRecord }).status(200);     
            
        }
        catch(e)
        {
            console.log("Failed to create job");
            return res.sendStatus(500);
        }
    });


    /*
    * Method to get full profile of a given user
    */  
    // route.get('/user', middlewares.isAuth, async (req: Request, res: Response) => {
      
    //     var userDetails= {
    //         ['cognito:groups']:null
    //     }

    //     userDetails = await jwt_decode(req.header('authorization'));

    //     if(userDetails['cognito:groups'][0] == 'userCandidate'){      //middlewares.submitCandidate(req, res, next, userDetails)

    //         console.log("fetching the userdetails the of the candiadte");

    //         userDetails = await jwt_decode(req.header('authorization'));

    //         const candidateServiceInstance = Container.get(CandidateService);

    //         const { candidateRecord , aboutRecord } = await candidateServiceInstance.GetCandidate(userDetails);           

    //         // here we need to call another service th

    //         const candidateInfo = {
    //         'name':candidateRecord.name,
    //         'jobtitle':candidateRecord.jobtitle,
    //         'githubUrl':candidateRecord.githubUrl,
    //         'skills':candidateRecord.skills,
    //         'about':aboutRecord.about,
    //         'whatsappNumber':candidateRecord.whatsappNumber,
    //         'exp':candidateRecord.exp,
    //         'ctc':candidateRecord.ctc,
    //         'location':candidateRecord.location
    //         };

    //         return res.json({ "success" : true , user: candidateInfo }).status(200);

    //     }
    //     if(userDetails['cognito:groups'][0] == 'userRecruiter')       //middlewares.submitCompany(req, res, next, userDetails)
    //     {        
    //         console.log("fetching the userdetails the of the company");

    //         userDetails = await jwt_decode(req.header('authorization'));

    //         const companyServiceInstance = Container.get(CompanyService);

    //         const { companyRecord, aboutRecord } = await companyServiceInstance.GetCompany(userDetails);           
            
    //         // here we need to call another service th

    //         const companyInfo = {
    //         'name':companyRecord.name,
    //         'whatsappNumber':companyRecord.whatsappNumber,
    //         'preferredIndustry':companyRecord.preferredIndustry,
    //         'location':companyRecord.location,
    //         'skills':companyRecord.skills,
    //         'about':aboutRecord.about,
    //         'empSize':companyRecord.empSize,
    //         'site':companyRecord.site,
    //         };

    //         return res.json({ "success" : true , user: companyInfo }).status(200);    
    //     }

    // });
  
};
