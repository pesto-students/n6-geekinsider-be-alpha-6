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
            console.log("Attaching the cognito user group");

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
    * Get Job Description .
    */  
    route.get('/jobdetaildesc', async (req: Request, res: Response) => {

        var userDetails= {
            ['cognito:groups']:null
        }

        var cname; 
        var title;

        // var cname = req.query.cname; 
        // var title = req.query.title;
    
        var aboutRecord;
        
        userDetails = await jwt_decode(req.header('authorization'));
  
        // console.log(cname, title);
    
        if(req.query.cname != null && req.query.title !=null)
        {
            cname = req.query.cname;    
            title = req.query.title;    
            const jobServiceInstance = Container.get(JobService);
            aboutRecord = await jobServiceInstance.GetJobDescription(cname, title);
        }

        if(aboutRecord == null)                          
        {
            return res.json({ "success" : true, "jobDescription" : {} , "result" : false }).status(200);        
        }
        else
        {
            var JobDesc = {
                "JobDescription" : aboutRecord.about
            }    
            return res.json({ "success" : true, "jobDescription" : JobDesc , "result" : true }).status(200);
        }
    });

    /*
    * Method to get jobs by jobdetail slug.
    */  
    route.get('/jobdetail', async (req: Request, res: Response) => {
        
        const jobslug = req.query.jobid;
        var jobRecords;

        if(jobslug != null)
        {
            console.log("Fetching the job id : ",jobslug);
            const jobServiceInstance = Container.get(JobService);
            jobRecords = await jobServiceInstance.GetJobDescriptionBySlug(jobslug);
            
            //console.log(jobRecords);
            if(jobRecords == null)                             // console.log(console.log(userRecord)) // to see the userRecord in the debug logs
            {
                return res.json({ "success" : true, "jobRecord" : [] }).status(200);  //console.log("User role set successfully in Mongo Db");           // successful response             
            }
            else
            {
                return res.json({ "success" : true, "jobRecord" : jobRecords }).status(200);  //console.log("User role set successfully in Mongo Db");           // successful response             
            }
    
        }
    });


    /*
     * Method to get jobs by trend. GetJobByTrend.
     */  
    route.get('/trend', async (req: Request, res: Response) => {
               
        var jobRecords;

        var userDetails = await jwt_decode(req.header('authorization'));

        const jobServiceInstance = Container.get(JobService);

        jobRecords = await jobServiceInstance.GetJobByTrend(userDetails);
        
        if(jobRecords == null)                             // console.log(console.log(userRecord)) // to see the userRecord in the debug logs
        {
            return res.json({ "success" : true, "jobRecord" : [] }).status(200);  //console.log("User role set successfully in Mongo Db");           // successful response             
        }
        else
        {
            return res.json({ "success" : true, "jobRecord" : jobRecords }).status(200);  //console.log("User role set successfully in Mongo Db");           // successful response             
        }
    
    });

    /*
     * Method to get jobs by trend. GetJobByTrend.
     */  
    route.get('/reco', async (req: Request, res: Response) => {
               
        var jobRecords;

        var userDetails = await jwt_decode(req.header('authorization'));

        const jobServiceInstance = Container.get(JobService);

        jobRecords = await jobServiceInstance.GetJobByReco(userDetails);
        
        if(jobRecords == null)                             // console.log(console.log(userRecord)) // to see the userRecord in the debug logs
        {
            return res.json({ "success" : true, "jobRecord" : [] }).status(200);  //console.log("User role set successfully in Mongo Db");           // successful response             
        }
        else
        {
            return res.json({ "success" : true, "jobRecord" : jobRecords }).status(200);  //console.log("User role set successfully in Mongo Db");           // successful response             
        }
    
    });


    /*
    * Method to get jobs by company name.
    */  
    route.get('/job', async (req: Request, res: Response) => {

        console.log("fetching the job details");

        var userDetails= {
            ['cognito:groups']:null
        }
        
        userDetails = await jwt_decode(req.header('authorization'));
  
        // if( userDetails['cognito:groups'][0] != 'userRecruiter' )
        // {
        //     return res.sendStatus(401);         
        // }
        var cname; 
        var skills;
        var latest;
        var jobslug;
        if(req.query.cname != null)
        {
            cname = req.query.cname;    
        }
        if(req.query.skills != null)
        {
            var tmpSkills = req.query.skills.toString()
            skills = tmpSkills.split(',');
        }
        if(req.query.jobslug != null)
        {
            jobslug = req.query.jobslug;
            console.log(jobslug);
        }
        if(req.query.latest != null)
        {
            latest = req.query.latest;
            console.log(latest);    
        }
        // var jobtitle = req.query.jobtitle;
        // console.log(jobtitle);
        // var ctc = req.query.ctc;
        // console.log(ctc);
        // var exp = req.query.exp;
        // console.log(exp);

        var jobRecords;

        console.log(cname);
        // route for filter based on skills
        if(skills != null)
        {
            const jobServiceInstance = Container.get(JobService);
            jobRecords = await jobServiceInstance.GetJobsListBasedOnSkill(skills);
            return res.json({ "success" : true, "jobRecord" : jobRecords }).status(200);
        }

        //GetJobDescriptionBySlug

        // route for filter based on skills

        // if(jobslug != null)
        // {
        //     console.log("Fetching the job id");
        //     const jobServiceInstance = Container.get(JobService);
        //     jobRecords = await jobServiceInstance.GetJobDescriptionBySlug(jobslug);
        // }

        // route for filter based on company name
        if(cname != null)
        {
            console.log("searching job based on cname");
            const jobServiceInstance = Container.get(JobService);
            jobRecords = await jobServiceInstance.GetJobsListBasedOnCompanyName(cname);
            return res.json({ "success" : true, "jobRecord" : jobRecords }).status(200);
        }
        // route for job based on their id's
        if(cname == null && skills == null && jobslug == null && userDetails['cognito:groups'][0] == 'userRecruiter'){
            const jobServiceInstance = Container.get(JobService);
            console.log("Fetching jobs for recruiter");
            jobRecords = await jobServiceInstance.GetJobsListRe(userDetails);  
            return res.json({ "success" : true, "jobRecord" : jobRecords }).status(200);  
        }
  
        // route for job based on their id's
        if(userDetails['cognito:groups'][0] == 'userCandidate'){
            const jobServiceInstance = Container.get(JobService);
            jobRecords = await jobServiceInstance.GetJobsListCan(userDetails); 
            return res.json({ "success" : true, "jobRecord" : jobRecords }).status(200);   
        }    
    
        //console.log(jobRecords);
        
        if(jobRecords == null)                             // console.log(console.log(userRecord)) // to see the userRecord in the debug logs
        {
            return res.json({ "success" : true, "jobRecord" : [] }).status(200);  //console.log("User role set successfully in Mongo Db");           // successful response             
        }
        // else
        // {
        //     return res.json({ "success" : true, "jobRecord" : jobRecords }).status(200);  //console.log("User role set successfully in Mongo Db");           // successful response             
        // }
    });

};

  