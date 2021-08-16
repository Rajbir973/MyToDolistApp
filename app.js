const express=require("express");
const app=express();
const date=require(__dirname+"/date.js")
let items=["Buy Food","Cook Food","Eat Food"];
let workItems=[];

app.use(express.urlencoded({extended:true}));
app.use(express.static("public"))
app.set("view engine","ejs");

app.post("/",function(req,res)
{ 
   
     let item=req.body.additem;
     
     if(req.body.list ==="work")
     {

        workItems.push(item);
        res.redirect("/work");
     }
     else
     {
        items.push(item);
        res.redirect("/");

     }
     


    
})
app.get("/",function(req,res)
{
    let day=date.getDate()
   res.render("list",{listTitle:day,newListItems:items})   
   
});

app.get("/work",function(req,res)
{
    res.render("list",{listTitle:"work List",newListItems:workItems})
})

app.get("/about",function(req,res)
{
    res.render("about")
})

app.post("/work",function(res,req)
{
    let item=req.body.additem
    workItems.push(item)
})

app.listen(3000,function(req,res)
{
    console.log("hello i am working");
}) ;  


