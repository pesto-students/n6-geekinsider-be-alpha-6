const cors = require("cors");
const exp = require("express");
const bp = require("body-parser");
const mongoose = require('mongoose');
const { success, error } = require("consola");

const {
  setGroup,
} = require("./utils/Auth");


// Bring in the app constants
const { APP_PORT, MONGO_URI } = require("./config");

// Initialize the application
const app = exp();

// Middlewares
app.use(cors());
app.use(bp.json());

// User Router Middleware
app.use("/api/users", require("./routes/users"));

var token = "eyJraWQiOiJwSlNzRENGaVczQUxMMUt0bnFjVGlBb2xUZUdDV1Q4N1dPSGFvSTdIV3FBPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI5YjRkNjE3NS05NmM5LTRhZWMtOWU0ZS0xNThkZTI1YWNkMmEiLCJjb2duaXRvOmdyb3VwcyI6WyJ1c2VyQ2FuZGlkYXRlIl0sImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJjb2duaXRvOnByZWZlcnJlZF9yb2xlIjoiYXJuOmF3czppYW06OjMxNzUzMTAxMjg4MTpyb2xlXC91cy1lYXN0LTFfZmlEbWpsNWhQLXVzZXJDYW5kaWRhdGVHcm91cFJvbGUiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9maURtamw1aFAiLCJjb2duaXRvOnVzZXJuYW1lIjoiOWI0ZDYxNzUtOTZjOS00YWVjLTllNGUtMTU4ZGUyNWFjZDJhIiwib3JpZ2luX2p0aSI6IjJhYWM3NjZkLWU3MzEtNGQ0YS1iOGMyLTI3MDVlYjRmN2JhYiIsImNvZ25pdG86cm9sZXMiOlsiYXJuOmF3czppYW06OjMxNzUzMTAxMjg4MTpyb2xlXC91cy1lYXN0LTFfZmlEbWpsNWhQLXVzZXJDYW5kaWRhdGVHcm91cFJvbGUiXSwiYXVkIjoiNTFyMGoyb2oxbWJpMTR0OTFlaGQ3NTVoZ3QiLCJldmVudF9pZCI6ImJiZDNmM2IyLTM3NWMtNDQ5ZC04N2IyLWYxODViNTUzNGVlZCIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjI5Nzc3MDE0LCJleHAiOjE2Mjk3ODA2MTQsImlhdCI6MTYyOTc3NzAxNCwianRpIjoiYjUxZWI5NDctYWQ0Ni00MzMzLWI3ZWYtMGUzNjNjMjg1NWQ5IiwiZW1haWwiOiJ2aXNoYWwua2tAc29tYWl5YS5lZHUifQ.t_ln-IDTCVAslp3pmz3Rydd4D47phvU_AU5wYXpugxVUo8eOjNaSfUP73DTD_5wzFfzzt9FFuAtGlWOKK0ERTdgCPQQ5LdyC3MCJxPpN5IwgCK_lYsl2NDRWxIVnYLWjw51Xnjt0ZpIYZrgMlsiXUibrUQXatEv-UOoZbEqlIjGFRy08yWQVFhCu5gUw5Xha7C_0d-MCx4Ltkag8wV9fNRO7jzCUnmmyewUKJ7QeD3VsL2LDrKKW_DZnY4wqgDVMb1h477eYM0V-SpiJdmD6FP5kBDq8zGE31mVHcMOYCWUZ9av8K09KZBu9SunKsTrPE5O9nU5EuHFXdX5XXXCqBw"; // add your token in here;

var res;
setGroup(token,'userCandidate',res)


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
