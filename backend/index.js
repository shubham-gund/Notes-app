require('dotenv').config();
const config = require('./config.json');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL);

const User = require("./models/userModel")
const Note = require('./models/noteModel')

const express = require ('express');
const cors = require('cors');
const app = express();

const jwt =require('jsonwebtoken');
const {authenticateToken} = require("./utilities");

app.use(express.json());

app.use(
  cors({
    origin:"*",
  })
);

app.get("/" ,(req,res)=>{
  res.render("/login");
})
//Create Account
app.post("/create-account",async(req,res)=>{
  const { fullName,email,password } = req.body;

  if(!fullName){
    return res
    .status(400)
    .json({error:true,message:"full Name is required"});
  }

  if(!email){
    return res
    .status(400)
    .json({error:true,message:"Email is required"});
  }

  if(!password){
    return res
    .status(400)
    .json({error:true,message:"password is required"});
  }

  const isUser = await User.findOne({email:email});
  
  if(isUser){
    return res
    .json({error:true,message:"User already exists"})
  }
  const user = new User({
    fullName,
    email,
    password
  });

  await user.save();

  const accessToken= jwt.sign({user},process.env.TOKEN_SECRET,{
    expiresIn:"36000m"
  })

  return res.json({
    error:false,
    user,
    accessToken,
    message:"Registration Successful"
  });
});
//Login
app.post("/login",async (req,res)=>{
  const { email,password } = req.body;

  if(!email || !password){
    return res
    .status(400)
    .json({message:"Email/password is required"});
  }

  const userInfo = await User.findOne({email});
  if(!userInfo){
    return res.status(400).json({message:"User not found"})
  }

  if(userInfo.email == email && userInfo.password==password){
    const user={user:userInfo};
    const accessToken = jwt.sign(user,process.env.TOKEN_SECRET,{expiresIn:'36000m'});

    return res.json({
      error:false,
      email,
      accessToken,
      message:":Login Successful"
    });
  }else{
    return res.status(400).json({
      error:true,
      message:"Invalid Credentials"
    })
  }


})

//Get User
app.get("/get-user",authenticateToken, async (req,res)=>{
  const {user}=req.user;
  const isUser = await User.findOne({_id:user._id});
  if(!isUser){
    return res.sendStatus(401);
  }
  res.json({
    user:{fullName:isUser.fullName,email:isUser.email,"_id":isUser._id,createdOn:isUser.createdOn},
    message:"User fetched succefully"
});
})

app.post("/add-note",authenticateToken,async(req,res)=>{
  const {title,content}=req.body;
  const {user} = req.user;

  if(!title || !content){
    return res.status(400).json({error:true,message:"title/content required"})
  }

  try {
    const note=new Note({
      title,content,userId:user._id,
    });
    await note.save();
    res.json({
      error:false,
      note,
      message:"Note added succesfully"
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error:true,
      message:"Internal Server Error"
    })
  }

})

app.put("/edit-note/:noteId",authenticateToken,async(req,res)=>{
  const noteId = req.params.noteId;
  const {title,content,isPinned} = req.body;
  const {user} = req.user;

  if(!title && !content ){
    return res
      .status(400)
      .json({
        error:true,
        message:"No changes Provided"
      });
  }

  try {
    const note = await Note.findOne({_id:noteId,userId:user._id});

    if(!note){
      return res.status(404).json({error:true,message:"Note not found"});
    }
    if(title) note.title=title;
    if(content) note.content=content;
    if(isPinned) note.isPinned=isPinned;

    await note.save();

    return res.json({
      error:false,
      note,
      message:"Note updated successfully"
    })
  } catch (error) {
    return res.status(500).json({
      error:true,
      message:"Internal Server Error"
    });
  }
});

app.get("/get-all-notes", authenticateToken, async (req,res)=>{
  const {user} = req.user;

  try {
    const notes = await Note.find({userId:user._id}).sort({isPinned:-1});
    return res.json({
      error:false,
      notes,
      message:"All notes retrived successfully"
    })
  } catch (error) {
     return res.status(500).json({
      error:true,
      message:"Interval Server Error"
     })
  }
})

app.delete("/delete-note/:noteId",authenticateToken,async(req,res)=>{
  const noteId = req.params.noteId;
  const {user}=req.user;

  try {
    const note= await Note.findOne({_id:noteId,userId:user._id});
    if(!note){
      return res.status(404).json({
        error:true,
        message:"Note not Found"
      });
    }
    await Note.deleteOne({_id:noteId,userId:user._id});
    return res.json({
      error:false,
      message:"Note delted successfully"
    })
  } catch (error) {
    return res.status(500).json({
      error:true,
      message:"Internal Server error" 
    })
  }
})

//Update IsPinned
app.put("/update-note-pinned/:noteId",authenticateToken,async(req,res)=>{
  const noteId = req.params.noteId;
  const {isPinned} = req.body;
  const {user} = req.user;

  try {
    const note = await Note.findOne({_id:noteId,userId:user._id});

    if(!note){
      return res.status(404).json({error:true,message:"Note not found"});
    }
    note.isPinned=isPinned ;
    await note.save();
    return res.json({
      error:false,
      note,
      message:"Note updated successfully"
    })
  } catch (error) {
    return res.status(500).json({
      error:true,
      message:"Internal Server Error"
    });
  }
})

//Search
app.get("/search-notes/",authenticateToken,async(req,res)=>{
  const {user} = req.user;
  const {query} = req.query;
  

  try {
    const matchingNotes = await Note.find({
      userId:user._id,
      $or:[
        {title:{$regex:new RegExp (query,"i")}},
        {content:{$regex:new RegExp (query,"i")}}
      ],
    })
    return res.json({
      error:false,
      notes : matchingNotes,
      message:"Notes fetched successfully"
    })
  } catch (error) {
    return res.status(500).jaon({
      message:"Internal Server Error"
    })
  }
})


app.listen(3000,()=>{
  console.log("Listening on port 3000");
})

module.exports = app;
