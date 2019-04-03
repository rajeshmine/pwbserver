var mysql = require('mysql');
var express = require('express');
var app = express();
var http = require('http');
var url = require('url');
var request = require('request');
var nodemailer = require('nodemailer');
var mergeJSON = require("merge-json");
var fileUpload = require('express-fileupload');
var path = require('path');
var bodyParser = require('body-parser');
const utf8 = require('utf8');

var con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'pwb',
	connectionLimit: 100,
	acquireTimeout: 15000
});

app.listen(5000);
console.log("Server Listen 5000");
con.connect(function (err) {
	if (err) {
		throw err;
		return;
	} else {
		console.log("Connection Established.");
	}
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});

app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'aswinnsh@gmail.com',
		pass: 'aswin3009'
	}
});

app.get("/pwblogin", function (req, res) {
	var email = req.query.email;
	var password = req.query.password;
	password = Buffer.from(password).toString('base64');
	con.query("SELECT * FROM `login` WHERE `email`='" + email + "'  AND `password`='" + password + "' AND `status`='Y'", function (err, result) {
		if (err) {
			res.json({ StatusCode: 503, Description: err });
			res.end();
		}
		else if (result.length > 0) {
			res.json({ "StatusCode": 200, "Message": "Login Successfully!!!", "Response": result });
			res.end();
		} else {
			res.json({ "StatusCode": 400, "Message": "Username or Password Doesn't match." });
			res.end();
		}
	});
});

app.post("/pwbregister", function (req, res) {
	var name = req.query.name;
	var id = req.query.id;
	if (req.query.id === '') {
		id = Buffer.from(name, 'utf8').toString('hex');
	}
	var profile = req.query.profile || '';
	var email = req.query.email;
	var accounttype = req.query.accounttype;
	var password = req.query.password;
	password = Buffer.from(password).toString('base64');
	con.query("SELECT * FROM `login` WHERE `email`='" + email + "'", function (err, result) {
		if (err) {
			res.json({ StatusCode: 503, Description: err });
			res.end();
		} else if (result.length === 0) {
			con.query("INSERT INTO `login`(`id`, `name`, `email`, `profile`, `accounttype`, `password`) VALUES ('" + id + "', '" + name + "', '" + email + "', '" + profile + "', '" + accounttype + "', '" + password + "')", function (err, result) {
				if (err) {
					res.json({ StatusCode: 503, Description: err });
					res.end();
				}
				else if (result.affectedRows > 0) {
					res.json({ "StatusCode": 200, "Message": "Successfully Registered!!!", "Response": result });
					res.end();
				} else {
					res.json({ "StatusCode": 400, "Message": "Failed to Register. Try Again!" });
					res.end();
				}
			});
		} else {
			res.json({ "StatusCode": 409, "Message": "Email Already Exists. Try Another Details." });
			res.end();
		}
	});
});

app.post("/pwbwebsitedata", function (req, res) {
	var email = req.query.email;
	con.query("SELECT * FROM `websitedata` WHERE `email`='" + email + "'  GROUP BY `websitename`", function (err, result) {
		if (err) {
			res.json({ StatusCode: 503, Description: err });
			res.end();
		}
		else if (result.length > 0) {
			res.json({ "StatusCode": 200, "Message": "Website Data Found!!!", "Response": result });
			res.end();
		} else {
			res.json({ "StatusCode": 400, "Message": "Website Data Not Found!!!" });
			res.end();
		}
	});
});

app.post("/pwbwebsitedatapagename", function (req, res) {
	var email = req.query.email;
	var websitename = req.query.websitename;
	con.query("SELECT * FROM `websitedata`  WHERE `email`='" + email + "' AND `websitename`= '" + websitename + "'", function (err, result) {
		if (err) {
			res.json({ StatusCode: 503, Description: err });
			res.end();
		}
		else if (result.length > 0) {
			res.json({ "StatusCode": 200, "Message": "Website Data Found!!!", "Response": result });
			res.end();
		} else {
			res.json({ "StatusCode": 400, "Message": "SELECT * FROM `websitedata`  WHERE `email`='" + email + "' AND `websitename`= '" + websitename + "'" });
			res.end();
		}
	});
});

app.post("/pwbwebsitedatabywebname", function (req, res) {
	var email = req.query.email;
	var websitename = req.query.websitename;
	var pagename = req.query.pagename;
	con.query("SELECT * FROM `websitedata` WHERE `email`='" + email + "' AND `websitename`= '" + websitename + "' AND `pagename`= '" + pagename + "'", function (err, result) {
		if (err) {
			res.json({ StatusCode: 503, Description: err });
			res.end();
		}
		else if (result.length > 0) {
			res.json({ "StatusCode": 200, "Message": "Website Data Found!!!", "Response": result });
			res.end();
		} else {
			res.json({ "StatusCode": 400, "Message": "Website Data Not Found!!!" });
			res.end();
		}
	});
});

