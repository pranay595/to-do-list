const express = require("express");
const res = require("express/lib/response");
const day = require(__dirname+"/date");

const app = express();

app.set("view engine", "ejs");

const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
   
    res.render("list", { listTitle: day.getDate(), todoList: contents });
});
  
app.use(express.urlencoded({ extended: true }));

const contents = [ "Buy Food","Cook Food","Eat Food"];

const workList = [];
app.post("/", (req, res) => {
    console.log(req.body);
    const content = req.body.todo;
    if(req.body.list==="Work List"){
        if(content!=="")
        workList.push(content);
        res.redirect("/work");
    }
    else{
    if (content !== "") 
        contents.push(content);
        res.redirect("/");
    }    
})

app.get("/work", (req, res) => {
    res.render("list", {listTitle:"Work List", todoList: workList});
})

app.get("/about", (req,res) =>{
    res.render("about");
})

app.listen(PORT, () => {
    console.log("Server is running on Port: " + PORT);
})