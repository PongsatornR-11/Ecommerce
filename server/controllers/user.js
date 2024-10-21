const prisma = require('../config/prisma')

exports.listUsers = async(req,res) =>{
    try{
        const users = await prisma.user.findMany({
            select:{
                id:true,
                email:true,
                role:true,
                enabled:true,
                address:true
            }
        })
        res.send(users)
    }catch(err){
        console.log(err)
        res.status(500).json({message : "Server error"})
    }
}

exports.changeStatus =async(req,res) =>{
    try{
        const { id , enabled } = req.body
        await prisma.user.update({
            where:{ id: Number(id) },
            data:{ enabled: enabled }
        })
        res.send('update status success!')
    } catch(err){
        console.log(err)
        res.status(500).json({message : "Server error"})
    }
}

exports.changeRole = async(req,res) =>{
    try{
        const { id, role } = req.body
        await prisma.user.update({
            where:{ id : id },
            data:{ role: role }
        })
        console.log(id, role)
        res.send('hello change role in controller')
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Change role error"})
    }
}

exports.userCart = async(req,res) =>{
    try{
        res.send('hello in user cart function')
    }catch(err){
        console.log(err)
        res.status(500).json({ message : "user cart function error"})
    }
}

exports.getUserCart = async(req,res) =>{
    try{
        res.send('Hello get user cart function')
    }catch(err){
        console.log(err)
        res.status(500).json({message: "get User cart function error"})
    }
}

exports.emptyCart = async (req,res) =>{
    try{
        res.send('hello empty user cart in controller')
    }catch(err){
        console.log(err)
        res.status(500).json({message : "Empty user cart function error"})
    }
}

exports.saveAddress = async (req,res) =>{
    try{
        res.send('hello saveAddress in controller')
    }catch(err){
        console.log(err)
        res.status(500).json({ message :"Save address function error"})
    }
}

exports.saveOrder = async(req,res) =>{
    try{
        res.send('hello saveOrder in controller')
    }catch(err){
        console.log(err)
        res.status(500).json({message : "Save order function error"})
    }
}

exports.getOrder = async(req,res) =>{
    try{
        res.send('hello getOrder in controller')
    }catch(err){
        console.log(err)
        res.status(500).json({message : "getOrder function error"})
    }
}