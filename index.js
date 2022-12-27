const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res){
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };
  const jsonData = JSON.stringify(data);
// use your own list id here
  const url = "https://us21.api.mailchimp.com/3.0/lists/ae302cxxxx";
  const options = {
    method: "POST",
  // use your own api key here
    auth: "evil:xxxxdacc789aafa6def4433f3xxxx-us21" 
  }

  const request = https.request(url, options, function(response){
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    })
  });
    request.write(jsonData);
    request.end();
});

  app.listen(process.env.PORT || 80, function(){
  console.log("Server is running on port 80.");
});

