import jwt_decode from 'jwt-decode'

const submitRecruiter = (req, res, next, token) => {
  /**
   * @TODO Edge and Internet Explorer do some weird things with the headers
   * So I believe that this should handle more 'edge' cases ;)
   */
  try {
    var userDetails = jwt_decode(req.header.Authorization);
    
    if(userDetails['cognito:groups'][0] == "userRecruiter")
    {
      //console.log("User exits in a defined group");
      return next();
    } else {
      //console.log("User is Unauthorised to perform the action");
      return res.sendStatus(401);
    }
  }
  catch (e) {
    return next(e);
  }
};


export default submitRecruiter;
