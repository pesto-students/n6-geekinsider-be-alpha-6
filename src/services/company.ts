import { Service, Inject } from 'typedi';
import { ICompany } from './../interfaces/ICompany';
import { IAbout } from './../interfaces/IAbout';
import { Logger } from 'winston';
import { Container } from 'typedi';

@Service()
export default class CompanyService {
  constructor(
    @Inject('companyModel') private companyModel: Models.CompanyModel,
    @Inject('candidateModel') private candidateModel: Models.CandidateModel,
    @Inject('aboutModel') private aboutModel: Models.AboutModel,
    @Inject('connectModel') private connectModel: Models.ConnectModel,
  ){
  }
    
  public async AppliedApplicant(jobid, userDetails): Promise<any> 
  {
    const logger:Logger = Container.get('logger');
  
    try
    {
    
      logger.debug("the applied applicatns are", jobid);
        
      const connectRecord = await this.connectModel.find({$and: [{ 'jobslug': jobid }, { 'companyid': userDetails.sub }]});
      
      logger.debug(connectRecord.length);

      let connections = []; 
      let i = 0;

      for (;i<connectRecord.length;i++)
      {
          logger.debug(connectRecord.length);
          let fetchCan = { '_id': connectRecord[i]['candidateid'] }; // companyRecord.name+"-"+req.body.jobTitle+count
          const candidateRecord = await this.candidateModel.find(fetchCan);
          logger.debug("The can record is : ",candidateRecord);
          connections.push({
            'skills' : candidateRecord[i]['skills'],
            'name' : candidateRecord[i]['name'],
            'jobTitle' : candidateRecord[i]['jobTitle'],
            'location' : candidateRecord[i]['location'],
            'exp' : candidateRecord[i]['exp'],
            'whatsappNumber' : candidateRecord[i]['whatsappNumber'],
            'userId' : candidateRecord[i]['_id'],
            'githubUrl' : candidateRecord[i]['githubUrl']
          })
      }

      logger.debug(connections);
      return connections;
    }
    catch(e)
    {
      logger.debug(e);
      throw e;
    }
  }


  public async SetCompany(token, req ): Promise<{ companyRecord: ICompany }> 
  {
    const logger:Logger = Container.get('logger');
    
    try
    {
      logger.debug("Submitting the Company Details");

      let skills = req.body.skills.split(",")

      const aboutRecord = await this.aboutModel.create({
        _id: token.sub,
        about: req.body.about
      });

      const companyRecord = await this.companyModel.create({
        _id: token.sub,  // cognitoUsername will be used as the id parameter for the user table.
        name: req.body.name,
        whatsappNumber: req.body.whatsappNumber,
        location: req.body.location,
        prefferedIndustry:req.body.prefferedIndustry,
        skills:skills,
        empSize:req.body.empSize,
        site:req.body.site,
        aboutid: aboutRecord['_id']
      });
      logger.debug(companyRecord);
      // Need to update the data in the user model also need to remove console logs once upadted the method properly
      return { companyRecord }  
    }
    catch (e) {
      logger.debug(e);
      throw e;
    }
  }

  // GetAppliedCan

  public async GetCanList(token): Promise<any> {
    const logger:Logger = Container.get('logger');
    
    try
    {
      logger.debug("Submitting the Company Details");

      const companyRecord = await this.companyModel.findById(token.sub);
      logger.debug(companyRecord);

      let query = {skills: {$in: companyRecord.skills}}
      const candidateRecord = await this.candidateModel.find(query);

      // Need to update the data in the user model also need to remove console logs once upadted the method properly
      return candidateRecord  
    }
    catch (e) {
      throw e;
    }
  }


  public async GetCanFromSearch(token, req): Promise<any> 
  {
    const logger:Logger = Container.get('logger');
    
    try
    {
      logger.debug("Fetching candidates based on skills");

      let query = {skills: {$in: req.query.skills.split(",")}}
      logger.debug(query);
      const candidateRecord = await this.candidateModel.find(query);

      // Need to update the data in the user model also need to remove console logs once upadted the method properly
      return candidateRecord  
    }
    catch (e) {
      throw e;
    }
  }

  public async GetCompany(token): Promise<{ companyRecord: ICompany  , aboutRecord: IAbout }> 
  {
    
    const logger:Logger = Container.get('logger');
    
    try{
      logger.debug("Submitting the Company Details");

      const companyRecord = await this.companyModel.findById(token.sub);
      logger.debug(companyRecord);

      const aboutRecord = await this.aboutModel.findById(token.sub);

      // Need to update the data in the user model also need to remove console logs once upadted the method properly
      return { companyRecord , aboutRecord }  
    }
    catch (e) {
      throw e;
    }
  }
}


