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
    * Method to get jobs by company name.
    */  
    route.get('/job', async (req: Request, res: Response) => {

        var userDetails= {
            ['cognito:groups']:null
        }
        
        userDetails = await jwt_decode(req.header('authorization'));
  
        // if( userDetails['cognito:groups'][0] != 'userRecruiter' )
        // {
        //     return res.sendStatus(401);         
        // }
         
        var cname = req.query.cname;
        console.log(cname);

        var tmpSkills = req.query.skills.toString()
        var skills = tmpSkills.split(',');
        console.log(skills);

        // var jobtitle = req.query.jobtitle;
        // console.log(jobtitle);

        // var ctc = req.query.ctc;
        // console.log(ctc);

        // var exp = req.query.exp;
        // console.log(exp);

        var latest = req.query.latest;
        console.log(latest);

        var jobRecords;

        // route for filter based on skills
        if(skills != null)
        {
            const jobServiceInstance = Container.get(JobService);
            jobRecords = await jobServiceInstance.GetJobsListBasedOnSkill(skills);
        }

        // route for filter based on company name
        if(cname != null)
        {
            const jobServiceInstance = Container.get(JobService);
            jobRecords = await jobServiceInstance.GetJobsListBasedOnCompanyName(cname);
        }
        
        // route for job based on their id's
        if(cname == null && skills == null && userDetails['cognito:groups'][0] != 'userRecruiter'){
            const jobServiceInstance = Container.get(JobService);
            jobRecords = await jobServiceInstance.GetJobsList(userDetails);    
        }
            
        //console.log(jobRecords);
        
        if(jobRecords == null)                             // console.log(console.log(userRecord)) // to see the userRecord in the debug logs
        {
            return res.json({ "success" : true, "jobRecord" : [] }).status(200);  //console.log("User role set successfully in Mongo Db");           // successful response             
        }
        else
        {
            return res.json({ "success" : true, "jobRecord" : jobRecords }).status(200);  //console.log("User role set successfully in Mongo Db");           // successful response             
        }
    });

};

  