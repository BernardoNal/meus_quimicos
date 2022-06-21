
module.exports.cadastro = function (application,req,res) { 
   if(req.session.autirizado !== true){
      res.send("O usuário precisa fazer login");
      return;
     
  }
    res.render('home/cadastro',{validacao :{},dadosForm:{}});
 }

 module.exports.cadastroUser = function (application,req,res) { 

    res.render('home/cadastro_user',{validacao :{},dadosForm:{}});
 } 

 module.exports.cadastrar = function (application,req,res) { 

   var dadosForm = req.body;

   req.assert('nome','Nome não pode ser vazio').notEmpty();
   req.assert('usuario','Usuario não pode ser vazio').notEmpty();
   req.assert('senha','Senha não pode ser vazio').notEmpty();
   req.assert('email','Precisa inserir email').notEmpty();
   req.assert('senha','A senha é de 6 a 20 caracteres').len(6,20);
   req.assert('email','Email inválido').isEmail();

   var erros = req.validationErrors();
   if(erros){
       res.render('home/cadastro_user',{validacao : erros,dadosForm: dadosForm });
       return;
   }
   
   var connection = application.config.dbConnection;
   var usuariosDao = new application.app.models.usuariosDao(connection);
   

   usuariosDao.inserirUsuario(dadosForm,res); 
  
   
   
}	

 