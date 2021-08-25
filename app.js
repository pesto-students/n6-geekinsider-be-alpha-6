const cors = require("cors");
const exp = require("express");
const bp = require("body-parser");
const mongoose = require('mongoose');
const { success, error } = require("consola");

// Bring in the app constants
const { APP_PORT, MONGO_URI } = require("./config");

// Initialize the application
const app = exp();

// Middlewares
app.use(cors());
app.use(bp.json());

// User Router Middleware
app.use("/api/users", require("./routes/users"));

// Start the app
const startApp = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    });

    success({
      message: `Successfully connected with the Database`,
      badge: true
    });

    // Start Listenting for the server on PORT
    app.listen(APP_PORT, () =>
      success({ message: `Server started on PORT ${APP_PORT}`, badge: true })
    );

  } catch (err) 
  {
    error({
      message: `Unable to connect with Database \n${err}`,
      badge: true
    });
    startApp();
  }
};

startApp();



// const jwt_decode = require('jwt-decode');

// test for valid token util

// var token = "eyJraWQiOiJwSlNzRENGaVczQUxMMUt0bnFjVGlBb2xUZUdDV1Q4N1dPSGFvSTdIV3FBPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI5YjRkNjE3NS05NmM5LTRhZWMtOWU0ZS0xNThkZTI1YWNkMmEiLCJjb2duaXRvOmdyb3VwcyI6WyJ1c2VyQ2FuZGlkYXRlIl0sImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJjb2duaXRvOnByZWZlcnJlZF9yb2xlIjoiYXJuOmF3czppYW06OjMxNzUzMTAxMjg4MTpyb2xlXC91cy1lYXN0LTFfZmlEbWpsNWhQLXVzZXJDYW5kaWRhdGVHcm91cFJvbGUiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9maURtamw1aFAiLCJjb2duaXRvOnVzZXJuYW1lIjoiOWI0ZDYxNzUtOTZjOS00YWVjLTllNGUtMTU4ZGUyNWFjZDJhIiwib3JpZ2luX2p0aSI6ImI4ZWM5NzY2LTk5MGMtNDQ2Mi05MGQyLTYyZjcyNDBiNmYzZiIsImNvZ25pdG86cm9sZXMiOlsiYXJuOmF3czppYW06OjMxNzUzMTAxMjg4MTpyb2xlXC91cy1lYXN0LTFfZmlEbWpsNWhQLXVzZXJDYW5kaWRhdGVHcm91cFJvbGUiXSwiYXVkIjoiNTFyMGoyb2oxbWJpMTR0OTFlaGQ3NTVoZ3QiLCJldmVudF9pZCI6ImIzMmQxZjBjLWE1OGItNDA0MS1iMjYwLTljNWFiNjRhZTY5OCIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjI5ODM1MTAyLCJleHAiOjE2Mjk4Mzg3MDIsImlhdCI6MTYyOTgzNTEwMiwianRpIjoiOGNkZDkzMzAtZjVkNy00NWYyLWI0M2MtZjhhM2Q1YmYwMmI0IiwiZW1haWwiOiJ2aXNoYWwua2tAc29tYWl5YS5lZHUifQ.OVZcwSuHyIWJtNeDdUnonWE9YKTcEURWSIb0Z9B1i0srsD9yiTBLioB2D_5Artsh8wdTwoSjDHD5gM5P48aGfsNNLE_30_jCxxckm3RqJDmlnx7qhv5DQZJMT-grwSchTsqCAyoMkuLxgSXb5j34FRA8tTfdSbnclUTYTyMczpTbQVqehELif4uwjg3wNah09wFdqRLBAwKwBVPZ1WlV6YCgi6QKgLOzLVANqEb9rNM5zr3t_1lwkJd5MmZoot0Rm8kVUQw1R7AIA-8VHIePUb_vH1MLfQSI4xUKvH7YCPov0xFa_tcffkzz9JqUD6R8zwMQiRkRTx7k5sEfYN2YYQ"; // add your token in here;

// var userDetails = jwt_decode(token);
// console.log(userDetails)

// Bring in the User Functions
// const {
//   setGroup,
//   validateUser,
//   validateUserGroupNToken,
//   saveUserToDb
// } = require("./utils/Auth");

// var res;
// saveUserToDb(token,'userCandidate', res);

// async function abc(){
//   // validateUser(token, res);
//   console.log(validateUserGroupNToken(token, res));
// }
// validateUserGroupNToken(token, res, "userCandidate")

// abc()
