const express = require('express');
require('./database/config');
const app = express();
const userModel = require('./database/userSchema');
const productModel = require('./database/productSchema');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');

//jwt token
const jwt = require('jsonwebtoken');
const jwtkey = 'lelouch';


app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'))
app.use('/profilepics', express.static('profilepics'))

//multer-storage-for-image
const uploads = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads')
        },
        filename: (req, file, cb) => {
            cb(null, file.fieldname + '-' + Date.now() + '.jpeg')
        }
    })
}).single('image')

//multer-storage-for-profile
const uploadprof = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'profilepics')
        },
        filename: (req, file, cb) => {
            cb(null, file.fieldname + '-' + Date.now() + '.jpeg')
        }
    })
}).single('profilepic')

//register
app.post('/', uploadprof, async (req, resp) => {
    let result = await userModel.findOne({ email: req.body.email })
    if (!result) {
        let data = new userModel({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password,
            profilepic: req.file.path,
        });
        data = await data.save();
        data = data.toObject();
        delete data.password;
        jwt.sign({ data }, jwtkey, { expiresIn: '3h' }, (err, token) => {
            if (err) {
                resp.send({ result: "Error!! Try again later" })
            }
            resp.send({ data, auth: token });
        })
    }
    else {
        resp.send({ result: "email already exist" });
    }
})

//prefillprofile
app.get('/user/:_id', verifyToken, async (req, resp) => {
    let data = await userModel.findOne(req.params);
    resp.send(data);
})

//updateprofile
app.put('/updateuser/:_id', verifyToken,uploadprof, async (req, resp) => {
    let user
    if (req.file) {
        user = await userModel.updateOne(
            req.params,
            {
                $set: {
                    name: req.body.name,
                    phone: req.body.phone,
                    email: req.body.email,
                    profilepic: req.file.path,
                }
            }
        )
    }
    else {
        user = await userModel.updateOne(
            req.params,
            {
                $set: req.body
            }
        )
    }
    resp.send(user);
})

//login
app.post('/login', async (req, resp) => {
    let data = await userModel.findOne(req.body).select('-password')
    if (data) {
        jwt.sign({ data }, jwtkey, { expiresIn: '3h' }, (err, token) => {
            if (err) {
                resp.send({ result: "Error!! Try again later" })
            }
            resp.send({ data, auth: token });
        })
    }
    else {
        resp.send({ result: "No user found" })
    }
})

//showlist
app.get('/list', verifyToken, async (req, resp) => {
    let product = await productModel.find()
    resp.send(product);
})

//addproducts
app.post('/addproduct', verifyToken, uploads, async (req, resp) => {
    let product = new productModel({
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
        userId: req.body.userId,
        company: req.body.company,
        imageurl: req.file.path,
    });
    product = await product.save();
    resp.send(product);
})

//deleteproduct
app.delete('/deleteproduct/:_id', verifyToken, async (req, resp) => {
    let data = await productModel.findOne(req.params)
    fs.unlinkSync(data.imageurl);
    let product = await productModel.deleteOne(req.params)
    resp.send(product);
})

//updateproduct
app.put('/updateproduct/:_id', verifyToken, uploads, async (req, resp) => {
    let product
    if (req.file) {
        product = await productModel.updateOne(
            req.params,
            {
                $set: {
                    name: req.body.name,
                    category: req.body.category,
                    price: req.body.price,
                    company: req.body.company,
                    imageurl: req.file.path,
                }
            }
        )
    }
    else {
        product = await productModel.updateOne(
            req.params,
            {
                $set: req.body
            }
        )
    }
    resp.send(product);
})

//prefillform
app.get('/list/:_id', verifyToken, async (req, resp) => {
    let product = await productModel.findOne(req.params);
    resp.send(product);
})

//searchproduct
app.get('/search/:key', verifyToken, async (req, resp) => {
    let result = await productModel.find({
        "$or": [
            { name: { $regex: req.params.key } }
        ]
    })
    resp.send(result);
})

//verifytoken(middleware)
function verifyToken(req, resp, next) {
    let token = req.headers['authorization']
    if (token) {
        token = token.split(' ')[1];
        jwt.verify(token, jwtkey, (err, valid) => {
            if (err) {
                resp.status(401).send({ result: "Provide a valid token" })
            }
            else {
                next();
            }
        })
    }
    else {
        resp.status(403).send({ result: "Please provide a token" });
    }
}


app.listen(5000);