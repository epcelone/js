var url = require('url');
var bd  = require('bd');
var express  = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io');
var expressValidator = require('express-validator');
var mysql = require('mysql');

var connection = mysql.createConnection({
      host     : 'nod9x5qu27.database.windows.net,1433',
      user     : 'bombermanApp',
      password : 'Ce8103ef',
      database : 'bomberman_BD',
    });
var data=Array();
var users=Array();
var countP=0;
    app.configure(function(){
      app.set('views', __dirname + '/views');
      app.set('view engine', 'jade');
      app.use(express.cookieParser());
      app.use(express.session({secret: '123456azerty'}));
      app.use(express.static(__dirname + '/public'));
      app.use(express.bodyParser());
      app.use(expressValidator());  //required for Express-Validator
      app.use(express.methodOverride());
      app.use(app.router);
    });
    io = io.listen(server);
    
    io.sockets.on('connection', function (socket) {
    	
    	
    	countP++;
      	var hs = socket.handshake;
      	if(pseudo!==undefined)users[pseudo]=socket.id;
		  
      	io.sockets.emit('showConnected',data);
      	io.sockets.socket(pseudo).emit('me',pseudo);
      
      	socket.on('position', function (data) {
        
          if(adversaire1===data[0]) io.sockets.socket(users[adversaire2]).emit('myPosition',data);
          else io.sockets.socket(users[adversaire1]).emit('myPosition',data);
              
        });
        socket.on('winner', function (w) {
          bd.winner(w);
        });
        socket.on('loser', function (l) {
          bd.loser(l);
        });
      
      	/*socket.on('disconnect', function(socket) {
	      console.log('Got disconnect!'+pseudo);
	      delete users[pseudo];
	   });*/
      //socket.broadcast.emit('this', { receivers: 'everyone but socket'}); //emits to everyone but socket
      //socket.emit('this', { receivers: 'socket'}); //emits to socket
     
    });
     
