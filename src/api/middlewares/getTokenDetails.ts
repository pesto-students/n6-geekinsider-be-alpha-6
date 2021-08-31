import jwt_decode from 'jwt-decode'

const getTokenDetails = req => {
    /**
     * @TODO the token info of a user
     * So I believe that this should handle more 'edge' cases ;)
     */
    if (
      req.headers.authorization != null
    ) {
      return jwt_decode(req.headers.authorization);
    }
    return null;
  };

export default getTokenDetails;