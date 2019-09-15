var firebase = require('firebase').initializeApp({
    serviceAccount: "./ChatBox-728bb1a30fb6.json",
    databaseURL: "https://chatbox-ce822.firebaseio.com"
});
const express = require('express')
const bodyParser = require('body-parser');

const app = express()
const port = 3000
app.use(bodyParser.json());

app.get('/', (req, res) => res.send("Hello User"))
app.listen(port, () => console.log(`Example app listening on port port!`))
var ref = firebase.database().ref().child('user_master');
var Messageref = firebase.database().ref().child('message_master');

app.get('/user', (req, res) => {


    ref.once("value").then(
        abc => {
            if (abc.val === null) {
                res.send({ "result": false, "message": "No data found" });
            }
            else {
                var d = abc.val();
                const token = Object.values(abc.val());
                console.log(token);
                var op = "<table border=2><tr><th>Sr No</th><th>User_Contact</th><th>User_Id</th><th>User_Name</th><th>User_Token</th>";
                for (i = 0; i < token.length; i++) {
                    op += "<tr><td> " + i + "</td><td> " + token[i]['user_contact'] + "</td><td>" + token[i]['user_id'] + "</td><td> " + token[i]['user_name'] + "</td><td> " + token[i]['user_token'].toString().substring(0, 20) + "</td></tr>";
                }
                op += "</table" >
                  //  res.send(op);
                 res.send({ "message": "successfully fetch data", "result": true, "data": abc.val() });
            }

        }
    )

});
app.get('/userSpec/:userId', (req, res) => {


    ref.orderByChild('user_id').equalTo(req.params.userId).once("value").then(
        abc => {
            if (abc.val() === null) {
                res.send({ "result": false, "message": "No data found" });
            }
            else {
                var d = abc.val();
                const token = Object.values(abc.val());
                // var userName = token[0];
                // var s = token[0].values; 
                // var a = Object.values(token.values);
                // console.log(a);

                var op = "<table border=5><tr><th>User_Contact</th><th>User_Id</th><th>User_Name</th><th>User_Token</th></tr><tr><td> " + token[0]['user_contact'] + "</td><th>" + token[0]['user_id'] + "</th><th> " + token[0]['user_name'] + "</th><th> " + token[0]['user_token'] + "</th></tr>";
                res.send(op);
                //  res.send({ "message": "successfully fetch data", "result": true, "data": abc.val() });
            }
        }
    )

});

app.post('/createUser', function (req, res) {
    var data = req.body;
    ref.push(data, function (err) {
        if (err) {
            res.send(err);
        }
        else {
            res.send({ message: "Success: User Saved.", result: true });
        }
    })

})

app.get("/userdelete/:userId", async (req, res) => {
    ref.orderByChild('user_id').equalTo(req.params.userId).once("value").then(
        userData => {
            if (userData.val() === null) {
                res.send({ "result": false, "message": "No data found" });
            }
            else {
                const userkey = Object.keys(userData.val());
                const userInside = Object.values(userData.val());
                console.log(userkey);

                ref.child(userkey[0]).remove(
                    function (error) {
                        if (!error) {

                            res.send({ "result": true, "message": "Your user deleted successfully" });
                        }
                        else {
                            res.send(error);
                        }
                    }
                );
            }
        }
    )
});
 

app.get('/userMsg',async (req,res)=>
{
    Messageref.once("value").then(
        data => {
            if (data.val === null) {
                res.send({ "result": false, "message": "No data found" });
            }
            else {
                var message = data.val();
                var keys = Object.keys(message);
                console.log(keys);
                for(var i=0;i<keys.length;i++)
                {
                    var k = keys[i];
                    var message_text = message[k].message_text;
                    var message_date = message[k].message_date;
                    console.log(message_text ,message_date);
                    
                }
                const token = Object.values(data.val());
                 
                var op = "<html><head><title>Message</title></head><body><div> <h1>User Message</h1></div><table border=2><tr><th>Sr No</th><th>Message_text</th> <th>Sender_id</th><th>Receiver_id</th><th>Message Date</th>";
                for (i = 0; i < token.length; i++) {
                    op += "<tr><td> " + i + "</td><td> " + token[i]['message_text'] + "</td><td>" + token[i]['sender_id'] + "</td><td> " + token[i]['receiver_id'] + "</td><td> " + token[i]['message_date'].toString().substring(0, 20) + "</td></tr>";
                }
                op += "</table></body></html>" >
                    res.send(op);
                  //res.send({ "message": "successfully fetch data", "result": true, "data": message.val() });
            }

        }
    )

})