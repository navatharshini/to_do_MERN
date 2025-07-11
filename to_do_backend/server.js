//Express
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
//create an instance
const app = express();

//middleware
app.use(express.json());
app.use(cors());


//sample in_memory storage for store todo items

// let todos=[];


//Connecting moongoose
//mongodb://localhost:27017/to_do
mongoose.connect("mongodb+srv://navatharshini22:Navas02%24@cluster1.4exv7uh.mongodb.net/todo?retryWrites=true&w=majority") .then(() => {
        console.log("DB connected!")
    })
    .catch((err) => {
        console.log(err)
    })

//creating schema

const todoSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: String

})

//creating model
const todoModel = mongoose.model("todo", todoSchema)







//////////////////////////////////////////////////////////////////////////////////////////
//create a to_do item
//save on mongodb
app.post('/todos', async (req, res) => {
    const { title, description } = req.body;
    // const newTodo={
    //     id:todos.length +1,
    //     title,
    //     description
    // };
    // todos.push(newTodo);
    // console.log(todos);
    try {


        const newTodo = new todoModel({ title, description })
        await newTodo.save();
        res.status(201).json(newTodo);
    }
    catch (error) {
        console.log(error);

        res.status(500).json({ message: error.message })
    }



})
/////////////////////////////////////////////////////////////////////////////////////////////

//get all items
app.get("/todos", async (req, res) => {
    try {
        const todos = await todoModel.find();
        res.json(todos)
    } catch (error) {
        console.log(error);

        res.status(500).json({ message: error.message })

    }


})

///////////////////////////////////////////////////////////////////////////////////////////////////
// // Update to_do item
app.put("/todos/:id",async(req,res)=>{
    try{
        const { title, description } = req.body;
        const id=req.params.id;
        const updatedTodo= await todoModel.findByIdAndUpdate(
    id,
    {title,description},
    {new:true}
        )
    if (!updatedTodo){
        return res.status(404).json({message:"Todo not found"})
    }
     // Log the updated document for debugging
     console.log("Updated Todo: ", updatedTodo);
       // Only return the necessary properties
       res.status(200).json(updatedTodo);
    
    }catch(error){
        console.log(error);

        res.status(500).json({ message: error.message })
    }
   

})







///////////////////////////////////////////////////////////////////////////////////////////////
//delete to_do item
app.delete('/todos/:id',async (req,res)=>{
    try{
        const id =req.params.id;
    await todoModel.findByIdAndDelete(id);
    res.status(205).end();

    }catch(error){
        console.log(error);
        res.status(500).json({ message: error.message })

    }
    
})


/////////////////////////////////////////////////////////////////////////////////////////////////////
//  Start the server


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("Server is listening to port " + port);
});














