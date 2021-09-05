import { Service, Inject } from 'typedi';
import { IJob } from './../interfaces/IJob';
import mongoose from 'mongoose';
import company from '@/models/company';
import { forEach, toInteger } from 'lodash';

@Service()
export default class JobService {
    constructor(
        @Inject('candidateModel') private candidateModel: Models.CandidateModel,
        @Inject('companyModel') private companyModel: Models.CompanyModel,
        @Inject('jobModel') private jobModel: Models.JobModel,
        @Inject('aboutModel') private aboutModel: Models.AboutModel,
        ){
    }
                                                                                                                                    // sanity check for data skill count has to be applied each skill not greater then 100 char and array size not greater then 50.
                                                                                                                                    // sanity check for user whatsapp Number , jobtitle not more the 100 char, about not more then 1000 characters                                                                                                                                     // as it is both good for the recruiter to read and the candidate to describe in the reading aspect for the profile
    public async CreateJob(token, req): Promise<any> 
    {
        try
        {
            console.log("Submitting the About Section For the Candidate");
            
            // fetched the company model for the given company 
            const companyRecord = await this.companyModel.findById(token.sub);

            var count = companyRecord['jobCount'];

            console.log(count);

            count = count+1;

            console.log(companyRecord);

            // then inserted the data inside the about for setting up the job desccription
            const aboutRecord = await this.aboutModel.create({
                _id: token.sub+"-"+count,
                about: req.body.jobDescription
            });

            console.log(aboutRecord)
            
            // token.sub+"-"+companyRecord.jobcount+1
            // setting up the ojb model                                                                                                               

            var skills = req.body.skills.split(",")

            const jobRecord = await this.jobModel.create({
                _id: token.sub+"-"+count,                                                                                                             // cognitoUsername will be used as the id parameter for the user table.
                companyName: companyRecord.name,
                jobTitle:req.body.jobTitle,
                jobLocation: req.body.jobLocation,
                aboutid: token.sub+"-"+count,
                companyId: companyRecord._id,
                skills: skills,
                jobslug: companyRecord.name+"-"+req.body.jobTitle+count, 
                ctc: req.body.ctc,
                exp: req.body.exp
            });

            //count = count+1;

            // The job model indesrted in the Db is
            console.log(jobRecord);
            
            const updatedCompanyRecord = await this.companyModel.findOneAndUpdate({
                _id: token.sub
            }, { jobCount: count }, { upsert: true, useFindAndModify: false });

            // updating the job count in the company record

            console.log(updatedCompanyRecord);

            const jobUploaded = {
                companyName: companyRecord.name,
                companyId: companyRecord._id,
                jobTitle:req.body.jobTitle,
                jobLocation: req.body.jobLocation,
                jobStatus: true,
                jobDescription : req.body.jobDescription,
                skills: jobRecord.skills,
                jobslug: jobRecord.jobslug,
                ctc: req.body.ctc,
                exp: req.body.exp
            }

            // returning the job object
            return { jobUploaded }       
        }
        catch (e) {
            console.log(e);
            throw e;
        }
    }

    public async GetJobsListBasedOnCompanyName(cname): Promise<any> {
        try
        {
            // const jobRecord = await this.jobModel.find(token.sub);                                                        // console.log("Fetching the Candidate Details");                                                                                                           //var ObjectId = mongoose.Types.ObjectId;                                                     
            var query = { 'companyName': cname };
            console.log(query);

            const jobRecord = await this.jobModel.find(query);          
            console.log(jobRecord);

            var jobList = [];
            var i=0;
            for(;i<jobRecord.length;i++)
            {
                var job = {
                    companyName: jobRecord[i].companyName,
                    jobTitle: jobRecord[i].jobTitle,
                    jobLocation: jobRecord[i].jobLocation,
                    jobStatus: jobRecord[i].jobStatus,
                    skills: jobRecord[i].skills,
                    jobslug: jobRecord[i].jobslug,
                    ctc: jobRecord[i].ctc,
                    exp: jobRecord[i].exp                
                }        
                jobList.push(job);
            }

            return jobList;                                                                                                          // Need to update the data in the user model also need to remove console logs once upadted the method properly
        }
        catch (e) {
            throw e;
        }
    }

