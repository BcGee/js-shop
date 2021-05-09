var express = require('express');
var router = express.Router();
var BannersModel = require('../models/BannersModel');
var co = require('co');

router.get('/:id' , function(req, res){

    var getData = co(function* (){
        return {
            Banner : yield BannersModel.findOne( { 'id' :  req.params.id }).exec(),
        };
    });
    getData.then( result =>{
        res.render('banners/bannerdetail', { Banner: result.Banner});
    });
});

module.exports = router;