var socket=io.connect("http://localhost:8080");

var viderElement = function( elt ) {
    while ( elt.hasChildNodes() ) {
        elt.removeChild( elt.firstChild );  
    }
}
function afficher(data){
    
    var ul=document.getElementById('lc');
    viderElement(ul);
    for(var i=0;i<data.length;i++){
        ul.innerHTML +='<li  id="'+data[i]+'"onClick="machin(\''+data[i]+'\')" value="'+data[i]+'">'+data[i];

    }
}
var player;

function inviter(){
	//alert('p : '+player.value);
	//document.location.href = '/game?vs='+player.value;
	document.getElementById('gameboard').style.display='block';
	document.getElementById('invite').style.display='none';

	$.ajax({url: '/game?vs='+player});

}



function machin(i){
	var invite=document.getElementById("invite");
	var profil=document.getElementById("profil");
	player=i;
	if(i!==readCookie('pseudo')){
		profil.style.display="none";
		invite.style.display="block";
		player=i;
	}else{
		invite.style.display="none";
		profil.style.display="block";
	}
	
	


}
function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}
socket.on('connect',function(){
    socket.on('showConnected',function(data){
        afficher(data);
    });
    

});

socket.on('InviterPartie',function(vs){
    var answer=confirm(vs+' souhaite jouer contre vous !');

    if(answer){
    	
    	$('#gameboard').css("display","block");
    	$('#invite').css("display","none");
    	

    	$.ajax({url: '/game?p='+vs
        }).done(function(){
        	//alert('done');
        }).fail(function() {
        	//alert('fail');
        });
    	
    }else {
    	$('#nav').css("display","none");
    	
    	$('#divC').css("display","block");
    	$.ajax({url: '/game?c='+vs});

    }
});
socket.on('cancel',function(){
	alert('Votre adversaire a annulé l\'invitation');
	$('#nav').css("display","none");
	$.ajax({url: '/'});
	
});

var ctx,canvas;
var map = new Map("carte_1");
var joueur,joueur2;
socket.on('myPosition',function(x){
	switch(x[1]) {
			case 'h' : 
				joueur2.deplacer(DIRECTION.HAUT, map);
				break;
			case 'b' : 
				joueur2.deplacer(DIRECTION.BAS, map);
				break;
			case 'g' : 
				joueur2.deplacer(DIRECTION.GAUCHE, map);
				break;
			case 'd' : 
				joueur2.deplacer(DIRECTION.DROITE, map);
				break;
			case 'bo' : 
				map.addBombeA(x[2].x,x[2].y);
				break;
			default : 
				return true;
		}	
});
var me;
$("#divC").css("display","block");
socket.on('newPlayer',function(x){
	$("#divC").css("display","none");
	me=x[3];
	if(map.personnages.length>2){
		map.personnages=Array();
	}

	var dir,d=x[2];
	if(d==='BAS') {
		dir=DIRECTION.BAS;
		joueur2 = new Sprite("sprites2.png", 13, 13,DIRECTION.HAUT);
		joueur = new Sprite("sprites.png", x[0], x[1],dir);
		
	}
	else {
		dir=DIRECTION.HAUT;
		joueur2 = new Sprite("sprites.png", 1, 1,DIRECTION.BAS);
		joueur = new Sprite("sprites2.png", x[0], x[1],dir);
	}

	//alert('je suis joueur 1 : '+ x[0]+' '+x[1]+' '+dir +' ');
	//joueur = new Sprite("sprites.png", x[0], x[1],dir);

	map.addPersonnage(joueur);
	map.addPersonnage(joueur2);
	
	
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	 
	canvas.width  = map.getLargeur() * 32;
	canvas.height = map.getHauteur() * 32;
	var gamerefresh=setInterval(function() {
	    map.dessinerMap(ctx);
	    if(map.pp!=="p0"){
	    	if(map.pp==="p1") {
	    		alert('You lose ! \nYou\'ll be redirected home');
	    		socket.emit('loser',me);
	    	}
	    	else {
	    		alert('You Win ! \nYou\'ll be redirected home');
	    		socket.emit('winner',me); 
	    	}
	    	
	    	clearInterval(gamerefresh);
	    	
	    }
	    
		}, 30);

	
});
function redirected(){

}

window.onload = function() {

	
	

    window.onkeydown = function(event) {
    	//alert(me);
    	var data=Array();
    	data.push(me);
		var e = event || window.event;
		e.preventDefault();
		var key = e.which || e.keyCode;
		//alert(key);
		switch(key) {
			case 38 : 
				joueur.deplacer(DIRECTION.HAUT, map);
				data.push('h');
				break;
			case 40 : 
				joueur.deplacer(DIRECTION.BAS, map);
				data.push('b');
				break;
			case 37 : 
				joueur.deplacer(DIRECTION.GAUCHE, map);
				data.push('g');
				break;
			case 39 : 
				joueur.deplacer(DIRECTION.DROITE, map);
				data.push('d');
				break;
			case 66:
				map.addBombe(joueur.x,joueur.y);
				data.push('bo');
				data.push(map.bombe);
				break;
			default : 
				return false;
		}	
		if(data.length>1)socket.emit('position',data); 
    	
	}
}

