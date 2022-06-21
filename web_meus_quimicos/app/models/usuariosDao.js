var crypto = require('crypto');

function usuariosDao(connection){
    this._connection =connection();   
}

usuariosDao.prototype.inserirUsuario =  function  (usuario,res){
    this._connection.connect();
    const database = this._connection.db("Meus_quimicos");
    const usuarios = database.collection("usuarios");
    usuarios.createIndex( { "email": 1}, { unique: true } );
    usuarios.createIndex( { "usuario" :1}, { unique: true } );

    var senha_crypto =crypto.createHash('md5').update(usuario.senha).digest('hex');
    usuario.senha = senha_crypto;
    // create a document to insert
  
    const  result =  usuarios.insertOne(usuario,
         function(err, resultado) {
            if (err){
                var erro= Object.keys(err.keyPattern);
            
                if(erro =="email"){
                    usuario.msg = 3;
                    usuario.msgCadastro = "Email"; 
                }
                if(erro =="usuario"){
                    usuario.msg = 3;
                    usuario.msgCadastro = "Usuário"; 
                }
                res.render('home/cadastro_user',{validacao :{} ,dadosForm: usuario });
            }
            else{
                usuario.msg = 2;
                res.render("index/padrao",{validacao :{} ,dadosForm:usuario});
            }
            });
   
   

//this._connection.close(); Necessário corrigir fechamento da conexao do banco erro:UnhandledPromiseRejectionWarning: MongoTopologyClosedError: Topology is closed
}




usuariosDao.prototype.autenticar = function(usuario,req,res){
    this._connection.connect();
    const database = this._connection.db("Meus_quimicos");
    const usuarios = database.collection("usuarios");

    //cryptografar a senha
    var senha_crypto =crypto.createHash('md5').update(usuario.senha).digest('hex');
    usuario.senha = senha_crypto;

    const result =  usuarios.find({usuario:usuario.usuario,senha:usuario.senha}).toArray(function(err,resultado){
        if (resultado[0] !=  undefined){
            req.session.autirizado = true;

            req.session.usuario = resultado[0].usuario;
           
        }
        if(req.session.autirizado){
            res.redirect('home');
          
        }else{
            usuario.msg = 1;
            res.render("index/padrao",{validacao :{} ,dadosForm:usuario});
           
        }
    })

}


module.exports = function(){
    return usuariosDao;
}