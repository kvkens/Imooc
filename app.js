/*(c) Copyright 2014 Kvkens. All Rights Reserved. */
var express = require("express");
var path = require("path");
var mongoose = require("mongoose");
var port = process.env.PORT || 3000;
var app = express();
var dbUrl = "mongodb://localhost/imooc";
mongoose.connect(dbUrl);

app.set("views", "./views/pages");
app.set("view engine", "jade");
var bodyParser = require('body-parser');
var session = require('express-session'); //如果要使用session，需要单独包含这个模块
var cookieParser = require('cookie-parser'); //如果要使用cookie，需要显式包含这个模块
var bcrypt = require("bcrypt"); //bcrypt加密引用
var mongoStore = require("connect-mongo")(session); //express4 的写法详见参考connect-mongo API
var logger = require('morgan');
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(cookieParser());
app.use(session({
	name: "kvkens",
	secret: "imooc",
	resave: false,
	saveUninitialized: false,
	store: new mongoStore({
		url: dbUrl,
		auto_reconnect: true,//issue 推荐解决方法
		collection: "sessions"
	})
}));

if("development" === app.get("env")){
	app.set("showStackError",true);
	app.use(logger(":method :url :status"));
	app.locals.pretty = true;
	mongoose.set("debug",true);
}

require("./config/routes")(app);
app.use(express.static(path.join(__dirname, "./public")));
app.locals.moment = require("moment");
app.listen(port);

console.log("imooc started on port " + port);