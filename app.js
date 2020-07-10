/************* Require needed modules and initialize Express app *************/
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');



/******************************* App variables *******************************/
const app = express();
let loggedIn = false;
let myFiles = []



/******************************** Using  CORS ********************************/
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));



/***************************** Express API calls *****************************/
// LOGIN
app.route('/login')
.get((req, res, next) => {
    if(loggedIn) {
        res.set({'Content-Type': 'application/json'})
        res.status(200).json({"status" : 1, "message" : "Signed in"})
    } else {
        res.set({'Content-Type': 'application/json'})
        res.status(401).json({"status" :-1, "message" : "Signed out"})
    }
})
.post((req, res, next) => {
	if(req.body.username=="admin") {
		if(req.body.password=="root") {
            res.set({'Content-Type': 'application/json'})
			res.status(200).json({"status" : 1, "message" : "Welcome bro!"})
			console.log("User logged in")
			loggedIn = true;
		} else {
            res.set({'Content-Type': 'application/json'})
			res.status(200).json({"status" : -1, "message" : "Incorrect Password!"})
			console.log("Incorrect Password : " + req.body.password)
		}
	} else {
		res.set({'Content-Type': 'application/json'})
		res.status(200).json({"status" : -1, "message" : "User not found!"})
		console.log("User not found : " + req.body.username)
	}
})
.put((req, res, next) => {
    if(loggedIn) {
        loggedIn = false
        res.set({'Content-Type': 'application/json'})
        res.status(200).json({"status" :-1, "message" : "Signed out"})
    }
})
// FILES
app.route('/files')
.get((req, res, next) => {
    if(!loggedIn) {
        res.set({'Content-Type': 'application/json'})
        res.status(401).json({"status" : -1, "message" : "Invalid User"})
        return
    }

    myFiles = []
	const directoryPath = path.join(__dirname, 'files/admin');
	fs.readdir(directoryPath, function (err, files) {
		if (err) { return console.log('Unable to scan directory: ' + err); }

		files.forEach(function (file) {
			myFiles.push(file);
		});

		res.set({'Content-Type': 'application/json'})
		res.status(200).json(myFiles);
	});
})
.post((req, res, next) => {
    if(!loggedIn) {
        res.set({'Content-Type': 'text/plain'})
        res.status(401).json("Invalid User")
        return
    }

    fs.writeFile("./files/admin/"+req.body.fileName, req.body.fileCont, (err)=>{
        if( err ) {
            throw err
        } else {
            res.set({'Content-Type': 'text/plain'})
            if(myFiles.indexOf(req.body.fileName) > -1) {
                res.status(200).json(req.body.fileName + " saved successfully!")
                console.log(req.body.fileName + " saved successfully!")
            } else {
                myFiles.push(req.body.fileName);
                res.status(201).send("File created successfully!");
                console.log(req.body.fileName + " created!")
            }
        }
    });

})
.put((req, res, next) => {
    if(!loggedIn) {
        res.set({'Content-Type': 'application/json'})
        res.status(401).json({"status" : -1, "message" : "Invalid User"})
        return
    }

    if(req.get('x-action')=="open") {
        fs.readFile("./files/admin/"+req.body.fileName, "utf-8", (err, data)=>{
            if(data==undefined) {
                res.set({'Content-Type': 'application/json'})
                res.status(404).send({"status":-1, "message":"File not found!"});
                console.log(req.body.fileName + " not found!")
            } else {
                res.set({'Content-Type': 'text/plain'})
                res.status(200).send(data);
                console.log(req.body.fileName + " opened!")
            }
        })
    } else if(req.get('x-action')=="rename") {
        if(myFiles.indexOf(req.body.to) > -1) {
            res.set({'Content-Type': 'application/json'})
            res.status(403).json({"status" : -1, "message" : req.body.to + " already exists!"})
            console.log(req.body.to + " already exists!")
        } else {
            fs.rename("./files/admin/"+req.body.frm, "./files/admin/"+req.body.to, (err) => {
                if(err) {
                    if(err.code=="ENOENT") {
                        res.set({'Content-Type': 'application/json'})
                        res.status(404).json({"status" : -1, "message" : req.body.frm + " not found!"})
                        console.log(req.body.frm + " not found!")
                    } else {
                        res.set({'Content-Type': 'application/json'})
                        res.status(400).send({"status" : -1, "message" : err});
                        console.log(JSON.stringify(err))
                    }
                    return
                }
                res.set({'Content-Type': 'application/json'})
                res.status(200).json({"status" : 1, "message" : "File renamed successfully!"})
                console.log(req.body.frm + " renamed to " + req.body.to)
            });
        }
    }

})
.delete((req, res, next) => {
    if(!loggedIn) {
        res.set({'Content-Type': 'text/plain'})
        res.status(401).json("Invalid User")
        return
    }

    fs.unlink("./files/admin/"+req.body.fileName, (err)=>{
        if( err ) {
            if(err.code=="ENOENT") {
                res.set({'Content-Type': 'text/plain'})
                res.status(404).send(req.body.fileName + " does not exist!");
                console.log(req.body.fileName + " does not exist!")
            } else {
                res.set({'Content-Type': 'text/plain'})
                res.status(400).send(err);
                console.log(JSON.stringify(err))
            }
            return
        } else {
            res.set({'Content-Type': 'text/plain'})
            res.status(200).send("File deleted successfully!");
            console.log(req.body.fileName + " deleted!")
        }
    })
});



/****************************** Express ROUTING ******************************/
// HOME PAGE
app.get('/', (req, res, next) => {
	res.sendFile(`${__dirname}/login.html`)
})
// MyFileManager
app.get('/app', (req, res, next) => {
	res.sendFile(`${__dirname}/app.html`)
})
// static
app.use('/static', express.static(`${__dirname}/static`));
// Error 404
app.get("*", function(req, res){
	res.status(404).send("<h1>ERROR 404</h1>\n<p>File not found</p>");
});
// Error 500
app.use(function(err, req, res, next) {
   console.error(err.stack);
   res.status(500).send("<h1>ERROR 500</h1>\n<p>Internal Server Error</p>");
});



/************************ Deploying to express server ************************/
const hostname = 'faisal.com';
const PORT = 6969;
app.listen(PORT, hostname, () => console.log(`Server running at http://${hostname}:${PORT}/`));
