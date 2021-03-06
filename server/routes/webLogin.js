const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('../config/config');
const mule = require('../modules/mule').getUserData;
const checkAuth = require('../lib/auth');

router.all('/weblogin/*',(req,res)=>{
    let weblogin = req.query.weblogin;
    if(!weblogin){
        res.status(400).send("bed request.");
        return;
    }
    webloginCheck(weblogin,req,res);
});

function webloginCheck (weblogin,req,res){
    const url = config.weblogin.weblogin.server + "/v0/check/" + config.weblogin.weblogin.service + "/" + weblogin;
    const options = {
        url: url,
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    };
    request.get(options,(err,res2)=>{
        if(!res2) return;
        let authdata = JSON.parse(res2.body);
        session(req,res,authdata);
    });
}

async function session(req, res, authdata) {
    let userdata = {};
    let rights = {};
    let sessionID = req.sessionID;
    let _obj = {
        "user_ldap": authdata.username,
        "env": config.env
    };

    userdata = await searchbyusername(_obj);
    rights = await getMyRights(_obj);
    let hasAuth = checkAuth.hasAuth(rights);
    req.session.is_logined = true;
    req.session.firstname = `${JSON.parse(userdata).complexdata.surname}`;
    req.session.lastname = `${JSON.parse(userdata).complexdata.givenname}`;
    req.session.env = `${userdata.env}`;
    req.session.rights = `${rights}`;
    req.session.hasAuth = hasAuth;

    req.session.save(()=>{
        if(hasAuth){
            res.redirect(`${config.weblogin.redirect.page}?user=${authdata.username}&sessionID=${sessionID}`);
        }else {
            res.status(401).send('Unauthorized');
        }
    });
}

function searchbyusername(data) {
    let userdata = {};
    let getUserdataUrl = "kontaktcenter/ldap/searchbyusername";

    userdata = mule(data,getUserdataUrl,config.env);
    return userdata;
}

function getMyRights(data) {
    let rights = {};
    let getRights = "kontaktcenteradministration/Rights_getMyRights";

    rights = mule(data,getRights,config.env);
    return rights;
}



// function checkAuth(rights){
//     if(!rights) return false;
//     if(rights.includes(config.weblogin.allowedAuth)) return true;
//     else return false;
// }


exports.router = router;



