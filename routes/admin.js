var express = require('express');
var router = express.Router();
var ProductsModel = require('../models/ProductsModel');
var CommentsModel = require('../models/CommentsModel');
var BannersModel = require('../models/BannersModel');

// var loginRequired = require('../libs/loginRequired');
var co = require('co');
var paginate = require('express-paginate');
var CheckoutModel = require('../models/CheckoutModel');
var adminRequired = require('../libs/adminRequired');

//csrf
var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });

//이미지 저장되는 위치 설정
var path = require('path');
var uploadDir = path.join( __dirname , '../uploads' ); // 루트의 uploads위치에 저장한다.
var fs = require('fs');

//multer 셋팅
var multer  = require('multer');
var storage = multer.diskStorage({
    destination : function (req, file, callback) { //이미지가 저장되는 도착지 지정
        callback(null, uploadDir );
    },
    filename : function (req, file, callback) { // products-날짜.jpg(png) 저장 
        callback(null, 'products-' + Date.now() + '.'+ file.mimetype.split('/')[1] );
    }
});
var upload = multer({ storage : storage });

router.get( '/', function(req,res){
    res.redirect('/admin/products');
});

// router.get('/products', function(req,res){
//     ProductsModel.find(function(err,products){
//         res.render( 'admin/products' , 
//             { products : products } // DB에서 받은 products를 products변수명으로 내보냄
//         );
//     });
// });

router.get('/products', paginate.middleware(5, 100), async (req,res) => { // 5개씩 100페이지

    const [ results, itemCount ] = await Promise.all([
        ProductsModel.find().sort('-created_at').limit(req.query.limit).skip(req.skip).exec(),
        ProductsModel.count({})
    ]);
    const pageCount = Math.ceil(itemCount / req.query.limit);
    
    const pages = paginate.getArrayPages(req)( 10 , pageCount, req.query.page); // 10개씩 페이지 블락

    res.render('admin/products', { 
        products : results , 
        pages: pages,
        pageCount : pageCount,
    });

});




router.get('/products/write', adminRequired, csrfProtection , function(req,res){
    //edit에서도 같은 form을 사용하므로 빈 변수( product )를 넣어서 에러를 피해준다
    res.render( 'admin/form' , { product : "", csrfToken : req.csrfToken() }); 
});

// router.post('/products/write', function(req,res){
//     var product = new ProductsModel({
//         name : req.body.name,
//         price : req.body.price,
//         description : req.body.description,
//     });
//     product.save(function(err){
//         res.redirect('/admin/products');
//     });
// });

router.post('/products/write', adminRequired, upload.single('thumbnail'), csrfProtection, function(req,res){
    // console.log(req.file);

    var product = new ProductsModel({
        name : req.body.name,
        thumbnail : (req.file) ? req.file.filename : "",
        price : req.body.price,
        description : req.body.description,
        username : req.user.username
    });

    // router.post('/products/write', function(req,res){
    //     var product = new ProductsModel({
    //         name : req.body.name,
    //         price : req.body.price,
    //         description : req.body.description,
    //     });
    //     product.save(function(err){
    //         res.redirect('/admin/products');
    //     });
    // });

    // var validationError = product.validateSync();
    // if(validationError){
    //     res.send(validationError);
    // }else{
    //     product.save(function(err){
    //         res.redirect('/admin/products');
    //     });
    // }
    if(!product.validateSync()){
        product.save(function(err){
            res.redirect('/admin/products');
        });
    }else{
        res.send('error');
    }
});







router.get('/banners/write', adminRequired, csrfProtection , function(req,res){
    //edit에서도 같은 form을 사용하므로 빈 변수( banner )를 넣어서 에러를 피해준다
    res.render( 'admin/bannerform' , { banner : "", csrfToken : req.csrfToken() }); 
});

// router.post('/products/write', function(req,res){
//     var product = new ProductsModel({
//         name : req.body.name,
//         price : req.body.price,
//         description : req.body.description,
//     });
//     product.save(function(err){
//         res.redirect('/admin/products');
//     });
// });








router.get('/banners', paginate.middleware(5, 100), async (req,res) => { // 5개씩 100페이지

    const [ results, itemCount ] = await Promise.all([
        BannersModel.find().sort('-created_at').limit(req.query.limit).skip(req.skip).exec(),
        BannersModel.count({})
    ]);
    const pageCount = Math.ceil(itemCount / req.query.limit);
    
    const pages = paginate.getArrayPages(req)( 10 , pageCount, req.query.page); // 10개씩 페이지 블락

    res.render('admin/banners', { 
        banners : results , 
        pages: pages,
        pageCount : pageCount,
    });

});