    public async GetJobByReco(userDetails): Promise<any>
    {
        try
        {
            const candidateRecord = await this.candidateModel.findById(userDetails.sub);
            var skills = candidateRecord.skills;

            // below both the methods are valid for quering a search in mongo using moongoose for multiple search in inside an aaray of object
            const jobRecord = await this.jobModel.find({skills: {$in: skills}})

            //const jobRecord = this.jobModel.find(skillQueryString);

            //console.log(jobRecord);
            var jobList = [];
            var i=0;

            //console.log(jobRecord);
            for(;i<jobRecord.length;i++)
            {
                // console.log(jobRecord)
                var job = {
                    companyName: jobRecord[i].companyName,
                    jobTitle: jobRecord[i].jobTitle,
                    jobLocation: jobRecord[i].jobLocation,
                    jobStatus: jobRecord[i].jobStatus,
                    skills: jobRecord[i].skills,
                    jobslug: jobRecord[i].jobslug,
                    ctc: jobRecord[i].ctc,
                    exp: jobRecord[i].exp                
                }        
                jobList.push(job);
            }
            //console.log(jobList);
            //return jobList
            return jobRecord;                                                                                                          // Need to update the data in the user model also need to remove console logs once upadted the method properly
        }
        catch (e) {
            throw e;
        }
    }

    public async GetJobByTrend(userDetails): Promise<any>
    {
        try
        {
            const candidateRecord = await this.candidateModel.findById(userDetails.sub);

            var skills = candidateRecord.skills;

            const jobRecord = await this.jobModel.find({skills: {$in: skills}})

            var jobList = [];
            var i=0;

            for(;i<jobRecord.length;i++)
            {
                var job = {
                    companyName: jobRecord[i].companyName,
                    jobTitle: jobRecord[i].jobTitle,
                    jobLocation: jobRecord[i].jobLocation,
                    jobStatus: jobRecord[i].jobStatus,
                    skills: jobRecord[i].skills,
                    jobslug: jobRecord[i].jobslug,
                    ctc: jobRecord[i].ctc,
                    exp: jobRecord[i].exp                
                }        
                jobList.push(job);
            }
            return jobRecord;                                                                                                          // Need to update the data in the user model also need to remove console logs once upadted the method properly
        }
        catch (e) {
            throw e;
        }
    }

    public async GetJobsListRe(token): Promise<any> {
        try
        {
            // const jobRecord = await this.jobModel.find(token.sub);                                                        // console.log("Fetching the Candidate Details");                                                                                                           //var ObjectId = mongoose.Types.ObjectId;                                                     
            var query = { 'companyId': token.sub };
            console.log(query);
            const jobRecord = await this.jobModel.find(query);          
            console.log(jobRecord);
            var jobList = [];
            var i=0;
            for(;i<jobRecord.length;i++)
            {
                var job = {
                    companyName: jobRecord[i].companyName,
                    jobTitle: jobRecord[i].jobTitle,
                    jobLocation: jobRecord[i].jobLocation,
                    jobStatus: jobRecord[i].jobStatus,
                    skills: jobRecord[i].skills,
                    jobslug: jobRecord[i].jobslug,
                    ctc: jobRecord[i].ctc,
                    exp: jobRecord[i].exp 
                }
                jobList.push(job);
            }
            console.log(job);
            return jobList;                                                                                                          // Need to update the data in the user model also need to remove console logs once upadted the method properly
        }
        catch (e) {
            throw e;
        }
    }


