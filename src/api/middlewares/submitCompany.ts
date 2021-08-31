import jwt_decode from 'jwt-decode'
import { Container } from 'typedi';
import mongoose from 'mongoose';
import { ICompany } from '@/interfaces/ICompany';

const submitCompany = async (req, res, next, token) => {
  /**
   * @TODO Edge and Internet Explorer do some weird things with the headers
   * So I believe that this should handle more 'edge' cases ;)
   */
  try {
    // need to apply a check wether a candidate info exits for a given email id if yes then only update action is possible.
    console.log("Submitting the Company Details");

    // sanity check for data skill count has to be applied each skill not greater then 100 char and array size not greater then 50.
    // sanity check for user whatsapp Number , jobtitle not more the 100 char, about not more then 1000 characters 
    // as it is both good for the recruiter to read and the candidate to describe in the reading aspect for the profile
    const Company = Container.get('companyModel') as mongoose.Model<ICompany & mongoose.Document>;
    const recruiterRecord = await Company.create({
        _id: token.email,  // cognitoUsername will be used as the id parameter for the user table.
        whatsappNumber: req.body.whatsappNumber,
        jobtitle:req.body.jobtitle,
        skills:req.body.skills,
        name: req.body.skills,
        location: req.body.location
    })

    // Then we need to updae the about table.
    // And pass the about id to the candidate table.
    if(recruiterRecord._id == null)
    {
        //console.log(console.log(userRecord)) // to see the userRecord in the debug logs
        return res.sendStatus(401);
        // Need to add a role back here if user role not succeefully set so as to loop again unless the role is added            
    }
    else{
        //console.log("User role set successfully in Mongo Db");           // successful response             
        return res.sendStatus(200)
    }
  }
  catch (e) {
    return next(e);
  }
};


export default submitCompany;
