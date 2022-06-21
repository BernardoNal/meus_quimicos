module.exports.home = function(application, req, res){
	if(req.session.autirizado !== true){
        res.send("O usuário precisa fazer login");
        return;
       
    }
	res.render('home/home');
}

module.exports.sair = function (application,req,res) { 
    req.session.destroy(function(err){
        res.render("index/padrao",{validacao:{},dadosForm:{}})
    });
}