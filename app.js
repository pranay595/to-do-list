const express = require("express");
const day = require(__dirname + "/date");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

mongoose.connect("mongodb+srv://admin-pranay:013051@cluster0.9cegs.mongodb.net/todolistDB");

const itemSchema = mongoose.Schema({
    name: String
});

const Item = mongoose.model("itemlist", itemSchema);

const item1 = new Item({
    name: "<-- check here to remove item"
});
const item2 = new Item({
    name: "Cook Food"
});
const item3 = new Item({
    name: "Eat Food"
});

const defaultItem = [item1, item2, item3];

const listSchema = mongoose.Schema({
    name: String,
    items: [itemSchema]
});

const List = mongoose.model("List", listSchema);


app.get("/", (req, res) => {

    Item.find({}, (err, items) => {
        if (err)
            throw (err)
        // to add the deafault items to the database need to run once otherwise same dataset enter multiple times
        if (items.length === 0) {
            Item.insertMany(defaultItem, (err) => {
                if (err)
                    throw (err)
                else {
                    // console.log("Inserted Successfully");
                }
            });
        }
        else {
            res.render("list", { listTitle: day.getDate(), todoList: items });
        }
    })
});


app.post("/", (req, res) => {
    // console.log(req.body.list);
    const listName = req.body.list;
    const item = _.capitalize(req.body.todo);
    if (item !== "") {
        const addItem = new Item({
            name: item
        })
        if (listName === day.getDate()) {
            addItem.save();
            if (listName === "Work List")
                res.redirect("/work");
            res.redirect("/");
        } else {
            List.findOne({ name: listName }, (err, foundList) => {
                if (err)
                    throw (err)
                else {
                    foundList.items.push(addItem);
                    foundList.save();
                    res.redirect("/list/" + listName);
                }
            })
        }
    }
})

app.post("/delete", (req, res) => {
    const deleteItem = req.body.checkbox;
    const listName = req.body.list;

    if (listName === day.getDate()) {
        Item.findByIdAndRemove(deleteItem, (err, value) => {
            if (err)
                throw (err)
        });
        res.redirect("/");
    } else {
        List.findOneAndUpdate(
            { name: listName },
            { $pull: { items: { _id: deleteItem } } },
            (err, foundList) => {
                if (err)
                    throw (err)
                else
                    res.redirect("/list/" + listName);
            }
        )
    }
})

app.get("/list/:customList", (req, res) => {
    const customList = _.capitalize(req.params.customList);

    List.findOne({ name: customList }, (err, result) => {
        if (err) {
            throw (err)
        }
        else {
            if (!result) {
                const list = new List({
                    name: customList,
                    items: defaultItem
                });
                list.save();
                res.render("list", { listTitle: customList, todoList: list.items });
            }
            else
                res.render("list", { listTitle: customList, todoList: result.items });
        }
    })
})

app.get("/:id", (req, res) => {
    const id = req.params.id;
    if (id === "work")
        res.render("list", { listTitle: "Work List", todoList: workList });
    else if (id === "about")
        res.render("about");
    else
        res.redirect("/")
})


app.listen(PORT, () => {
    console.log("Server is running on Port: " + PORT);
})


// Item.deleteMany({name:""},()=>{
// })