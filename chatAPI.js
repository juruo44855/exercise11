const http = require('http');
const url = require('url');
const fs = require('fs');
//mongodb+srv://exercise11:11@cluster0.iizzcyf.mongodb.net/?retryWrites=true&w=majority
const uri="mongodb+srv://exercise11:11@cluster0.iizzcyf.mongodb.net/?retryWrites=true&w=majority"
//const mongoose=require("mongoose");
//mongoose.set('strictQuery', true);
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

//const db = '';
const chatRecords = [];

//const uri = "mongodb://127.0.0.1:27017";
const dbName = 'exercise11'


var express = require("express");
var app = express();



app.get("/", function (req, res) {
    //console.log("hello");
    fs.readFile('index.html', function (err, data) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        return res.end();
    });
});
app.get("/chat", function (req, res) {
    //console.log("hello");
    let q = url.parse(req.url, true).query;
    let user = q.user;
    let say = q.say;
    let time = new Date().toLocaleString();
    if (user) {
        let chatObj = { user: user, say: say, time: time };
        chatRecords.push(chatObj);
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    console.log(JSON.stringify(chatRecords));
    res.end(JSON.stringify(chatRecords));
});
app.get("/chat/clear", function (req, res) {
    while (chatRecords.length > 0) {
        chatRecords.pop();
    }
    res.end();
});
app.get("/chat/save", function (req, res) {
    //console.log("hellosave");
    console.log(JSON.stringify(chatRecords));
    MongoClient.connect(uri, function (err, db) {
        if (err) throw err;
        const dbo = db.db(dbName);
        dbo.collection("chat").insert(chatRecords, function (err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });
    });

    //db.collection.save(JSON.stringify(chatRecords));
    res.end();
    console.log(chatRecords);
});
app.get("/chat/reload", function (req, res) {
    //console.log("helloreload");
    res.writeHead(200, { 'Content-Type': 'application/json' });
    //let recordPromise = '';
    MongoClient.connect(uri, function (err, db) {
        if (err) throw err;
        const dbo = db.db(dbName);
        dbo.collection("chat").find({}).toArray(function (err, result) {
            if (err) throw err;
            console.log("show");
            var recordPromise = result;
            for(i=0;i<result.length;i++){
                chatRecords.push(result[i]);
            }
            //console.log(result);
            //console.log(chatRecords);
            db.close();
        });
    
        res.end(JSON.stringify(chatRecords));
    });

    console.log(chatRecords);

});


//=============啟動==============================
app.listen(3000, function () {
    console.log("伺服器已啟動在 port 3000");

});