//var server = http.createServer(function(req, res) {
    var adversaire1,adversaire2;
    //bd.requete('firstname','user',2);

    app.post('/subscribe', function(req,res){
        req.assert('fn', 'Prénom Obligatoire*').notEmpty();
        req.assert('ln', 'Nom Obligatoire*').notEmpty();
        req.assert('ps', 'Pseudo Obligatoire*').notEmpty();
        req.assert('em', 'Format Email incorrecte*').isEmail();
        req.assert('pa', 'Mot de passe entre 6-20 caractères*').len(6, 20);
        req.assert('pa2', 'Ces mots de passe ne correspondent pas*').equals(req.body.pa);
        var errors = req.validationErrors();
        var erreur; 

        if ( errors ) {
          //console.log(errors);
          res.render('inscription',{errors: errors,erreur:erreur});

        }else {
          connection.query( 'SELECT firstname , lastname ,pseudo , email  FROM user WHERE pseudo="'+req.body.ps+'"', function(err, rows) {
          if(rows.length!==0) {
            erreur='Pseudonyme existe déja !';
            res.render('inscription',{erreur:erreur});
          }else {
            bd.insererUser(req.body.fn.toLowerCase(),req.body.ln.toLowerCase(),req.body.ps.toLowerCase(),req.body.em.toLowerCase(),req.body.pa);
            res.render('accueil',{message :"Inscription avec succes !"});
          }
        });

        }

        
    });
    function RemoveDupArray(a)
    {
      a.sort();
      for (var i = 1; i < a.length; i++)
      {
        if (a[i-1] === a[i])
        a.splice(i, 1);
      }
    }
    var data;
    var pseudo;
    app.post('/login', function(req,res){
        
        pseudo = req.body.ps.toLowerCase();
        var pass = req.body.pa;
        var table = "user"; 
        var io = require('socket.io');
        connection.query( 'SELECT player  FROM winner WHERE player="'+req.cookies.pseudo+'"', function(err, rows) {
            wl.push(rows.length);
          });
          connection.query( 'SELECT player  FROM loser WHERE player="'+req.cookies.pseudo+'"', function(err, rows) {
           wl.push(rows.length);
          });
        if(req.cookies.pseudo){
          pseudo=req.cookies.pseudo;
          data.push(req.cookies.pseudo);
          RemoveDupArray(data);
          res.redirect('/',{wl:wl});
        }

        connection.query( 'SELECT firstname , lastname ,pseudo , email  FROM user WHERE pseudo="'+pseudo+'" AND password="'+pass+'"', function(err, rows) {
          if(rows.length!==0) {
            
            data.push(rows[0].pseudo);
            req.cookies.pseudo=pseudo;
            RemoveDupArray(data);
            res.cookie('pseudo',rows[0].pseudo,{expires:new Date()+9000000,maxAge:9000000});
            res.redirect('/',{wl:wl});
          }else{res.render('accueil',{fail:"pseudo/pass incorrecte !"});}
        });

        
        //console.log(resultat);
        //res.render('game',{resultat:resultat});

    });
    app.get('/inscription', function(req, res) {
        res.render('inscription');
    });
    var gm,me;
    
    app.get('/game', function(req, res) {
    	tab=Array();
    	pseudo=req.cookies.pseudo;
    	//socket
    	console.log(req.query)
    	if (req.query.vs) {
        adversaire1=req.query.vs;
    		bd.insererGame(req.cookies.pseudo,vs);
  		 	var vs=req.query.vs;
  		 	io.sockets.socket(users[vs]).emit('InviterPartie',req.cookies.pseudo);
  		 	connection.query( 'SELECT idGame,player2 FROM game WHERE player1="'+pseudo+'" || player2="'+pseudo+'"', function(err, rows) {
  	          if(rows.length!==0) {
  	          	gm=rows[0].idGame;
  	          }
  	         });
  		 	tab.push(1);tab.push(1);tab.push('BAS');tab.push(vs);
  		 	io.sockets.socket(users[vs]).emit('newPlayer',tab);
        //console.log(vs+'**********************************');
        res.send("query.vs");
        
		 }else if(req.query.c){
  			
  			bd.supprimerGame(req.cookies.pseudo);
  			io.sockets.socket(users[req.query.c]).emit('cancel');

			res.send("query.c");
		}else if(req.query.p){
      		adversaire2=req.query.p;
			tab.push(13);tab.push(13);tab.push('HAUT');tab.push(req.query.p);
			io.sockets.socket(users[req.query.p]).emit('newPlayer',tab);
		      //console.log(req.query.p+'**********************************');
		      res.send("query.p");
		}
		
    });
    app.get('/', function(req, res) {
    	   var wl=Array();
        if(req.cookies.pseudo){
          wl.push(req.cookies.pseudo);
          data.push(req.cookies.pseudo);
          pseudo=req.cookies.pseudo;
          RemoveDupArray(data);
          connection.query( 'SELECT player  FROM winner WHERE player="'+req.cookies.pseudo+'"', function(err, rows) {
            console.log(rows.length+'*');
            wl.push(rows.length);
          });
          connection.query( 'SELECT player  FROM loser WHERE player="'+req.cookies.pseudo+'"', function(err, rows) {
            console.log(rows.length+'**');
           wl.push(rows.length);

           if(wl[1]+wl[2]!==0) wl.push((wl[1]*100)/(wl[1]+wl[2]));
           else wl.push[0];

           if(wl[1]+wl[2]!==0) wl.push((wl[2]*100)/(wl[1]+wl[2]));
           else wl.push[0];

           res.render(
            'game',
            { wl: wl }
            );
          });
          
          
          
        }else res.render('accueil',{message:""});
    });
    

    app.use(function(req, res, next){
        res.status(404);

        res.render('404', { url: req.url });
    });
    server.listen(8080);
   // });
//server.listen(8080);