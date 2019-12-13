var express = require('express');
const fs = require('fs');
var router = express.Router();

var data = {}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json({ msg: 'Welcome to API !!' });
});

router.get('/updateLocation/:version/:value', function (req, res, next) {
  let key = req.params.version;
  let value = req.params.value;
  
  if (data[key]) {
    data[key].push(value)
    updateFile(key, value)
  } else {
    data[key] = []
    data[key].push(value)
    createFile(key, value)
  }
  res.json({ result: data[key] });
});

router.get('/getLast5Updates/:version', function (req, res, next) {
  let key = req.params.version;
  let result;
  if (data[key]) {
    result = data[key].reverse().slice(0, 5);
  } else {
    result = 'no result';
  }
  res.json({ result });
});

const createFile = (name, value) => {
  fs.writeFile(`/tmp/${name}`, `${value}\n`, function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
}

const updateFile = (name, value) => {
  fs.open(`/tmp/${name}`, 'a', 666, function( e, id ) {
   fs.write( id, `${value}\n`, null, 'utf8', function(){
    fs.close(id, function(){
     console.log('the file was updated');
    });
   });
  });
}

module.exports = router;