app.post('/pwbtemplateinsert', (req, res) => {
	let html = req.body.html;
	let pagename = req.query.pagename;
	let templatename = req.query.templatename;
	let image = req.files.image;
	html = escape(html);
	let temp = new Buffer(image.data);
	con.query("SELECT * FROM `template` WHERE `templatename`='" + templatename + "' AND `pagename`='" + pagename + "'", function (err, result) {
		if (err) {

			res.json({ StatusCode: 503, Description: err });
			res.end();
		}
		else if (result.length > 0) {
			res.json({ "StatusCode": 400, "Message": "Template Details Already Available!!!", "Response": result });
			res.end();
		} else {
			con.query("INSERT INTO `template` SET `templatename` = '" + templatename + "' , `pagename` = '" + pagename + "', `html` = '" + html + "', `image` = ? ", temp, (err, result) => {
				if (err) {
					res.json({ StatusCode: 503, Description: err, result: html });
				} else {
					if (result.affectedRows > 0) {
						res.json({ "StatusCode": 200, "Message": "Success", "Response": result });
						res.end();
					} else {
						res.json({ "StatusCode": 400, "Message": "Failed", "Response": result });
						res.end();
					}
				}
			});
		}
	});
});

app.post("/pwbtemplatedata", function (req, res) {
	var templatename = req.query.templatename;
	if (templatename === '') {
		con.query("SELECT * FROM `template` WHERE `status`='Y'", function (err, result) {
			if (err) {
				res.json({ StatusCode: 503, Description: err });
				res.end();
			}
			else if (result.length > 0) {

				res.json({ "StatusCode": 200, "Message": "Website Data Found!!!", "Response": result });
				res.end();
			} else {
				res.json({ "StatusCode": 400, "Message": "Website Data Not Found!!!" });
				res.end();
			}
		});
	} else {
		con.query("SELECT * FROM `template` WHERE `templatename`='" + templatename + "' AND `status`='Y'", function (err, result) {
			if (err) {
				res.json({ StatusCode: 503, Description: err });
				res.end();
			}
			else if (result.length > 0) {
				res.json({ "StatusCode": 200, "Message": "Website Data Found!!!", "Response": result });
				res.end();
			} else {
				res.json({ "StatusCode": 400, "Message": "Website Data Not Found!!!" });
				res.end();
			}
		});
	}
});

app.post('/websitedatainsert', function (req, res) {
	var email = req.query.email;
	var pagename = req.query.pagename;
	var websitename = req.query.websitename;
	var templatename = req.query.templatename || '';
	var html = req.body.html || '';
	html = escape(html);
	con.query("SELECT * FROM `websitedata` WHERE `email`='" + email + "' AND `websitename`='" + websitename + "' AND `templatename`='" + templatename + "' AND `pagename`='" + pagename + "' ", function (err, result) {
		if (err) {
			res.json({ StatusCode: 503, Description: err });
			res.end();
		}
		else if (result.length > 0) {
			res.json({ "StatusCode": 400, "Message": "Website Details Already Available!!!", "Response": result });
			res.end();
		} else {
			con.query("INSERT INTO `websitedata` SET `email`= '" + email + "',`websitename` = '" + websitename + "',`templatename` = '" + templatename + "',`pagename`= '" + pagename + "' ,`html`= ? ", html,  function (err, result) {
				if (err) {
					res.json({ StatusCode: 503, Description: err });
					res.end();
				}
				else if (result.affectedRows > 0) {
					res.json({ "StatusCode": 200, "Message": "Website Data Inserted Successfully!!!", "Response": result });
					res.end();
				} else {
					res.json({ "StatusCode": 400, "Message": "Website Data Inserted Failed!!!" });
					res.end();
				}
			});
		}
	});
});

app.post('/snippetdatainsert', function (req, res) {
	var thumbnail = req.files.thumbnail;
	var code = req.body.code;
	var category = req.query.category;
	code = escape(code);
	let temp = new Buffer(thumbnail.data);
	con.query("INSERT INTO `snippet` SET  `code` = '" + code + "', `category` = '" + category + "', `thumbnail` = ?", temp, function (err, result) {
		if (err) {
			res.json({ StatusCode: 503, Description: err });
			res.end();
		}
		else if (result.affectedRows > 0) {
			res.json({ "StatusCode": 200, "Message": "Snippet Data Inserted Successfully!!!", "Response": result });
			res.end();
		} else {
			res.json({ "StatusCode": 400, "Message": "Snippet Data Inserted Failed!!!" });
			res.end();
		}
	});
});

app.post('/snippetdataget', function (req, res) {
	var query = "SELECT * FROM  `snippet`";

	con.query(query, function (err, result) {
		if (err) {
			res.json({ StatusCode: 503, Description: err });
			res.end();
		}
		else if (result.length > 0) {
			res.json({ "StatusCode": 200, "Message": "Snippet Data Available!!!", "Response": result });
			res.end();
		} else {
			res.json({ "StatusCode": 400, "Message": "Snippet Data Not Available!!!" });
			res.end();
		}
	});
});

app.post('/updatewebpagedata', function (req, res) {
	var email = req.query.email;
	var websitename = req.query.websitename;
	var pagename = req.query.pagename;
	var html = req.body.html;
	
	html = escape(html);
	
	con.query("UPDATE `websitedata` SET `html`=? WHERE `email`='" + email + "' AND `websitename`= '" + websitename + "' AND `pagename` = '" + pagename + "'", html, function (err, result) {
		if (err) {
			res.json({ StatusCode: 503, Description: err });
			res.end();
		}
		else if (result.affectedRows > 0) {
			res.json({ "StatusCode": 200, "Message": "Website Data Updated Successfully!!!", "Response": result ,html : unescape(html)});
			res.end();
		} else {
			res.json({ "StatusCode": 400, "Message": "Website Data Updated Failed!!!" });
			res.end();
		}
	});

});




function mailsend(toemail, subject, text) {
	console.log(text)
	var mailOptions = {
		from: 'aswinnsh@gmail.com',
		to: toemail,
		subject: subject,
		text: text
	};
	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});
}
















