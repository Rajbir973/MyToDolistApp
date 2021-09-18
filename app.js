const { name } = require("ejs");
const express=require("express");
const app=express();
const date=require(__dirname+"/date.js");
const mongoose=require("mongoose");
const _=require('lodash');
let allitems=[]

app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");

mongoose.connect("mongodb://localhost:27017node/todolistDB",{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false})
const itemsSchema={
    name:String
};

const Item= mongoose.model("Item",itemsSchema);

const item1=new Item({
    name:"Welcome to the list"
});

const item2=new Item({
    name:"Hit + button to enter new item"
});

const item3=new Item({
    name:"Check the box  to delete an  item"
});

const defaultitems=[item1,item2,item3]

const listSchema={
    name:String,
    items:[itemsSchema]

}

const List=mongoose.model("List",listSchema)

app.get("/", async function(req,res)
{
    allitems=await Item.find({})
    if(allitems.length===0)
    {
        Item.insertMany(defaultitems,function(err)
        {
            if(err)
            {
               console.log(err);
            }
           

        })
        res.redirect("/")    
    }
    else
    {
        let day=date.getDay()
        res.render("list",{listTitle:day,newListItems:allitems})
    }
})





// const finalItems=Item.insertMany(defaultitems,function(err)
// {
//     if(err)
//     {
//         console.log(err);
//     }
//     else
//     {
//         console.log("Success");
//     }
// })


app.post("/", function(req,res)
{ 
   
     const itemName=req.body.additem;
     const currentList=req.body.list;

     const newItem=new Item({
         name:itemName
     });

  
    if(currentList===date.getDay()) 
    {
      newItem.save();
      res.redirect("/");
    }
    else
    {
        List.findOne({name:currentList},function(err,results)
        {
            results.items.push(newItem);
            results.save();
            res.redirect("/"+currentList)
         
        })
    }

     
    //  if(req.body.list ==="work")
    //  {

    //     workItems.push(item);
    //     res.redirect("/work");
    //  }
    //  else
    //  {
    //     allitems.push(item);
    //     res.redirect("/");

    //  }
         
})

// routed parameter
app.get("/:param1",function(req,res)
{

    const name1=_.capitalize(req.params.param1);
    List.findOne({name:name1},function(err,results){
        if(!err)
        {
            if(!results)
            {
                // create a new list
                const list=new List({
                    name:name1,
                    items:defaultitems
                })
                list.save();
                res.redirect("/"+name1)
            }
            else
            {
                // show an existing list

                res.render("list",{listTitle:results.name,newListItems:results.items})
            }

        }
       
    

    })
    
    
});






app.post("/delete",function(req,res)
{
    const deleteItem=req.body.delItem;
    const hideItem=req.body.hiddenItem;
    if(hideItem===date.getDay())
    {
        Item.findByIdAndRemove({_id:deleteItem},function(err){
            if(err)
            {
                console.log(err)
            }
           
           
        })
        res.redirect("/")
        
    }
    else
    {
        List.findOneAndUpdate({name:hideItem},{$pull:{items:{_id:deleteItem}}},function(err,resultItem)
        {
           if(!err)
           {
            res.redirect("/"+hideItem);
           }
           
        })
    } 
})


app.listen(3000,function(req,res)
{
    console.log("hello i am working");
}) ;  


