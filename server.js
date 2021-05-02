/** 
 * @main_library 
 *    https://github.com/suufi/noblox.js/tree/master
 * 
 * @author H_mzah
 *    https://github.com/Hamzah-z
 * 
 * Special thanks to sentanos/Froast for making roblox-js-server. This is heavily inspired from it.
 *    https://github.com/sentanos
 *    https://github.com/sentanos/roblox-js
 * 
*/

// Libraries

let roblox = require("noblox.js");
let express = require("express");
let BodyParser = require("body-parser");

// Configs

let config = require("./config.json"); // Stores configurations, such as login cookie

// Modules

let Utility = require("./utility/functions.js"); // Module containing utility functions

// Express Initialization

let app = express();
let port = process.env.PORT || 8080;

app.set("env", "production");
app.use(BodyParser.json()); // Helpful for parsing the body into JSON
app.use(Utility.Authenticate); // Authenticate all requests for the correct auth_key

// Main

// Validate all Promotions/Demotions
const { Payout, Validate } = require('./utility/validator.js')

app.post("/Payout", Payout(), Validate, function (req, res, next) {
    // At this point the request has been authenticated and body contents are validated.

    let Group = req.body.Group
    let Target = req.body.Target
    let Robux = req.body.Robux

    Utility.SendPayout(res, Group, Target, Robux)
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(`Internal server error: ${err}`);
});

async function login() {
    await roblox.setCookie(config.user_cookie); // thanks for ruining logins roblox
    return await roblox.getCurrentUser();
}

login()
    .then(current_user => {
        console.log(current_user); // Log information about the current user
        app.listen(port, function () {
            console.log(`Listening at http://localhost:${port}`);
        });
    })
    .catch(err => {
        let errorApp = express();
        errorApp.get("/*", function (req, res, next) {
            res.json({ error: "Server configuration error: " + err });
        });
        errorApp.listen(port, function () {
            console.log("Error running server: " + err);
        });
    });
