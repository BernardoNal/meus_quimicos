var express = require('express'),
    bodyParser = require('body-parser'),
    multiparty = require("connect-multiparty"),
    mongoDB = require('mongodb'),
    objectId = require('mongodb').ObjectId,
    fs = require('fs');
var app = express();


/* configurar o middleware express.static */
app.use(express.static('./app/public'));

/* configurar o middleware body-parser */
app.use(bodyParser.urlencoded({extended: true})); 
app.use(bodyParser.json());     
app.use(multiparty()) ;
app.use(function(req,res, next){

    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Methods","*");
    res.setHeader("Access-Control-Allow-Headers","content-type");
    res.setHeader("Access-Control-Allow-Credentials",true);

    next();

});

var port = 8080;

app.listen(port);

var db = new mongoDB.Db(
    'Meus_quimicos', 
    new mongoDB.Server('localhost',27017,{}),
    {}
);

console.log('Servidor subiu');

//post
app.post('/api',function(req,res){

    var date = new Date();
    time_stamp = date.getTime();

    url_img_name = time_stamp +"_"+ req.files.arquivo.originalFilename;

    var path_ori = req.files.arquivo.path;
    var path_des = "./uploadsIMG/"+url_img_name;

   

    fs.rename(path_ori,path_des, function(err){
        if(err){
            res.status(500).json({erro: err});
            return;
        }

        var dados ={
            url_img : url_img_name,
            name_produto: req.body.name_produto,
            composto_produto: req.body.composto_produto,
            tipo_quimico: req.body.tipo_quimico,
            area: req.body.area,
            inflamavel: req.body.inflamavel

        }
  

        db.open(function(err,mongoclient){
            mongoclient.collection('quimicos',function(err,collection){
                collection.insert(dados,function(err,records){
                    if(err){
                        res.status(500).json(err);
                    }else{
                        res.json({'status' : 'químico adicionado'});
                    }
                    mongoclient.close();
                });
            });
        });
    })
});

// get
app.get('/api',function(req,res){


    db.open(function(err,mongoclient){
        mongoclient.collection('quimicos',function(err,collection){
            collection.find().sort({_id : -1}).toArray(function(err,results){
                if(err){
                    res.status(400).json(err);
                }else{
                    res.json(results);
                }
                mongoclient.close();
            });
        });
    });
});

// get id
app.get('/api/:id',function(req,res){

  

    db.open(function(err,mongoclient){
        mongoclient.collection('quimicos',function(err,collection){
            collection.find(objectId(req.params.id)).toArray(function(err,results){
                if(err){
                    res.status(404).json(err);
                }else{
                    res.json(results);
                }
                mongoclient.close();
            });
        });
    });
});

// get imagem
app.get('/imagem/:imagem',function(req,res){

    var img = req.params.imagem;

    fs.readFile('./uploadsIMG/'+img, function(err,content){
        if(err){
            res.status(404).json(err);
            return;
        }

        res.writeHead(200,{'content-type': 'image/jpg'});
        res.end(content);
    })

})


// put id
app.put('/api/:id',function(req,res){


    db.open(function(err,mongoclient){
        mongoclient.collection('quimicos',function(err,collection){
            collection.update({_id: objectId(req.params.id)},
                { $push : {
                    comentarios : {
                        id_comentario : new objectId(),
                        comentario : req.body.comentario
                    }
                }},
                {},
                function(err,records){
                    if(err){
                        res.json(err);
                    }else{
                        res.json(records);
                    }
                });
                mongoclient.close();
            });
        });
    });

  //delete  id
    app.delete('/api/:id',function(req,res){

        db.open(function(err,mongoclient){
            mongoclient.collection('quimicos',function(err,collection){
                collection.deleteOne(
                    { _id : objectId(req.params.id)}
                    ,function(err,records){
                        if(err){
                            res.status(404).json(err);
                        }else{
                            res.json(records);
                        }
                    });
                    mongoclient.close();
                });
            });
        });