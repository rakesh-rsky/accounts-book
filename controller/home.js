const multer = require("multer");
const sg = require("../models/mail");
var admin = require("firebase-admin");

var serviceAccount = require("./../serviceKey.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://bdwallet.firebaseio.com",
	storageBucket: "bdwallet.appspot.com",
});

module.exports = {
	index: function (req, res) {
		var ref = admin.database().ref("version");

		ref.once("value").then(function (dataSnapshot) {
			var ver = dataSnapshot.child("version").val();
			ver = "v " + ver;
			res.render("../views/home/index.hbs", {
				version: ver,
			});
		});
	},

	verifyOtp: function (req, res) {
		otp = req.body.otp || "";
		name = req.body.name || "";
		email = req.body.email || "";

		if (email == "") {
			otp = req.query.otp || "";
			name = req.query.name || "";
			email = req.query.email || "";
		}

		sg.sgVerification(name, email, otp)
			.then(() => {
				res.send({
					success: true,
					otp: otp,
					name: name,
					email: email,
				});
			})
			.catch((error) => { });
	},

	contact: function (req, res) {
		var data = {
			name: req.body.name || "",
			email: req.body.email || "",
			phone: req.body.phone || "",
			message: req.body.message || "",
		};

		var ref = admin.database().ref();
		var key = ref.push().key;
		var dr = ref.child("contact/" + key);

		// var updates = {}
		// updates['/contact/' + key] = data;
		// admin.database().ref().update(updates);

		dr.set(data, function (err) {
			if (err) {
				console.log("Failed...");
			} else {
				console.log("saved successfully");
			}
		});
		res.send({
			success: true,
			msg: "Thanks, We will reach you shortly.",
		});
	},

	appDownload: function (req, res) {
		var bucket = admin.storage().bucket();

		var srcFilename = "app/accountsbook.apk";

		var file = bucket.file(srcFilename);

		file
			.getSignedUrl({
				action: "read",
				expires: "03-09-2491",
			})
			.then((signedUrls) => {
				res.send({
					isValid: true,
					fileUrl: signedUrls[0],
				});
			});
	},

	generateChecksum: function (req, res) {
		const https = require("https");

		const PaytmChecksum = require("./PaytmChecksum");

		console.log(req.body);
		var requestType = "Payment";
		var mid = req.body.MID || req.query.MID;
		var orderId = req.body.ORDER_ID || req.query.ORDER_ID;
		var custId = req.body.CUST_ID || req.query.CUST_ID;
		var channelId = req.body.CHANNEL_ID || req.query.CHANNEL_ID;
		var txnAmount = req.body.TXN_AMOUNT || req.query.TXN_AMOUNT;
		var websiteName = req.body.WEBSITE || req.query.WEBSITE;
		var callbackUrl = req.body.CALLBACK_URL || req.query.CALLBACK_URL; //"https://merchant.com/callback";
		var industryTypeId =
			req.body.INDUSTRY_TYPE_ID || req.query.INDUSTRY_TYPE_ID;

		// var  requestType   = "Payment";
		// var  mid           = "VzmtXX88490369041280";
		// var  orderId       = "order_304";
		// var  custId        = "cust_304";
		// var channelId      = "WAP";
		// var  txnAmount     = "21" ;
		// var  websiteName   = "WEBSTAGING";
		// var  callbackUrl   = "https://merchant.com/callback";
		// var industryTypeId = "Retail";

		// var order_id = "order_3";
		// var mid = "VzmtXX88490369041280";
		var mid_key = process.env.MID_KEY || "ry1yi8XmSI%nNMwO";
		var paytmParams = {};

		paytmParams.body = {
			requestType: "Payment",
			mid: mid,
			websiteName: websiteName, //WEBSTAGING
			orderId: orderId,
			paymentMode: "UPI_INTENT",
			callbackUrl: callbackUrl, //"https://merchant.com/callback",
			txnAmount: {
				value: txnAmount,
				currency: "INR",
			},
			userInfo: {
				custId: custId,
			},
		};

		PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), mid_key)
			.then(function (checksum) {
				paytmParams.head = {
					signature: checksum,
				};

				var post_data = JSON.stringify(paytmParams);

				var options = {
					/* for Staging */
					hostname: "securegw-stage.paytm.in" /* for Production */, // hostname: 'securegw.paytm.in',

					port: 443,
					path:
						"/theia/api/v1/initiateTransaction?mid=" +
						mid +
						"&orderId=" +
						orderId,
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"Content-Length": post_data.length,
					},
				};

				var response = "";
				var post_req = https.request(options, function (post_res) {
					post_res.on("data", function (chunk) {
						response += chunk;
					});

					post_res.on("end", function () {
						console.log("Response: ", response);
						var re = JSON.parse(response);
						res.send({
							CHECKSUMHASH: checksum,
							ORDER_ID: orderId,
							payt_STATUS: re.body.resultInfo.resultMsg,
							TXN_TOKEN: re.body.txnToken,
						});
					});
				});

				post_req.write(post_data);
				post_req.end();
			})
			.catch(function (err) {
				console.log(err);
			});
	},
};
