const User = require("../models/User");
const jwt_decode = require('jwt-decode');
const Verifier = require('verify-cognito-token');
const { AWS_SECRET_KEY, AWS_ACCESS_KEY_ID, APP_CLIENT_ID, REGION, USER_POOL_ID } = require("../config");
var AWS = require('aws-sdk');

// params
const params = {
  region: REGION,  // required <your-aws-region>
  userPoolId: USER_POOL_ID, // required <your-user-pool-id>
  debug: true // optional parameter to show console logs
}

//optional claims examples
const claims = {
  aud: APP_CLIENT_ID, // <your-app-client-id>
  'cognito:groups': groups => groups.includes('userCandidate')
}

/**
 * @DESC To set group for a given user (Candidate, Recruiter).
 */
const setGroup = async (token, group, res) => {
  try 
  {
    if(group != 'userCandidate' || group != 'userRecruiter')
    {
      res.status(401).json({
        message: "Unauthorized User",
        success: false
      });
    }

    var userDetails = jwt_decode(token);
    console.log(userDetails);

    var groupParam = {
      GroupName: group, /* required */
      UserPoolId: USER_POOL_ID, /* required */
      Username: '21a56e0c-a56f-4fcc-ad06-0667d6803fb0' /* required */
    };

    AWS.config.update({ 'region': USER_POOL_REGION, 'accessKeyId': AWS_ACCESS_KEY_ID, 'secretAccessKey': AWS_SECRET_KEY });
    var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
    cognitoidentityserviceprovider.adminAddUserToGroup(groupParam, function(err, data) {
      if (err) 
      {
        console.log(err, err.stack);
        return res.status(401).json({
          message: "Unauthorized User",
          success: false
        });
      }
      else
      {
        console.log(data);           // successful response
        return res.status(200).json({
          message: data,
          success: true
        });
      }
    });
  } 
  catch (err) 
  {
    console.log("Inside the err state ",err);
    // Implement logger function (winston)
    return res.status(500).json({
      message: "Unable to set group",
      success: false
    });
  }
};


/**
 * @DESC To validate the user token and the group which it belongs to.
 */
const validateUserGroupNToken = async (res, token) => {
  try {
    const verifier = new Verifier(params, claims);
    verifier.verify(token)
    .then(result =>{
      console.log(result);
      //result will be `true` if token is valid, non-expired, and has matching claims
      //result will be `false` if token is invalid, expired or fails the claims check
    })
  } catch (err) {
    // Implement logger function (winston)
    return res.status(500).json({
      message: "Please Authenticate yourself.",
      success: false
    });
  }
};

/**
 * @DESC To user details from a JWT token.
 */
 const serializeUser = async (token, res) => {
  try {
    var userDetails = jwt_decode(token);
    console.log(userDetails);
    return userDetails;    
  } catch (err) {
    // Implement logger function (winston)
    return res.status(500).json({
      message: "Unable to create your account.",
      success: false
    });
  }
};


/**
 * @DESC Check Role Middleware
 */
const checkRole = roles => (token,res) =>
{
  try {
    var userDetails = jwt_decode(token);
    console.log(userDetails);
    //now we need to check the role in the user claims
  } catch (err) {
    // Implement logger function (winston)
    return res.status(401).json("Unauthorized")
  }
}; 


module.exports = {
  setGroup,
  checkRole,
  validateUserGroupNToken,
  serializeUser
};


// //optional claims examples
// const claims = {
//   aud: APP_CLIENT_ID, // <your-app-client-id>
//   // email_verified: true, // as we are doing fedaratedd sign in this param can be ignored
//   // auth_time: time => time <= 1524588564, // time stuff has to be applied in the full fledge application
//   'cognito:groups': groups => groups.includes('userCandidate')
// }

// //  'cognito:groups': groups => groups.includes('userRecruiter')
// // 'cognito:groups': groups => groups.includes('userCandidate')
