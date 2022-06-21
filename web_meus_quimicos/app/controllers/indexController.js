module.exports.index = function(application, req, res){
	res.render('index/padrao',{validacao :{} ,dadosForm:{}});
}

module.exports.autenticar = function(application,req,res) { 

    var dadosForm =req.body;

    
    req.assert('usuario','Usuario não pode ser vazio').notEmpty();
    req.assert('senha','Senha não pode ser vazio').notEmpty();
    req.assert('senha','A senha é de 6 a 20 caracteres').len(6,20);
  

    var erros = req.validationErrors();

    if(erros){
        res.render('index/padrao',{validacao : erros,dadosForm : dadosForm});
        return;
    }

    var connection = application.config.dbConnection;
    var usuariosDao = new application.app.models.usuariosDao(connection);

    usuariosDao.autenticar(dadosForm,req,res);
} 