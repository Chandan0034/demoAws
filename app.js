const express=require('express');
const cors=require('cors')
const {exec}=require('child_process')
const fs=require('fs')
const app=express();
app.use(cors());
app.use(express.json());
require('dotenv').config();
const PORT=process.env.PORT||8000;
app.get('/',async(req,res)=>{
    res.send("Welcome To Online Code Runner Application")
})
app.get('/Api:id',async(req,res)=>{
    const language=req.params;
    console.log(language);
})
app.post('/code',async(req,res)=>{
    const id=req.headers;
    const {code,language}=req.body;
    const FileName=`Main.${language}`
    try{
        fs.writeFileSync(FileName,code);
    }catch(err){
        console.log("Error Message  ",err);
    }
    const child_process=exec(`g++ Main.cpp -o Main && ./Main`,(error,stdout,stderr)=>{
        if(error){
            res.send({
                id:id,
                output:stderr,
                success:false,
                message:"Execution Error"
            })
        }
    })
    child_process.stdout.on('data',(data)=>{
        res.send({
            id:id,
            output:data,
            success:True,
            message:"Execution Successfully"
        })
    })

})
app.listen(PORT,()=>{
    console.log(`Server Started At Port ${PORT}`);
})