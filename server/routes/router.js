const express = require('express');
const router = express.Router();
const db = require('../dbconnection');
const fs = require('fs');
const multer = require('multer');
const upload = multer({dest: './upload'});

router.use('/image', express.static('./upload'));

router.get('/api/customers', (req, res) => {
    db.query(
        'SELECT * FROM CUSTOMER WHERE isDeleted = 0',
        (err, rows, filed) => {
            if(!err) {
                res.send(rows);
            }else {
                console.log(err);
            }
        }
    );
});

router.post('/api/customers', upload.single('image'), (req, res)=> {

    let sql = "INSERT INTO CUSTOMER VALUES(null, ?, ?, ?, ?, ?, now(), 0)";
    let image = '/image/' + req.file.filename;
    let name = req.body.name;
    let birthday = req.body.birthday;
    let gender = req.body.gender;
    let job = req.body.job;
    let params = [image, name, birthday, gender, job];
    db.query(sql, params, (err, rows, field) => {
        if(!err) {
            res.send(rows);
        }else {
            console.log(err);
        }
    });

});

router.delete('/api/customers/:id', (req, res) => {
    let sql = "UPDATE CUSTOMER SET isDeleted = 1 WHERE id = ?";
    let params = [req.params.id];
    db.query(sql, params, (err, rows, field) => {
       if(!err) {
           res.send(rows);
       }else {
           console.log(err);
       }
    });
});

module.exports = router;