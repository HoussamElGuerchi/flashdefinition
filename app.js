
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const port = 3000;

app.get("/", (req,res) => {
    res.sendFile(__dirname + "/dictionary.html");
})

app.get("/result", (req, res) => {
    res.sendFile(__dirname + "/result.html");
})

app.get("/translation", (req,res) => {
    res.sendFile(__dirname + "/translation.html");
})

app.post("/", (req, res) => {
    var word = req.body.word;
    var app_id = "2a075984";
    var app_key = "c916a87046202608cdf25533da206494";

    var option = {
        url: "https://od-api.oxforddictionaries.com/api/v2/entries/en-us/"+word.toLowerCase(),
        method: "GET",
        headers: {
            "app_id": app_id,
            "app_key": app_key
        }
    }

    request(option, (error,response,body) => {
        var jsonData = body;
        var data = JSON.parse(jsonData);

        var lexicalCategory = data.results[0].lexicalEntries[0].lexicalCategory.text;
        var pronunciation = data.results[0].lexicalEntries[0].pronunciations[0].phoneticSpelling;
        var senses = data.results[0].lexicalEntries[0].entries[0].senses;

        var length = senses.length;

        res.write("<p>Meaning of <em>" + word + "</em> in Oxford English dictionary</p><hr>");
        res.write("<h2>"+word+"</h2>");
        res.write("<ul><li>" + lexicalCategory + "</li><li>pronunciation: " + pronunciation + "</li></ul><hr>");
        
        for(var i=0; i<length; i++) {
            var definition = senses[i].definitions[0];
            res.write("<p>" + definition + ".</p><hr>");
        }

        res.send();
    })
})

app.listen(port, () => {
    console.log("Start server on port "+port);
})