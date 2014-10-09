/*(c) Copyright 2014 Kvkens. All Rights Reserved. */
var express = require("express");
var path = require("path");
var mongoose = require("mongoose");
var port = process.env.PORT || 3000;
var app = express();

mongoose.connect("mongodb://localhost/imooc");
var _ = require("underscore");
var Movie = require("./models/movie");
var User = require("./models/user");
app.set("views", "./views/pages");
app.set("view engine", "jade");
//app.use(express.bodyParser());
var bodyParser = require('body-parser');
var session = require('express-session'); //如果要使用session，需要单独包含这个模块
var cookieParser = require('cookie-parser'); //如果要使用cookie，需要显式包含这个模块
var bcrypt = require("bcrypt");//bcrypt加密引用
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(cookieParser());
app.use(session({
	name : "kvkens",
	secret: "imooc",
	resave: false,
	saveUninitialized: false
}));
app.use(express.static(path.join(__dirname, "./public")));
app.locals.moment = require("moment");
app.listen(port);

console.log("imooc started on port " + port);

// index page
app.get("/", function(req, res) {
	console.log(req.session.user);
	Movie.fetch(function(err, movies) {
		if (err) {
			console.log(err);
		}
		res.render("index", {
			title: "imooc 首页",
			movies: movies
		});
	});

});

// detail page
app.get("/movie/:id", function(req, res) {
	var id = req.params.id;
	Movie.findById(id, function(err, movie) {
		res.render("detail", {
			title: "imooc:" + movie.title,
			movie: movie
		});
	});
});

// admin page
app.get("/admin/movie", function(req, res) {
	res.render("admin", {
		title: "imooc 后台录入页",
		movie: {
			doctor: '',
			country: '',
			title: '',
			year: '',
			poster: '',
			language: '',
			flash: '',
			summary: ''
		}
	});
});
app.get('/admin/update/:id', function(req, res) {
	var id = req.params.id;

	if (id) {
		Movie.findById(id, function(err, movie) {
			res.render('admin', {
				title: 'imooc 后台更新页面 --- ' + movie.title,
				movie: movie
			});
		});
	}
});
// admin post movie
app.post("/admin/movie/new", function(req, res) {
	var id = req.body.movie._id;
	console.log(id);
	var movieObj = req.body.movie;
	var _movie;
	if (id !== "undefined") {
		Movie.findById(id, function(err, movie) {
			if (err) {
				console.log(err);
			}

			_movie = _.extend(movie, movieObj);
			_movie.save(function(err, movie) {
				if (err) {
					console.log(err);
				}
				res.redirect("/movie/" + movie._id);
			});
		});
	} else {
		_movie = new Movie({
			doctor: movieObj.doctor,
			title: movieObj.title,
			country: movieObj.country,
			language: movieObj.language,
			year: movieObj.year,
			poster: movieObj.poster,
			summary: movieObj.summary,
			flash: movieObj.flash
		});

		_movie.save(function(err, movie) {
			if (err) {
				console.log(err);
			}
			res.redirect("/movie/" + movie._id);
		});
	}
});

// list page
app.get("/admin/list", function(req, res) {
	Movie.fetch(function(err, movies) {
		if (err) {
			console.log(err)
		}
		res.render('list', {
			title: 'imooc 列表页',
			movies: movies
		})
	})
});
// user list page
app.get("/admin/userlist", function(req, res) {
	User.fetch(function(err, users) {
		if (err) {
			console.log(err)
		}
		res.render('userlist', {
			title: 'imooc 管理员列表',
			users: users
		})
	})
});
//list delete movie
app.delete("/admin/list", function(req, res) {
	var id = req.query.id;
	if (id) {
		Movie.remove({
			_id: id
		}, function(err, movie) {
			if (err) {
				console.log(err);
			} else {
				res.json({
					success: 1
				});
			}
		});
	}
});

//signup
app.post("/user/signup", function(req, res) {
	var _user = req.body.user;
	//var _user = req.params.user;
	//var _user = req.query.user;
	User.findOne({
		name: _user.name
	}, function(err, user) {
		console.log(user);
		if (err) {
			console.log(err);
		}
		if (user) {
			return res.redirect("/");
		} else {
			var user = new User(_user);
			user.save(function(err, user) {
				if (err) {
					console.log(err);
				}
				res.redirect("/admin/userlist");
			});
		}
	});
});

//signin
app.post("/user/signin", function(req, res) {
	var _user = req.body.user;
	var name = _user.name;
	var password = _user.password;
	User.findOne({
		name: name
	}, function(err, user) {
		if (err) {
			console.log(err);
		}
		if (!user) {
			return res.redirect("/");
		}

		user.comparePassword(password, function(err, isMatch) {
			if (err) {
				console.log(err);
			}
			if (isMatch) {
				req.session.user = user;
				return res.redirect("/admin/userlist");
			} else {
				return res.redirect("/");
			}
		});
	});
});