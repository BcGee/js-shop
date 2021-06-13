var express = require('express');
var router = express.Router(); 
var ProductsModel = require('../models/ProductsModel');
var BannersModel = require('../models/BannersModel');




ProductsModel.find({category : 1},function(err,products){

    
});

/* GET home page. */
router.get('/', function(req,res){


    

    
    
    BannersModel.find( function(err,banners){ //첫번째 인자는 err, 두번째는 받을 변수명
        ProductsModel.find(  function(err,products){ //첫번째 인자는 err, 두번째는 받을 변수명



            res.render( 'home' , 
                { products : products,
                    banners: banners 
                    
                } // DB에서 받은 products를 products변수명으로 내보냄
            );
        });
    });

});


router.get('/food', function(req,res){
    
    BannersModel.find( function(err,banners){ //첫번째 인자는 err, 두번째는 받을 변수명
        ProductsModel.find({category : 1},function(err,products){

            res.render( 'home' , 
                { products : products,
                    banners: banners 
                    
                } // DB에서 받은 products를 products변수명으로 내보냄
            );
        });
    });

});


router.get('/device', function(req,res){
    
    BannersModel.find( function(err,banners){ //첫번째 인자는 err, 두번째는 받을 변수명
        ProductsModel.find({category : 2},function(err,products){

            res.render( 'home' , 
                { products : products,
                    banners: banners 
                    
                } // DB에서 받은 products를 products변수명으로 내보냄
            );
        });
    });

});


router.get('/cloth', function(req,res){
    
    BannersModel.find( function(err,banners){ //첫번째 인자는 err, 두번째는 받을 변수명
        ProductsModel.find({category : 3},function(err,products){

            res.render( 'home' , 
                { products : products,
                    banners: banners 
                    
                } // DB에서 받은 products를 products변수명으로 내보냄
            );
        });
    });

});




module.exports = router;