router.post('/banners/write', adminRequired, upload.single('thumbnail'), csrfProtection, function(req,res){
    // console.log(req.file);

    var product = new ProductsModel({
        name : req.body.name,
        thumbnail : (req.file) ? req.file.filename : "",
        Link : req.body.Link,
        username : req.user.username
    });

    // router.post('/products/write', function(req,res){
    //     var product = new ProductsModel({
    //         name : req.body.name,
    //         price : req.body.price,
    //         description : req.body.description,
    //     });
    //     product.save(function(err){
    //         res.redirect('/admin/products');
    //     });
    // });

    // var validationError = product.validateSync();
    // if(validationError){
    //     res.send(validationError);
    // }else{
    //     product.save(function(err){
    //         res.redirect('/admin/products');
    //     });
    // }

    if(!product.validateSync()){
        product.save(function(err){
            res.redirect('/admin/banners');
        });
    }else{
        res.send('error');
    }
});


// router.get('/products/detail/:id' , function(req, res){
//     //url 에서 변수 값을 받아올떈 req.params.id 로 받아온다
//     ProductsModel.findOne( { 'id' :  req.params.id } , function(err ,product){
//         res.render('admin/productsDetail', { product : product });  
//     });
// });

// router.get('/products/detail/:id' , function(req, res){
//     //url 에서 변수 값을 받아올떈 req.params.id 로 받아온다
//     ProductsModel.findOne( { 'id' :  req.params.id } , function(err ,product){
//         //제품정보를 받고 그안에서 댓글을 받아온다.
//         CommentsModel.find({ product_id : req.params.id } , function(err, comments){
//             res.render('admin/productsDetail', { product: product , comments : comments });
//         });        
//     });
// });

// router.get('/products/detail/:id' , function(req, res){
//     var getData = co(function* (){
//         return {
//             product : yield ProductsModel.findOne( { 'id' :  req.params.id }).exec(),
//             comments : yield CommentsModel.find( { 'product_id' :  req.params.id }).exec()
//         };
//     });
//     getData.then( function(result){
//         res.render('admin/productsDetail', { product: result.product , comments : result.comments });
//     }); 
// });

// router.get('/products/detail/:id' , function(req, res){
//     var getData = async ()=>{
//         return {
//             product : await ProductsModel.findOne( { 'id' :  req.params.id }).exec(),
//             comments : await CommentsModel.find( { 'product_id' :  req.params.id }).exec()
//         };
//     };
//     getData().then( function(result){
//         res.render('admin/productsDetail', { product: result.product , comments : result.comments });
//     }); 
// });

router.get('/products/detail/:id' , async(req, res) => {
    try{
        var product = await ProductsModel.findOne( { 'id' :  req.params.id }).exec();
        var comments = await CommentsModel.find( { 'product_id' :  req.params.id }).exec();
        
        res.render('admin/productsDetail', { product: product , comments : comments });
    }catch(e){
        res.send(e);
    }
});

router.get('/products/edit/:id', adminRequired, csrfProtection, function(req, res){
    //기존에 폼에 value안에 값을 셋팅하기 위해 만든다.
    ProductsModel.findOne({ id : req.params.id } , function(err, product){
        res.render('admin/form', { product : product, csrfToken : req.csrfToken() });
    });
});

router.post('/products/edit/:id', adminRequired, upload.single('thumbnail'), csrfProtection, function(req, res){
    //그전에 지정되 있는 파일명을 받아온다
    ProductsModel.findOne( {id : req.params.id} , function(err, product){
        
        if(req.file && product.thumbnail){  //요청중에 파일이 존재 할시 이전이미지 지운다.
            fs.unlinkSync( uploadDir + '/' + product.thumbnail );
        }

        //넣을 변수 값을 셋팅한다
        var query = {
            name : req.body.name,
            thumbnail : (req.file) ? req.file.filename : product.thumbnail,
            price : req.body.price,
            description : req.body.description,
        };

        //update의 첫번째 인자는 조건, 두번째 인자는 바뀔 값들
        // ProductsModel.update({ id : req.params.id }, { $set : query }, function(err){
        //     res.redirect('/admin/products/detail/' + req.params.id ); //수정후 본래보던 상세페이지로 이동
        // });
        var products = new ProductsModel(query);
        if(!products.validateSync()){
            //update의 첫번째 인자는 조건, 두번째 인자는 바뀔 값들
            ProductsModel.update({ id : req.params.id }, { $set : query }, function(err){
                res.redirect('/admin/products/detail/' + req.params.id ); //수정후 본래보던 상세페이지로 이동
            });
        }else{
            res.send('error');
        }
    });
});

