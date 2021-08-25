const User = require("../models/User");
const jwt_decode = require('jwt-decode');
const Verifier = require('verify-cognito-token');
const { AWS_SECRET_KEY, AWS_ACCESS_KEY_ID, APP_CLIENT_ID, REGION, USER_POOL_ID } = require("../config");
var AWS = require('aws-sdk');

// To integrate this peice of code for error functions
// var sendAuthError = {
//   message: "Unauthorized User",
//   success: false
// }

// params for autheticating a token
const params = {
  region: REGION,  // required <your-aws-region>
  userPoolId: USER_POOL_ID, // required <your-user-pool-id>
  debug: true // optional parameter to show console logs
}

// Claim for canadidate
const candidateClaims = {
  aud: APP_CLIENT_ID, // <your-app-client-id>
  'cognito:groups': groups => groups.includes('userCandidate')
}

// Claim for recruiter
const recruiterClaims = {
  aud: APP_CLIENT_ID, // <your-app-client-id>
  'cognito:groups': groups => groups.includes('userRecruiter')
}

/**
 * @DESC To validate the user token.
**/
const validateUser = async (token, res) => {
  try {
    console.log("Validating the user ...");
    var verifier = new Verifier(params);
    verifier.verify(token)
    .then(result =>{
      if(result == false)
      {
        return res.status(401).json({
          message: "Unauthenticated user.",
          success: false
        });
      }
      console.log("This is a valid user");
      return ;
    })
  } catch {
    console.log("Internal server error in validate user util");
    return res.status(500).json({
      message: "Internal server error.",
      success: false
    });
  }
};


/**
 * @DESC To set group for a given user (Candidate, Recruiter).
 */
const setGroup = async (token, group, res) => {
  try 
  {
    // we will have to add a condition for checking the cognito user
    console.log("Settiing up the User role");
    if(!(group == 'userCandidate' || group == 'userRecruiter'))
    {
      return res.status(401).json({
        message: "Unauthorized User",
        success: false
      });
    }

    // decode the JWT token
    var userDetails = jwt_decode(token);

    if('cognito:groups' in userDetails)
    {
      console.log("User group exists for this particular user");
      return res.status(401).json({
        message: "Unauthorized User",
        success: false
      });
    }

    var groupParam = {
      // Set the user group param
      GroupName: group, /* required */
      UserPoolId: USER_POOL_ID, /* required */
      Username: userDetails.sub /* required */
    };

    AWS.config.update({ 'region': REGION, 'accessKeyId': AWS_ACCESS_KEY_ID, 'secretAccessKey': AWS_SECRET_KEY });
    var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
    await cognitoidentityserviceprovider.adminAddUserToGroup(groupParam, function(err, data) {
      if (err) {
        console.log("Un-Authorised acccess is seen");
        return res.status(401).json({
          message: "Unauthorized User",
          success: false
        });
      } else {
        console.log(data);
        console.log("User role set successfully in Cognito");           // successful response     
      }
    });
    var userDetails = jwt_decode(token);
    var userEmail = userDetails.email;
    var sub = userDetails.sub
    const newUser = new User({
      email: userEmail,
      cognitoUsername:sub,
      role:group
    });
    console.log("Saving User Data to db");
    const data = await newUser.save();
    console.log(data);
    console.log("User Data Saved Successfully");
    return res.status(200).json({
      message: "User Group Set Successfully",
      success: true
    });    
  } catch (err) {
    console.log("Internal Server error.");
    // Implement logger function (winston)
    return res.status(500).json({
      message: "Unable to set group",
      success: false
    });
  }
};



/**
 * @DESC To validate the user token and the group which it belongs to.
**/
const validateUserGroupNToken = async (token, res, checkString) => {
  try {
    console.log("Checking the current token");
    // params for autheticating a token
    
    var userDetails = jwt_decode(token);
    
    if('cognito:groups' in userDetails && userDetails['cognito:groups'][0] == checkString)
    {
      console.log("User exits in a defined group");
    } else {
      console.log("User is Unauthorised not in a group");
      return res.status(401).json({
        message: "Unauthorized User",
        success: false
      });
    }

    // defining the verifier
    var verifier;
    
    if( checkString == "userRecruiter" ){
      console.log("Setting up the recruiter claims");
      verifier = new Verifier(params, recruiterClaims);
    }
    if( checkString == "userCandidate" ){
      console.log("Setting up the candidate claims");
      verifier = new Verifier(params, candidateClaims);  
    }

    // verifying the token signature
    verifier.verify(token)
    .then(result =>{
      console.log("Cognito Call is a success");
      if(result == false)
      {
        console.log("Unauthorised access");
        return res.status(401).json({
          message: "Unauthenticated user.",
          success: false
        });  
      }
      console.log("The user is Authorised with " + userDetails['cognito:groups'][0] + " role");
      return res.status(200).json({
        message: userDetails,
        success: true
      });
    })
    .catch(err => {
      console.log("Caught in the error state");
      return res.status(401).json({
        message: "Unauthenticated user.",
        success: false
      });  
    })
  } catch (err) {
    console.log("Inside the catch block unauthorised user")
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
const checkRole = async (token,res) =>
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

/**
 * @DESC Add user to MongoDb
 */
//  const saveUserToDb = async (token,role,res) =>
//  {
//     var userDetails = jwt_decode(token);
//     var userEmail = userDetails.email;
//     var sub = userDetails.sub
//     try {
//       const newUser = new User({
//         email: userEmail,
//         cognitoUsername:sub,
//         role:role
//       });

//       const data = await newUser.save();
//       console.log(data);
//       //now we need to check the role in the user claims
//     } catch (err) {
//       // Implement logger function (winston)
//       return res.status(401).json("Unauthorized")
//     }
// }; 
 

module.exports = {
  setGroup,
  checkRole,
  validateUserGroupNToken,
  serializeUser,
  validateUser,
};


