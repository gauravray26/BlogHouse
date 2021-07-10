//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
methodOverride = require("method-override");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));


// mongoose model config

mongoose.connect('mongodb+srv://admin-gaurav:GrRg25@26$urav@raygaurav.wq6ym.mongodb.net/blogdb',{ useNewUrlParser: true, useUnifiedTopology: true })

const blogschema = {
  title: String,
  imageurl: {
    type: String,
    default: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/No_image_3x4.svg/1200px-No_image_3x4.svg.png"
  },
  authorname: String,
  created: {
    type: Date,
    default: Date.now
  },
  content: String
}

const blog = mongoose.model("blog", blogschema);


// -----------------------------------------------------------------------------------



app.get("/", function(req,res)
{
  res.redirect("/home");
})

app.get("/home",function(req,res)
{
  blog.find({},function(err, result)
  {
    if(err) console.log(err);
    else{
      res.render("home",{arr: result});
    }
  })
})

app.get("/compose", function(req,res)
{
  res.render("compose");
})

app.get("/contact",function(req,res)
{
  res.render("contact");
})

app.get("/about",function(req,res)
{
  res.render("about");
})

app.get("/posts/:id", function(req,res)
{
  blog.findById({_id: req.params.id}, function(err,result)
  {
    if(err) res.redirect("/");
    else{
      res.render("post", {post: result})
    }
  })
})

app.get("/posts/:id/edit", function(req,res)
{
  blog.findById({_id: req.params.id}, function(err,result)
  {
    if(err) res.resirect("/posts/" + req.params.id);
    else{
      res.render("edit", {post: result})
    }
  })
})

// post request

app.post("/compose", function(req,res)
{
  const post= new blog({
    title: req.body.title,
  imageurl: req.body.imgurl,
  authorname: req.body.author,
  content: req.body.content
  })
  post.save(function(err)
  {
    if(!err)
    {
      res.redirect("/");
    }else{
      res.render("compose");
    }
  });

})

app.put("/posts/:id", function(req, res)
{
  blog.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
  imageurl: req.body.imgurl,
  authorname: req.body.author,
  content: req.body.content
  }, function(err,result){
      if(err) res.redirect("/");
      else{
         res.redirect("/posts/" + req.params.id);
      }
  })
})

app.delete("/posts/:id", function(req,res)
{
  blog.findByIdAndDelete(req.params.id, function(err)
  {
    if(err) res.redirect("/");
    else res.redirect("/");
  })
})

app.post("/posts/search/items", function(req,res)
{
  blog.find( { $or:[ {title: req.body.key }, {authorname: req.body.key} ]}, 
  function(err,docs){
    if(!err) res.render("search", {arr: docs});
});
})










let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}



app.listen(port, function() {
  console.log("Server started on port 3000");
});