    public async GetJobsListCan(token): Promise<any> {
        try
        {
            console.log("Fetching job list for recruiter");
            // const jobRecord = await this.jobModel.find(token.sub);                                                        // console.log("Fetching the Candidate Details");                                                                                                           //var ObjectId = mongoose.Types.ObjectId;                                                     
            var query = { 'companyId': token.sub };
            // console.log(query);
            var jobRecord = await this.jobModel.find(query);          
            console.log(jobRecord);
            var jobList = [];
            var i=0;
            for(;i<jobRecord.length;i++)
            {
                var job = {
                    companyName: jobRecord[i].companyName,
                    jobTitle: jobRecord[i].jobTitle,
                    jobLocation: jobRecord[i].jobLocation,
                    jobStatus: jobRecord[i].jobStatus,
                    skills: jobRecord[i].skills,
                    jobslug: jobRecord[i].jobslug,
                    ctc: jobRecord[i].ctc,
                    exp: jobRecord[i].exp                
                }
                jobList.push(job);
            }
            return jobList;                                                                                                          // Need to update the data in the user model also need to remove console logs once upadted the method properly
        }
        catch (e) {
            throw e;
        }
    }


    public async GetJobDescription(companyName, jobTitle): Promise<any>
    {
        try
        {
            const jobRecord = await this.jobModel.findOne({ companyName : companyName, jobTitle : jobTitle })
            const aboutRecord = await this.aboutModel.findOne({ _id : jobRecord._id })
            return aboutRecord ;
        }
        catch(e)
        {
            console.log(e)
        }
    }

    public async GetJobDescriptionBySlug(jobslug): Promise<any>
    {
        try
        {
            var query = { jobslug: jobslug };
            const jobRecord = await this.jobModel.findOne(query);
            console.log(jobRecord);
            const jobDetail = {
                companyName: jobRecord.companyName,
                jobTitle: jobRecord.jobTitle,
                jobLocation: jobRecord.jobLocation,
                skills: jobRecord.skills,
                ctc: jobRecord.ctc,
                exp: jobRecord.exp
            }
        
            return jobDetail ;
        }
        catch(e)
        {
            console.log(e)
        }
    }
    

    public async GetJobsListBasedOnSkill(skills): Promise<any>{
        try
        {
            // const jobRecord = await this.jobModel.find(token.sub);                                                        // console.log("Fetching the Candidate Details");                                                                                                           //var ObjectId = mongoose.Types.ObjectId;                                                     
            // var skillQuery="{";
            
            // var skillKey = "\"skills\":\"";
            // var skillEnd = "\"}";
            // var i=0;
            // if(skills.length == 1)
            // {
            //     skillQuery = skillQuery+"\"skills\":\""+skills[i]+"\"}";
            // }
            // else
            // {
            //     for(; i < skills.length ; i++)
            //     {
            //         if(i == skills.length-1)
            //         {
            //             skillQuery = skillQuery+skillKey+skills[i]+skillEnd;    
            //         }
            //         else{
            //             skillQuery = skillQuery+skillKey+skills[i]+"\",";
            //         }

            //     }
            // }
            // console.log(skillQuery);
            // var skillQueryString = JSON.parse(skillQuery);
            
            // console.log(skillQueryString);

            // below both the methods are valid for quering a search in mongo using moongoose for multiple search in inside an aaray of object
            const jobRecord = await this.jobModel.find({skills: {$in: skills}})
            //const jobRecord = this.jobModel.find(skillQueryString);

            //console.log(jobRecord);
            var jobList = [];
            var i=0;

            //console.log(jobRecord);
            for(;i<jobRecord.length;i++)
            {
                // console.log(jobRecord)
                var job = {
                    companyName: jobRecord[i].companyName,
                    jobTitle: jobRecord[i].jobTitle,
                    jobLocation: jobRecord[i].jobLocation,
                    jobStatus: jobRecord[i].jobStatus,
                    skills: jobRecord[i].skills,
                    jobslug: jobRecord[i].jobslug,
                    ctc: jobRecord[i].ctc,
                    exp: jobRecord[i].exp                
                }        
                jobList.push(job);
            }
            //console.log(jobList);
            //return jobList
            return jobRecord;                                                                                                          // Need to update the data in the user model also need to remove console logs once upadted the method properly
        }
        catch (e) {
            throw e;
        }
    }
}      
    
  
