var express = require('express');
var router = express.Router();
var multer  = require('multer');
var upload = multer({ dest: './public/images' });
const db = require('../db');
const config = require('../config');
var stripe = require('stripe')(config.stripeKey);


router.post('/', (req, res, next)=>{
  const token = req.body.token;
  const getUserIdQuery = `SELECT id from users WHERE token = ?`;

    db.query(getUserIdQuery, [token], (err, results=>{
        if(results.length==0){
            res.locals.loggedIn = false;
        }
        else{
          res.locals.loggedIn = true;
          res.locals.uid = results[0].id
        }
        //send user onto the next route
        next(); 
            })
            )}
            )
router.get('/cities',(req, res, next)=>{
  const citiesQuery = `SELECT * FROM cities
    ORDER BY RAND()
    LIMIT 8`
  db.query(citiesQuery,(err, results)=>{
    if(err) throw err;
    res.json(results);
  })
})

router.get('/abodes',(req, res, next)=>{
  const abodesQuery = `SELECT * FROM homes
    ORDER BY RAND()
    LIMIT 8`
  db.query(abodesQuery,(err, results)=>{
    if(err) throw err;
    res.json(results);
  })
})

router.get('/abode/:abodeId',(req, res)=>{
  const abodeId = req.params.abodeId;
  const getAbodeQuery = `SELECT * FROM homes 
    WHERE id = ?`;
  db.query(getAbodeQuery,[abodeId],(err, result)=>{
    if(err) throw err;
    res.json(result[0])
  })
})

// router.post('/payment/stripe',(req,res)=>{
//   if(!res.locals.loggedIn){
//     res.json({msg: "badToken"})
//     return;
//   }
//   const { stripeToken, amount, email, abodeId} = req.body;
//   stripe.charges.create({
//       amount,
//       currency: 'usd',
//       source: stripeToken,
//       description: `Charges for ${email}`
//   }, (err, charge) => {
//       if (err) {
//           res.json({
//               msg: 'errorProcessing'
//           });
//       } else {
//         const insertReservationQuery = `INSERT INTO reservation
//           (uid, hid, paid)
//           VALUES
//           (?,?,?)`
//         db.query(insertReservationQuery,[res.locals.uid,abodeId,1]);
//           res.json({
//               msg: 'paymentSuccess'
//           });
//       }
//   });
// });


module.exports = router;
