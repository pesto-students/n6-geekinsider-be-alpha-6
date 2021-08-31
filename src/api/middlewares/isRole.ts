import jwt_decode from 'jwt-decode'

const isRole = (checkRole, req, res, next) => {
  /**
   *
   *   middlewares.isRole we will this middle ware to see the different actions
   *
   */
  try {
    var token = req.header.Authorization
    var userDetails = jwt_decode(token);    
    if(userDetails['cognito:groups'][0] == checkRole)           //console.log("User exits in a defined group");
    {
      return next();
    } else {                                                    //console.log("User is Unauthorised to perform the action");
      return res.sendStatus(401);
    }
  }
  catch (e) {
    return next(e);
  }
};


export default isRole;
