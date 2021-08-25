const router = require("express").Router();

// 1=recruiter
// 2=candidate

// Bring in the User Functions
const {
  setGroup,
  validateUser,
  validateUserGroupNToken,
  saveUserToDb
} = require("../utils/Auth");


// Set Group For a user
router.post("/set-group", async (req, res) => {
  try{
    console.log("Setting up the user role with group",req.body.groupName);
    await validateUser(req.header('authorization'),res);
    // Call the mongo API here to set the role in mongo also.
    await setGroup(req.header('authorization'),req.body.groupName,res);
  }
  catch(e)
  {
    res.status(401).json({
      message: "Unauthorized User",
      success: false
    });
  }
});

router.post("/get-recruiter-detail", async (req, res) => {
  validateUserGroupNToken(req.header('authorization'),res)
  // setRole(req.body.token,req.body.groupName,res),
});

router.post("/get-candidate-detail", async (req, res) => {
  validateUserGroupNToken(req.header('authorization'),res,"userCandidate")
  // setRole(req.body.token,req.body.groupName,res),
});
  
module.exports = router;







// router.post(
//     "/set-group",
//     // validateUserNCheckRole(req.body.token,req.body.groupName,res),
//     // setRole(req.body.token,req.body.groupName,res),
//     async (req, res) => {
//       return res.json("Hello User");
//     }
// )
// router.post("/set-group", (req, res) =>{
//   validateUser(req.header('authorization'),res),
//   setGroup(req.header('authorization'),req.body.groupName,res),
//   async (req, res) => {
//   try{
//     saveUserToDb(req.header('authorization'),req.body.groupName,res),
//     console.log("Setting up the user role with group",req.body.groupName);
//   }
//   catch(e)
//   {
//     console.log("Error Occured while setting up the user role with group",req.body.groupName);
//     res.status(401).json({
//       message: "Unauthorized User",
//       success: false
//     });
//   }
// }
// });
  // Set Group For a user
// router.post("/set-group", async (req, res) => {
//   try{
//     console.log("Setting up the user role with group",req.body.groupName);
//     await validateUser(req.header('authorization'),res);
//     await setGroup(req.header('authorization'),req.body.groupName,res);
//     await saveUserToDb(req.header('authorization'),req.body.groupName,res);
//     // Call the mongo API here to set the role in mongo also.
//   }
//   catch(e)
//   {
//     res.status(401).json({
//       message: "Unauthorized User",
//       success: false
//     });
//   }
// });