router.get('/products/delete/:id', function(req, res){
    ProductsModel.remove({ id : req.params.id }, function(err){
        res.redirect('/admin/products');
    });
});

router.get('/banners/delete/:id', function(req, res){
    BannersModel.remove({ id : req.params.id }, function(err){
        res.redirect('/admin/banners');
    });
});

router.post('/products/ajax_comment/insert', function(req,res){
    var comment = new CommentsModel({
        content : req.body.content,
        product_id : parseInt(req.body.product_id)
    });
    comment.save(function(err, comment){
        res.json({
            id : comment.id,
            content : comment.content,
            message : "success"
        });
    });
});

router.post('/products/ajax_comment/delete', function(req, res){
    CommentsModel.remove({ id : req.body.comment_id } , function(err){
        res.json({ message : "success" });
    });
});

router.post('/products/ajax_summernote', adminRequired, upload.single('thumbnail'), function(req,res){
    res.send( '/uploads/' + req.file.filename);
});

router.get('/order', function(req,res){
    CheckoutModel.find( function(err, orderList){ //첫번째 인자는 err, 두번째는 받을 변수명
        res.render( 'admin/orderList' , 
            { orderList : orderList }
        );
    });
});

router.get('/order/edit/:id', function(req,res){
    CheckoutModel.findOne( { id : req.params.id } , function(err, order){
        res.render( 'admin/orderForm' , 
            { order : order }
        );
    });
});

router.post('/order/edit/:id', adminRequired, function(req,res){
    var query = {
        status : req.body.status,
        song_jang : req.body.song_jang
    };

    CheckoutModel.update({ id : req.params.id }, { $set : query }, function(err){
        res.redirect('/admin/order');
    });
});

// router.get('/statistics', adminRequired, function(req,res){
//     CheckoutModel.find( function(err, orderList){ 

//         var barData = [];   // 넘겨줄 막대그래프 데이터 초기값 선언
//         var pieData = [];   // 원차트에 넣어줄 데이터 삽입
//         orderList.forEach(function(order){
//             // 08-10 형식으로 날짜를 받아온다
//             var date = new Date(order.created_at);
//             var monthDay = (date.getMonth()+1) + '-' + date.getDate();
            
//             // 날짜에 해당하는 키값으로 조회
//             if(monthDay in barData){
//                 barData[monthDay]++; //있으면 더한다
//             }else{
//                 barData[monthDay] = 1; //없으면 초기값 1넣어준다.
//             }

//             // 결재 상태를 검색해서 조회
//             if(order.status in pieData){
//                 pieData[order.status]++; //있으면 더한다
//             }else{
//                 pieData[order.status] = 1; //없으면 결재상태+1
//             }

//         });

//         res.render('admin/statistics' , { barData : barData , pieData:pieData });
//     });
// });

router.get('/statistics', adminRequired, async(req,res) => {

    // 년-월-일 을 키값으로 몇명이 결제했는지 확인한다
    // barData._id.count 결제자수에 접근
    var barData = [];
    var cursor = CheckoutModel.aggregate(
            [ 
                { $sort : { created_at : -1 } },
                { 
                    $group : {  
                        _id : { 
                            year: { $year: "$created_at" },
                            month: { $month: "$created_at" }, 
                            day: { $dayOfMonth: "$created_at" }
                        }, 
                        count: { $sum: 1 } 
                    } 
                } 
            ]
        ).cursor({ batchSize: 1000 }).exec();
        
    await cursor.eachAsync(function(doc) {
        if(doc !== null){
            barData.push(doc)
        }
    });

    var pieData = [];
    // 배송중, 배송완료, 결제완료자 수로 묶는다
    var cursor = CheckoutModel.aggregate([ 
        { $group : { _id : "$status", count: { $sum: 1 } } } ])
        .cursor({ batchSize: 1000 }).exec();
    
    await cursor.eachAsync(function(doc) {
        if(doc !== null){
            pieData.push(doc)
        }
    });

    res.render('admin/statistics' , { barData : barData , pieData:pieData });
    
});

module.exports = router;