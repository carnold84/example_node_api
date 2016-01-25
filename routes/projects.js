var express = require('express'),
    router = express.Router(),
    model = require("../model/projects");

// get all projects
router.get('/', function (req, res, next) {
    
    var response = {};
    
    model.find({}, function (err, data){
        
        // Mongo command to fetch all data from collection.
        if(err) {
            response = {"error" : true, "message" : "Error fetching data"};
        } else {
            response = {"error" : false, "message" : data};
        }
        
        res.json(response);
    });
});

// create a new project
router.post('/', function (req, res) {
    
    var db = new model(),
        response = {},
        errors;
    
    req.checkBody('title', 'Title must not be empty').notEmpty();
    
    errors = req.validationErrors();
    
    if (errors) {
        
        res.json(errors);
        return;
    }
    
    // sanitise the data
    db.title = req.sanitize('title').escape().trim();
    db.description = req.sanitize('description').escape().trim();
    
    // save the project and return message
    db.save(function (err) {

        if(err) {
            response = {"error" : true, "message" : "Error adding data"};
        } else {
            response = {"error" : false, "message" : "Data added"};
        }

        res.json(response);
    });
});

// get a specific project
router.get('/:id', function(req, res) {
    
    var response = {};
    
    model.findById(req.params.id, function (err, data) {
        
        if(err) {
            response = {"error" : true, "message" : "Error fetching data"};
        } else {
            response = {"error" : false, "message" : data};
        }
        res.json(response);
    });
});
    
// update a specific project
router.put('/:id', function (req,res){
    
    var response = {};
    
    // first find out record exists or not
    // if it does then update the record
    model.findById(req.params.id, function (err, data) {
        
        if(err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else {
            
            req.checkBody('title', 'Title must not be empty').notEmpty();
    
            var errors = req.validationErrors();

            if (errors) {

                res.json(errors);
                return;
            }
        
            data.title = req.sanitize('title').escape().trim();
            
            if(req.body.description !== undefined) {
                
                data.description = req.sanitize('description').escape().trim();
            }
            
            // save the data
            data.save(function (err) {
                
                if(err) {
                    response = {"error" : true, "message" : "Error updating data"};
                } else {
                    response = {"error" : false, "message" : ["Data is updated for", req.params.id].join(' ')};
                }
                res.json(response);
            })
        }
    });
});
    
// delete specific project
router.delete('/:id', function (req,res) {
        
    var response = {};

    model.findById(req.params.id, function (err, data) {

        if(err) {
            response = {"error" : true, "message" : "Error fetching data"};
        } else {

            // data exists, remove it.
            model.remove({_id : req.params.id}, function (err) {

                if(err) {
                    response = {"error" : true, "message" : "Error deleting project"};
                } else {
                    response = {"error" : false, "message" : ["Data associated with", req.params.id, "is deleted"].join(' ')};
                }
                res.json(response);
            });
        }
    });
});

module.exports = router;
