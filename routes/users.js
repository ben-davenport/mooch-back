var express = require('express');
var router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const randToken = require('rand-token')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//check token is authentic
router.use('', function(req, res, next){
  next();
})

router.post('/signup', (req, res, next)=>{
  //someone wants to signup! 
  //first of all check if Data is Valid
  const { first, last, email, password} = req.body;
  if((!first) || (!last) || (!email) || (!password)){
    //STOP. GOODBYE>
    res.json({
      msg: "invalidData"
    })
    return;
  }
  //if we get this far then the data must be valid
  const checkUserQuery = `SELECT * FROM users WHERE email =?`
  db.query(checkUserQuery, [email],(err, results)=>{
    if(err){throw err}; //FULL STOP YOU HAVE A PROBLEM IN YOUR Database
    if(results.length > 0){
      // this email has been used
      res.json({
        msg: 'userExists'
      })}
    else{
      //this email has not been used; let's add it!
      const insertUserQuery = `INSERT INTO users
      (first, last, email, password, token) VALUES (?,?,?,?,?)`;
      //turn the password into something impossible to understand for DB storage
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      const token = randToken.uid(50);
      db.query(insertUserQuery, [first, last, email, hash, token], (err2)=>{
        if(err2){
          throw err2;
        }
        res.json({
          msg: "userAdded",
          token,
          email,
          first,
        })
      })
    }    
  })
})
router.post('/login', (req,res)=>{
  const {email, password} = req.body;
  //first: check DB for this email
  const getUserQuery = `SELECT * FROM users WHERE email = ?`;
  db.query(getUserQuery, [email], (err, results)=>{
    if(err){throw err}
    //check to see if there is a result
    else if(results.length > 0){
      //found the user!
      const thisRow = results[0];
      //now check if the password is correct!
      const isValidPass = bcrypt.compareSync(password, thisRow.password);
      if (isValidPass){
        //everything is correct! they can log in!
        const token = randToken.uid(50);
        const updateUserTokenQuery = `UPDATE users SET token = ? WHERE email = ?`;
        db.query(updateUserTokenQuery, [token, email], (err)=>{
          if(err){throw err}
        })
        res.json({
          msg: "loggedIn",
          first: thisRow.first,
          last: thisRow.last,
          email: thisRow.email,
          token 
        });
      }else{
        //the password is not correct!
        res.json({
          msg: "badPass"
        })
      }
    }
    else{
      //no match
      res.json({
        msg: "noEmail"
      })
    }
  })
})
module.exports = router;
