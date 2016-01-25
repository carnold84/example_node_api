var express = require('express');
var router = express.Router();

router.get("/", function(req, res){
    res.json({"error" : false, "message" : "Thanks for using this API"});
});

module.exports = router;
