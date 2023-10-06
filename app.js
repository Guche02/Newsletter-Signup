const express = require("express")
const body = require("body-parser")
const https = require('https')
require("dotenv").config();

console.log(process.env.API_KEY)
console.log(process.env.LIST_ID)


const app = express();
app.use(body.urlencoded({ extended: true }))

//To display the css files and the images while sending the response we need to place them in a separate folder called public.
app.use(express.static("public"))

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/signup.html")
})

app.post('/', function (req, res) {
    const firstname = req.body.fname
    const lastname = req.body.lname
    const email = req.body.email

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields:
                {
                    FNAME: firstname,
                    LNAME: lastname
                }

            }
        ]
    };

    const jsonData = JSON.stringify(data)

   const API_key = process.env.API_KEY
   console.log(API_key)
   const url = process.env.LIST_ID

    const options = {
        method: "POST",
        auth: process.env.API_KEY
    }

    const request = https.request(url, options, function (response) {

        //Checks if the data is added is not.
        if(response.statusCode == 200)
        {
            res.sendFile(__dirname + "/success.html")
        }
        else 
        {
            res.sendFile(__dirname + "/failure.html")
        }

        response.on("data", function (data) {
            console.log(JSON.parse(data))
        })
    })

    request.write(jsonData);
    request.end();  

    //To redirect it to the home route.
    app.post("/failure", function(req,res)
    {
        res.redirect("/")
    })

})

app.listen(3000, function () {
    console.log("Server listening on port 3000")
})

