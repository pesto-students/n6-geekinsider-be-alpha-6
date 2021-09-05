import { Service, Inject } from 'typedi';
import { ICompany } from './../interfaces/ICompany';
import { IChat } from './../interfaces/IChat';

@Service()
export default class ChatService {
  constructor(
    @Inject('companyModel') private companyModel: Models.CompanyModel,
    @Inject('candidateModel') private candidateModel: Models.CandidateModel,
    @Inject('chatModel') private chatModel: Models.ChatModel,
    @Inject('jobModel') private jobModel: Models.JobModel,
    ){
  }
    
  public async ApplyJob(token, req ): Promise<any> {
    try{
      console.log("Applying for the job");
      
      const jobRecord = await this.jobModel.find({
        jobslug: req.body.jobslug,
      });

      const chatRecord = await this.chatModel.create({
        _id: token.sub,  // cognitoUsername will be used as the id parameter for the user table.
        comid: jobRecord['companyId'],
        canid: token.sub,
        status: 1,
      });
      console.log(chatRecord);
      // Need to update the data in the user model also need to remove console logs once upadted the method properly
      return { chatRecord }  
    }
    catch (e) {
      console.log(e);
      throw e;
    }
  }


  public async SelectCan(token): Promise<any> {
    try
    {
      const companyRecord = await this.companyModel.findById(token.sub);
      console.log(companyRecord);

      var query = {skills: {$in: companyRecord.skills}}
      const candidateRecord = await this.candidateModel.find(query);

      // Need to update the data in the user model also need to remove console logs once upadted the method properly
      return candidateRecord  
    }
    catch (e) {
      throw e;
    }
  }

}
