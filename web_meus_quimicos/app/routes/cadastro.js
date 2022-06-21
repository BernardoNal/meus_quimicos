module.exports = function(application){
	application.get('/cadastro', function(req, res){
		application.app.controllers.cadastroController.cadastro(application,req,res);
	});

	application.get('/cadastro_user', function(req, res){
		application.app.controllers.cadastroController.cadastroUser(application, req, res);
	});

	application.post('/cadastrar',function(req,res){
		application.app.controllers.cadastroController.cadastrar(application,req,res);
	})
}