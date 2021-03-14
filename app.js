const path = require("path"),
    express = require("express"),
    dictionary = require('./modules/dictionary.js');

const app = express();
const fs = require('fs');

app.use(express.static('public'));

app.get("/", function(req, res) {
    const word = req.query.define,
        language = req.query.lang || 'en';

    global.API_VERSION = (req.query.v && Number(req.query.v)) || 1;

    if (!word) {
        return res.sendFile(path.join(__dirname + '/views/index.html'));
    }

    return dictionary.findDefinitions(word, language, (err, definitions) => {
        if (err) { return handleError(req, res, err); }

        res.header("Content-Type", 'application/json');
        res.header("Access-Control-Allow-Origin", "*");

        var wrd = "";
        var mean = "";
        console.log(definitions);
        if(definitions.length>0){
       	    wrd = definitions[0].word;
   			wrd = wrd[0].toUpperCase() + wrd.slice(1);

            var ans = Object.keys(definitions[0].meaning)[0];
            if(ans != undefined)
                mean = definitions[0].meaning[ans][0].definition;

          //   if((typeof definitions[0].meaning.noun != "undefined") && (definitions[0].meaning.noun.length>0)){
	        	// mean =  definitions[0].meaning.noun[0].definition;

            console.log("Ans = " + ans);
            console.log("Word = " + wrd);
	        console.log("Meaning = " + mean);
	        if(mean != "")
            {
                var wrt = "*" + wrd + "* -> " + mean + '\n';

                fs.appendFileSync('C:/Users/Naman Mittal/Desktop/Vocab.txt', wrt);
                res.send(wrt + '\n\n' + ans);                
            }
            else
                res.send("No definition found! Sorry");
        }
    });
});

function handleError (req, res, err) {
    let { statusCode } = err;

    res.header("Access-Control-Allow-Origin", "*");

    return res.sendFile(path.join(__dirname + '/views/index.html'));			
}

app.listen(8080, process.env.IP, function() {
    console.info("I am listening...");
});
