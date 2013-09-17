function Map(nom) {
     
    // Création de l'objet XmlHttpRequest
    var xhr = getXMLHttpRequest();
 
    xhr.open("GET", 'maps/' + nom + '.json', false);
	xhr.send(null);
	if(xhr.readyState != 4 || (xhr.status != 200 && xhr.status != 0)) // Code == 0 en local
		throw new Error("Impossible de charger la carte nommée \"" + nom + "\" (code HTTP : " + xhr.status + ").");
	var mapJsonData = xhr.responseText;
	var mapData = JSON.parse(mapJsonData);
	this.tileset = new Tileset(mapData.tileset);
	this.terrain = mapData.terrain;
    this.personnages = new Array();
    this.bombe={x:null,y:null,count:9999,img:null};
    this.bombeA={x:null,y:null,count:9999,img:null};
    this.context=null;
    this.pp="p0";
}
Map.prototype.addPersonnage = function(perso) {
    this.personnages.push(perso);
}
Map.prototype.getHauteur = function() {
    return this.terrain.length;
}
Map.prototype.getLargeur = function() {
    return this.terrain[0].length;
}
Map.prototype.dessinerMap = function(context) {
    this.context=context;
    for(var i = 0, l = this.terrain.length ; i < l ; i++) {
        var ligne = this.terrain[i];
        var y = i * 32;
        for(var j = 0, k = ligne.length ; j < k ; j++) {
            this.tileset.dessinerTile(ligne[j], context, j * 32, y);
        }
    }
    for(var i = 0, l = this.personnages.length ; i < l ; i++) {
        if(this.personnages[i]!==undefined) this.personnages[i].dessinerSprite(context);
        
    }
    if(this.bombe.x!=null){
        if(this.bombe.count>10){
            
            this.pp=this.loser(this.bombe);
            
            this.terrain[this.bombe.y][this.bombe.x]=8;
            var bb=this.bombe;
             var self=this;
             var i=0;
             var exploBombe=setInterval(function(){
                if(i===12 || bb.x===null){
                    
                    clearInterval(exploBombe);
                    self.bombe.x=self.bombe.y=self.bombe.img=null;
                }else {
                    self.dessinerExplosion(i,self.context,bb.x,bb.y);
                    i++;
                }
             },50);
             
             
             for(var i=1;i<2;i++){
                var x=this.bombe.x-i;
                var y=this.bombe.y-i;
                if(this.terrain[this.bombe.y][x]!==undefined && this.terrain[this.bombe.y][x]===4){
                    this.terrain[this.bombe.y][x]=8;
                    
                }
                if(this.terrain[y]!==undefined && this.terrain[y][this.bombe.x]===4){
                    this.terrain[y][this.bombe.x]=8;
                    
                }
                x=this.bombe.x+i;
                y=this.bombe.y+i;
                if(this.terrain[this.bombe.y][x]!==undefined && this.terrain[this.bombe.y][x]===4){
                    this.terrain[this.bombe.y][x]=8;
                    
                }
                if(this.terrain[y]!==undefined && this.terrain[y][this.bombe.x]===4){

                    this.terrain[y][this.bombe.x]=8;
                    
                }
             }
        }
    }
    if(this.bombeA.x!=null){
        if(this.bombeA.count>10){
            this.pp=this.loser(this.bombeA);
            
            //this.lose=this.loser(this.bombeA);
            this.terrain[this.bombeA.y][this.bombeA.x]=8;

            var bb=this.bombeA;
            var self=this;
            var i=0;
            var exploBombe=setInterval(function(){
                if(i===12 || bb.x===null){
                    
                    clearInterval(exploBombe);
                    self.bombeA.x=self.bombeA.y=self.bombeA.img=null;
                }else {
                    self.dessinerExplosion(i,self.context,bb.x,bb.y);
                    i++;
                }
             },50);
            for(var i=1;i<2;i++){


                var x=this.bombeA.x-i;
                var y=this.bombeA.y-i;
                if(this.terrain[this.bombeA.y][x]!==undefined && this.terrain[this.bombeA.y][x]===4){
                    this.terrain[this.bombeA.y][x]=8;
                    
                }
                if(this.terrain[y]!==undefined && this.terrain[y][this.bombeA.x]===4){
                    this.terrain[y][this.bombeA.x]=8;
                    
                }
                x=this.bombeA.x+i;
                y=this.bombeA.y+i;
                if(this.terrain[this.bombeA.y][x]!==undefined && this.terrain[this.bombeA.y][x]===4){
                    this.terrain[this.bombeA.y][x]=8;
                    
                }
                if(this.terrain[y]!==undefined && this.terrain[y][this.bombeA.x]===4){

                    this.terrain[y][this.bombeA.x]=8;
                    
                }

            }
        }
    }
    /*if(this.bombe.x!==null){
        this.dessinerBombe(context,this.bombe.x,this.bombe.y);
        console.log(this.bombe);
    }
    if(this.bombeA.x!==null)this.dessinerBombeA(context,this.bombeA.x,this.bombeA.y);*/
    
}

