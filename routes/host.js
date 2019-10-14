var express = require('express');
var router = express.Router();
const db = require('../db');
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
const fs = require('fs')

router.post('/home', upload.single('locationImage'), (req,res)=>{
    console.log(req.body)
    console.log(req.file)
    const {title, location, guests, pricePerNight, details, amenities, token} = req.body
    const f = req.file;
    const finalFilePath = f.destination+'/'+Date.now()+f.originalname;

    const filePathForDb = finalFilePath.slice(8)

    fs.rename(f.path, finalFilePath, (err)=>{
        if(err) throw err;
    });


    const insertHomeQuery = `INSERT INTO 
                            homes (uid, title, location, guests, pricePerNight, details, amenities)
                            VALUES
                            (?,?,?,?,?,?,?)`

    const dbValues = [res.locals.uid,title,location,guests,pricePerNight,details,amenities,filePathForDb];
    db.query(insertHomeQuery,dbValues,(err)=>{
        if(err) throw err;
        res.json({
            msg: "homeAdded"
        })
    })
});

module.exports = router;