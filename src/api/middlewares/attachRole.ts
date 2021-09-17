import { Container } from 'typedi';
import mongoose from 'mongoose';
import { IUser } from '@/interfaces/IUser';
import { Logger } from 'winston';
import jwt_decode from 'jwt-decode'

let AWS = require('aws-sdk');


// Need to do a clearner way to load the congif file via a loader or DI

/**
 * Attach user to role
 */
const attachRole = async (req, res, next) => {
    try 
    {
        let userDetails= {
            sub:"",
            email:""
        }

        let awsRegion = await process.env.REGION.toString()
        let userPoolId = await process.env.USER_POOL_ID.toString()
        let awsIAMAccessKey =  await process.env.AWS_ACCESS_KEY_ID.toString()           // console.log("Listing the other config details ",awsRegion,",",userPoolId,",",awsIAMSecretKey,",",awsIAMAccessKey);
        let awsIAMSecretKey = await process.env.AWS_SECRET_KEY.toString()               // console.log("The token setted up is ",token);
        
        userDetails = await jwt_decode(req.header('authorization'));
                                                                                        //console.log("Checking the cognito user group ",userDetails['cognito:groups'][0]);           
        if(userDetails['cognito:groups'] != undefined)                                  
        {
            return res.sendStatus(401);                                                 //console.log("User group exists for this particular user");
        }
                                                                                        //console.log("Checking the request parameters ");
        if(userDetails['sub'] == null && userDetails['email'] == null && req.body.groupName == null)
        {
            return res.sendStatus(401);                                                 //console.log("Unintentional Behaviour : Some Paramter was missing form FE")
        }

        // Set the user group param        
        let groupParam = {
            GroupName: req.body.groupName, /* required */
            UserPoolId: userPoolId, /* required */
            Username: userDetails['sub'] /* required */
        };
                                                                                        //console.log("Group paramters set successfully");
                                                                                        // This piece of code below can be in the service section
        AWS.config.update({ 'region': awsRegion, 'accessKeyId': awsIAMAccessKey, 'secretAccessKey': awsIAMSecretKey });
        let cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
        await cognitoidentityserviceprovider.adminAddUserToGroup(groupParam, async function(err) {
            if (err) {
                return res.sendStatus(401)                                               //console.log("Un-Authorised acccess is seen");
            } 
            else 
            {                                                                            //console.log("User role set successfully in Cognito");           // successful response           //console.log("Firing up the db query to add user to the mongodb");
                const UserModel = Container.get('userModel') as mongoose.Model<IUser & mongoose.Document>;
                const userRecord = await UserModel.create({
                    _id: userDetails.sub,                                                // cognitoUsername will be used as the id parameter for the user table.
                    email: userDetails.email,
                    role: req.body.groupName
                })
                if(userRecord._id == null)
                {                                                                         //console.log(console.log(userRecord)) // to see the userRecord in the debug logs
                    return res.sendStatus(401);                                           // Need to add a role back here if user role not succeefully set so as to loop again unless the role is added                                                                                                        
                }
                else{
                    return res.json({ "success" : true }).status(200);                    //console.log("User role set successfully in Mongo Db");           // successful response             
                }
            }
        });
    }
    catch (e) {
        //console.log('🔥 Error attaching user to req');
        res.sendStatus(401);
        return next(e);
    }
};

export default attachRole;
