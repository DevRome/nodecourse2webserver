const express = require("express");
const hbs = require("hbs");
const fs = require("fs");

var app = express(); //making a new express app - this is done by setting the var app to the return result from calling express as a function

hbs.registerPartials(__dirname + "/views/partials");
app.set("view engine", "hbs"); // helps us set express related configurations
//params are a key-value pair - key = things you wanna set, value = thing you wanna use

app.use(express.static(__dirname + "/public")); //app.use takes whatever middleware function you want to use
//.static() takes the absolte path to the folder you want to serve up

// creating a logger that will log all requests that come to the server
app.use((req, res, next) => {
  //next is used to tell express when your middleware function is done

  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFileSync("server.log", log + '\n', err => {
    if (err) {
      console.log("Unable to append server.log.");
    }
  });
  next();
});

app.get("/", (req, res) => {
  /*setting up a handler for an http get request
                 * two args go into get, the url. we use '/' because we are just looking for the root of the app
                 * second argument is the function to run... it tells express what to send back to the person who made the request
                 *  the function takes two arguments - they are rly important to how express works
                 * the two args are request and response  -
                 * req- takes the headers that were used, body information, method that was made with the request, the path, etc.
                 * res - has a bunc of methods available to the programmer.
                 * you can response to the http request in basically whatever way you'd like
                */
  hbs.registerHelper("getCurrentYear", () => {
    return new Date().getFullYear();
  });

  res.render("home.hbs", {
    pageTitle: "Home Page",
    welcomeMessage: "welcome to my website"
    // currentYear: new Date().getFullYear()
  }); // end render for home page
  // res.send('<h1>Hello Express!</h1>');

  // res.send({ //sending JSON data with express
  //    name: 'Andrew',
  //    likes: [
  //      'biking',
  //      'cats'
  //    ]
  // }); //end send
}); //end get for root route

app.get("/about", (req, res) => {
  //we can use .get to set up more routs. The '/' route at the top is known as the "root route"
  res.render("about.hbs", {
    pageTitle: "About Page"
    // currentYear: new Date().getFullYear()
  });
});

// /bad route
app.get("/bad", (req, res) => {
  res.send({
    errorMessage: "Unable to handle request"
  });
});

// app.listen(3000); //LISTENS TO REQUESTS UNTIL YOU TELL IT TO STOP
app.listen(3000, () => {
  console.log("Server is up on port 3000");
}); //app.listen can take a second, option parameter
/* the 2nd param is a function
              * In our case, we're printing a message once the server comes up
              */
