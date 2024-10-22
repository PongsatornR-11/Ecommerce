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
        const user = await prisma.user.update({
            where:{ id: Number(id) },
            data:{ enabled: enabled }
        })
        // res.json({
        //     message: 'update user status success!',
        //     user: user
        // })
        res.send('update status success!')
    } catch(err){
        console.log(err)
        res.status(500).json({message : "Server error"})
    }
}

exports.changeRole = async(req,res) =>{
    try{
        const { id, role } = req.body
        const user = await prisma.user.update({
            where:{ id : Number(id) },
            data:{ role: role }
        })
        res.send('hello change role in controller')
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Change role error"})
    }
}

exports.userCart = async(req,res) =>{
    try{

        const { cart } =req.body
        console.log(cart)
        console.log(req.user.id)

        const user = await prisma.user.findFirst({
            where:{ id :Number(req.user.id)}
        })
        // console.log(user)
        // delete old cart item
        await prisma.productOnCart.deleteMany({
            where:{
                cart: { 
                    orderedById: user.id }
            }
        })

        // delete old cart
        await prisma.cart.deleteMany({
            where:{
                orderedById: user.id
            }
        })

        //prepare product
        let products = cart.map((item)=>({
            productId : item.id,
            count : item.count,
            price : item.price
        }))

        // find total price
        let cartTotal = products.reduce((sum, item)=>
            sum + item.price * item.count, 0)

        const newCart = await prisma.cart.create({
            data:{
                products:{
                    create: products
                },
                cartTotal : cartTotal,
                orderedById: user.id
            }
        })
        console.log(newCart)
        res.send('Add cart completed!')
    }catch(err){
        console.log(err)
        res.status(500).json({ message : "user cart function error"})
    }
}

exports.getUserCart = async(req,res) =>{
    try{
        const cart = await prisma.cart.findFirst({
            where:{
                orderedById: Number(req.user.id)
            },
            include:{
                products:{
                    include:{
                        product:true
                    }
                }
            }
        })
        res.json({
            products: cart.products,
            cartTotal: cart.cartTotal
        })
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