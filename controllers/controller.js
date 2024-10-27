const User = require('../models/userSchema')
const secret = "Data@123"

async function register(req, res) {
    try{
       let {username, password, role} = req.body

       if(!username || !password){
        return res.status(400).json({message: "Fields missing !!"})
       }

       const userExist = await User.find({username: username})

       if(userExist){
        return res.status(400).json({message: "Username already exists !!"})
       }

       let user = new User({
        username: username,
        password: password,
        role: role
       })

       await user.save();

       let token = jwt.sign({id: user._id}, secret, {expiresIn: '1d'})

       return res.status(201).json({message: "User created successfully !!", user, token})

    } catch(err){
        return res.status(500).json({message: err})
    }
}

async function login(req, res) {
    try{
       let {username, password} = req.body

       if(!username || !password){
        return res.status(400).json({message: "Fields missing !!"})
       }

       const userLogin = await User.find({username: username, password: password})

       if(userLogin){
        let token = jwt.sign({id: userLogin._id}, secret, {expiresIn: '1d'})

        return res.status(200).json({message: "User logged in successfully", token})        
       }

       return res.status(400).json({message: "Some error occurred !!"})

    }catch(err){
       return res.status(500).json({message: err})
    }
}