Map.prototype.loser=function(bombe){
    
        if(this.personnages[0].x === bombe.x ) {
            if(this.personnages[0].y === bombe.y || this.personnages[0].y === bombe.y+1 || this.personnages[0].y === bombe.y-1){
                return 'p1';
            }
        }
        else if(this.personnages[0].y === bombe.y){
            if(this.personnages[0].x === bombe.x || this.personnages[0].x === bombe.x+1 || this.personnages[0].x === bombe.x-1){
                return 'p1';
                
            }
        } 
        

        if(this.personnages[1].x === bombe.x ) {
            if(this.personnages[1].y === bombe.y || this.personnages[1].y === bombe.y+1 || this.personnages[1].y === bombe.y-1){
                return 'p2';
                
            }
        }
        else if(this.personnages[1].y === bombe.y){
            if(this.personnages[1].x === bombe.x || this.personnages[1].x === bombe.x+1 || this.personnages[1].x === bombe.x-1){
                return 'p2';
            }
        } 
        
        return 'p0';
    
}
Map.prototype.addBombe=function(x,y){
    if(this.bombe.count>6){
        if(this.bombe.x!==null)this.terrain[this.bombe.y][this.bombe.x]=8;
        this.bombe={x:x,y:y,count:0,img:"bombeExplosive.png"};
        this.terrain[y][x]='b';
        var self=this;
        setInterval(function  () {
            self.bombe.count++;
            
        },200);
    }

}
Map.prototype.addBombeA=function(x,y){
    if(this.bombeA.count>6){
        if(this.bombeA.x!==null)this.terrain[this.bombeA.y][this.bombeA.x]=8;
        this.bombeA={x:x,y:y,count:0,img:"bombeExplosive.png"};
        this.terrain[y][x]='ba';
        var self=this;
        setInterval(function  () {
            self.bombeA.count++;
        },200);
    }

}
/*
Map.prototype.clearBombe=function(x,y){
    if(this.bombe.count>=0 && this.bombe.count<3){
        this.bombe.img="bombeExplosive.png";
    }else if(this.bombe.count<=6){
        this.bombe.img="bombePretAExploser.png";
    }else {
       if(this.bombe.x!==null){
         this.terrain[this.bombe.y][this.bombe.x]=8;
         for(var i=1;i<3;i++){
            var x=this.bombe.x-i;
            var y=this.bombe.y-i;
            if(this.terrain[this.bombe.y][x]!==undefined && this.terrain[this.bombe.y][x]===4){
                this.terrain[this.bombe.y][x]=8;
                
            }
            if(this.terrain[y]!==undefined && this.terrain[y][this.bombe.x]===4){
                this.terrain[y][this.bombe.x]=8;
                
            }
            x=this.bombe.x+i;
            y=this.bombe.y+i;
            if(this.terrain[this.bombe.y][x]!==undefined && this.terrain[this.bombe.y][x]===4){
                this.terrain[this.bombe.y][x]=8;
                
            }
            if(this.terrain[y]!==undefined && this.terrain[y][this.bombe.x]===4){

                this.terrain[y][this.bombe.x]=8;
                
            }
         }
         var bb=this.bombe;
         var self=this;
         var i=0;
         var exploBombe=setInterval(function(){
            if(i===12 || bb.x===null){
                
                clearInterval(exploBombe);
                self.bombe.x=self.bombe.y=self.bombe.img=null;
            }else {
                self.dessinerExplosion(i,self.context,bb.x,bb.y);
                i++;
            }
         },100);
         
       } 
    }
}
*/
Map.prototype.dessinerExplosion = function(number,context,xDestination,yDestination){
            var img=  new Image();
            img.src = "sprites/explosion.png";
            img.onload = function() {
                context.drawImage(img, number*73, 0, 73, 75, (xDestination*32)-16, (yDestination*32)-32, 64, 64);
            }
}
/*
Map.prototype.dessinerBombe = function(context,xDestination,yDestination){
        this.clearBombe(xDestination,yDestination);
        if(this.bombe.img!==null){
            var img=  new Image();
            img.src = "sprites/"+this.bombe.img;
            img.onload = function() {
                context.drawImage(img, 0, 0, 128, 128, xDestination*32, yDestination*32, 32, 32);
            }
        }
  
}


Map.prototype.clearBombeA=function(x,y){
    if(this.bombeA.count>=0 && this.bombeA.count<3){
        this.bombeA.img="bombeExplosive.png";
    }else if(this.bombeA.count<=6){
        this.bombeA.img="bombePretAExploser.png";
    }else {
       if(this.bombeA.x!==null){
         this.terrain[this.bombeA.y][this.bombeA.x]=8;
         for(var i=1;i<2;i++){
            var x=this.bombeA.x-i;
            var y=this.bombeA.y-i;
            if(this.terrain[this.bombeA.y][x]!==undefined && this.terrain[this.bombeA.y][x]===4){
                this.terrain[this.bombeA.y][x]=8;
                
            }
            if(this.terrain[y]!==undefined && this.terrain[y][this.bombeA.x]===4){
                this.terrain[y][this.bombeA.x]=8;
                
            }
            x=this.bombeA.x+i;
            y=this.bombeA.y+i;
            if(this.terrain[this.bombeA.y][x]!==undefined && this.terrain[this.bombeA.y][x]===4){
                this.terrain[this.bombeA.y][x]=8;
                
            }
            if(this.terrain[y]!==undefined && this.terrain[y][this.bombeA.x]===4){

                this.terrain[y][this.bombeA.x]=8;
                
            }
        }
         var bb=this.bombeA;
         var self=this;
         var i=0;
         var exploBombe=setInterval(function(){
            if(i===12 || bb.x===null){
                
                clearInterval(exploBombe);
                self.bombeA.x=self.bombeA.y=self.bombeA.img=null;
            }else {
                self.dessinerExplosion(i,self.context,bb.x,bb.y);
                i++;
            }
         },100);
         
       } 
    }
}
*/
Map.prototype.dessinerBombeA = function(context,xDestination,yDestination){
        this.clearBombeA(xDestination,yDestination);
        if(this.bombeA.img!==null){
            var img=  new Image();
            img.src = "sprites/"+this.bombeA.img;
            img.onload = function() {
                context.drawImage(img, 0, 0, 128, 128, xDestination*32, yDestination*32, 32, 32);
            }
        }
        

    
    
}


function randomFloat (min, max)
{
    return min + Math.random()*(max-min);
}