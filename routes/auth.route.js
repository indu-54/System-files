const router= require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');
const checkAuth=require('../middleware/check-auth');
router.post('/register',(req,res)=>{

    bcrypt.hash(req.body.password ,10,(err,hash)=> {
        if(err){
            return res.json({success:false, message:"hash error"})
        }else{
            const user = new User({
                name:req.body.name,
                email:req.body.email,
                mobile:req.body.mobile,
                password:hash,
                companyname:req.body.companyname,
            })
            user.save()
            .then(()=>{
             res.json({success:true,message:'ACCOUNT CREATED SUCCESSFULLY'})
            })
            .catch((err)=>{
                if(err.code === 11000){
                    return res.json({success:false,message:'Email Already existed'})
                }
                res.json({success:false,message:'Authentication failed'})
               })
        }
    });
    
});
router.post('/login',(req,res)=>{
    
    User.find({email:req.body.email}).exec().then((result)=>{
        if(result.length<1){
         return res.json({success:false,message:'User not found'})
        }
        const user = result[0];
        bcrypt.compare(req.body.password,user.password,(err,ret)=>{
            if(ret){
                const payload={
                  userId:user._id
                }
                const token=jwt.sign(payload,"webBatch")
                return res.json({success:true,token:token,message:"login successfully"})
               
            }else{
                return res.json({success:false,message:"login failed"})
            }
        })
    }).catch(err=>{
        res.json({success:false,message:'Authentication failed'})
    })
});
router.get('/profile',checkAuth,(req,res)=>{
    const userId=req.userData.userId;
    User.findById(userId).exec().then((result)=>{
        res.json({success:true,data:result})
    }).catch((err)=>{
        res.json({success:false,message:"server error"})
    })
})


// router.get('/profile/:userId', checkAuth, (req, res) => {
//     const userId = req.params.userId;

//     User.findById(userId)
//         .exec()
//         .then((result) => {
//             if (result) {
//                 res.json({ success: true, data: result });
//             } else {
//                 res.status(404).json({ success: false, message: "User not found" });
//             }
//         })
//         .catch((err) => {
//             console.error(err);
//             res.status(500).json({ success: false, message: "Server error" });
//         });
// });

router.get('/succes', async (req, res, next) => {
    try {
        const user = await User.find({});
        res.status(200).json({ data: user, message: 'Authentication login successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});
// router.get('/success/:userId', async (req, res, next) => {
//     try {
//         const userId = req.params.userId;

//         const user = await User.findById(userId);

//         if (user) {
//             res.status(200).json({ data: user, message: 'User found successfully' });
//         } else {
//             res.status(404).json({ message: 'User not found' });
//         }
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: err.message });
//     }
// });

module.exports =router;

// const router = require('express').Router();
// const User = require('../models/user');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const checkAuth = require('../middleware/check-auth');

// // User Registration
// router.post('/register', (req, res) => {
//     bcrypt.hash(req.body.password, 10, (err, hash) => {
//         if (err) {
//             return res.json({ success: false, message: 'Hashing error' });
//         } else {
//             const user = new User({
//                 name: req.body.name,
//                 email: req.body.email,
//                 mobile: req.body.mobile,
//                 password: hash,
//                 companyname: req.body.companyname,
//             });

//             user.save()
//                 .then(() => {
//                     res.json({ success: true, message: 'Account created successfully' });
//                 })
//                 .catch((err) => {
//                     if (err.code === 11000) {
//                         return res.json({ success: false, message: 'Email already exists' });
//                     }
//                     res.json({ success: false, message: 'Registration failed' });
//                 });
//         }
//     });
// });

// // User Login
// router.post('/login', (req, res) => {
//     User.findOne({ email: req.body.email })
//         .exec()
//         .then((user) => {
//             if (!user) {
//                 return res.json({ success: false, message: 'User not found' });
//             }

//             bcrypt.compare(req.body.password, user.password, (err, result) => {
//                 if (result) {
//                     const payload = {
//                         userId: user._id,
//                     };

//                     const token = jwt.sign(payload, "webBatch");

//                     return res.json({ success: true, token: token, message: "Login successful" });
//                 } else {
//                     return res.json({ success: false, message: "Login failed" });
//                 }
//             });
//         })
//         .catch((err) => {
//             res.json({ success: false, message: 'Authentication failed' });
//         });
// });

// // Retrieve User Profile
// router.get('/profile/:userId', checkAuth, (req, res) => {
//     const userId = req.params.userId;

//     User.findById(userId)
//         .exec()
//         .then((result) => {
//             if (result) {
//                 res.json({ success: true, data: result });
//             } else {
//                 res.status(404).json({ success: false, message: "User not found" });
//             }
//         })
//         .catch((err) => {
//             console.error(err);
//             res.status(500).json({ success: false, message: "Server error" });
//         });
// });

// // Retrieve User Success
// router.get('/success/:userId', checkAuth, async (req, res, next) => {
//     try {
//         const userId = req.params.userId;

//         const user = await User.findById(userId);

//         if (user) {
//             res.status(200).json({ success: true, data: user, message: 'User found successfully' });
//         } else {
//             res.status(404).json({ success: false, message: 'User not found' });
//         }
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ success: false, error: err.message });
//     }
// });

// module.exports = router;


