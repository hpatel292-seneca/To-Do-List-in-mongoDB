const mongoose = require('mongoose');

const express = require("express");

const bodyParser = require("body-parser");

const { appendFile } = require("fs");

mongoose.connect('mongodb+srv://26harshil:Nimesh26@cluster0.uprhtzl.mongodb.net/?retryWrites=true&w=majority');

const date = require(__dirname + "/date.js");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

app.use(express.static("public"));

// let taskList = [];

// let workList = [];

const itemSchema = mongoose.Schema({
    name: String
})
const Item = mongoose.model("Item", itemSchema);

var day = date.getDate();

    const item1 = new Item({
        name:"Welcome to your todoList!!"
    })

    const item2 = new Item({
        name:"Hit the + button to add new item"
    })

    const item3 = new Item({
        name:"<-- Hit this to delete an item"
    })
    const defaultItem = [item1,item2,item3];

    const listSchema = {
        name: String,
        list: [itemSchema]
    }

    const List = mongoose.model('List', listSchema);
// let List = ["hello"];
app.get("/", (req, res)=>{
        
    Item.find({}, (err, data)=>{
        if (err) {
            console.log(err);
        }
        else{
            if (data.length === 0) {
                Item.insertMany(defaultItem, function(err){
                    if (err) {
                        console.log(err);
                    }
                    else{
                         console.log("Insert successfully");
                    }
                });
                res.redirect('/');
            }
            else{
            res.render("list", {title: day, newListItem: data, page: "regular"});
            }
        }
            
        });
    })
    

app.post("/", (req, res)=>{

    const listName = req.body.page;
    const item = new Item({
        name: req.body.task
    })
    if (listName === "regular") {
        item.save();
        res.redirect("/");
    }
    // console.log(listName);
    else{
        List.findOne({name: listName}, (err, data)=>{
                // console.log(data);
                data.list.push(item);
                data.save();
                // console.log(data);
                res.redirect("/" + listName);
        });
    }
})


app.post("/delete", (req, res)=>{
    const id = req.body.check;
    const listName = req.body.listName;
    console.log(id);
    if (listName === "regular") {
        Item.findByIdAndRemove(id, (err)=>{
            if (err) {
                console.log(err);
            }
            else{
                // console.log("delete successfully");
                res.redirect("/");
            }
        })
    }
    else{
        console.log("deleteing" + listName);
        List.findOneAndUpdate({name: listName}, {$pull: {list: {_id: id}}}, (err, data)=>{
            if (!err) {
                res.redirect("/" + listName);
            }
        })
    }
    
})

// creating dynamic express routing parameters
app.get("/:param", (req, res)=>{
    const customListName = req.params.param;

    List.findOne({name: customListName}, (err, data)=>{
        if (err) {
            console.log(err);
        }
        else{
            // showing existing list
            if(data){
                res.render("list", {title: data.name, newListItem: data.list, page: data.name});
            }
            // creating new list
            else{
                const list = new List({
                    name: customListName,
                    list: defaultItem
                })
                list.save();
                res.redirect("/" + customListName);
            }
        }
    })

    
    
})

app.listen(3000, ()=>{
    console.log("server is running");
})