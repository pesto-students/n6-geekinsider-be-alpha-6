import { Service, Inject } from 'typedi';
import { IJob } from './../interfaces/IJob';
import mongoose from 'mongoose';


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

          // then inserted the data inside the about for setting up the job desccription
          const aboutRecord = await this.aboutModel.create({
              _id: token.sub+"-"+companyRecord.jobcount+1,
              about: req.body.jobDescription
          });

          console.log(aboutRecord)
          
          // token.sub+"-"+companyRecord.jobcount+1
          // setting up the ojb model                                                                                                               
          const jobRecord = await this.jobModel.create({
              _id: token.sub+"-"+companyRecord.jobcount+1,                                                                                                             // cognitoUsername will be used as the id parameter for the user table.
              companyName: companyRecord.name,
              jobTitle:req.body.jobtitle,
              jobLocation: req.body.jobLocation,
              aboutid: token.sub+"-"+companyRecord.jobcount+1
          });

          // The job model indesrted in the Db is
          console.log(jobRecord);
          
          const updatedCompanyRecord = await this.companyModel.findOneAndUpdate({
              _id: token.sub
          }, { jobcount: companyRecord.jobcount+1 }, { upsert: true, useFindAndModify: false });

          // updating the job count in the company record

          console.log(updatedCompanyRecord);

          const jobUploaded = {
              companyName: companyRecord.name,
              jobTitle:req.body.jobTitle,
              jobLocation: req.body.jobLocation,
              jobStatus: true,
              jobDescription : req.body.jobDescription,
            }

          // returning the job object
          return { jobUploaded }       
      }
      catch (e) {
          console.log(e);
          throw e;
      }
    }

  // public async GetJobDescription(token): Promise<{ jobRecord: IJob }> {
  //   try
  //   {
  //       const candidateRecord = await this.candidateModel.findById(token.sub);                                                        // console.log("Fetching the Candidate Details");
  //                                                                                                                                       //var ObjectId = mongoose.Types.ObjectId;                              
  //                                                                                                                                       //var query = { '_id': new ObjectId(candidateRecord.aboutid.toString()) };
  //       const aboutRecord = await this.aboutModel.findById(token.sub);
  //       console.log(aboutRecord, candidateRecord);                                                                                    // const aboutRecord = await this.aboutModel.find({ "_id": mongoose.Types.ObjectId(candidateRecord['aboutid']) });                          //console.log(aboutRecord);
                
  //       return { jobRecord }                                                                                                          // Need to update the data in the user model also need to remove console logs once upadted the method properly
  //   }
  //   catch (e) {
  //     throw e;
  //   }
  // }
  
  // public async GetJobs(token): Promise<{ jobRecord: IJob }> {
  //   try
  //   {
  //       console.log("Fetching the Candidate Details");

  //       const candidateRecord = await this.candidateModel.findById(token.sub);

  //       const aboutRecord = await this.aboutModel.findById(token.sub);
        
  //       console.log(aboutRecord, candidateRecord);
        
  //       return { jobRecord }                                                                                                  // Need to update the data in the user model also need to remove console logs once upadted the method properly
  //   }
  //   catch (e) {
  //     throw e;
  //   }
  // }
}
