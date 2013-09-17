var DIRECTION = {
    "BAS"    : 0,
    "GAUCHE" : 1,
    "DROITE" : 2,
    "HAUT"   : 3
}
var DUREE_ANIMATION = 3;
var DUREE_DEPLACEMENT = 15;
function Sprite(url, x, y, direction) {
    this.x = x; // (en cases)
    this.y = y; // (en cases)
    this.direction = direction;
    this.etatAnimation = -1;
    // Chargement de l'image dans l'attribut image
    this.image = new Image();
    this.image.referenceDuPerso = this;
    this.image.onload = function() {
        if(!this.complete) 
            throw "Erreur de chargement du sprite nommé \"" + url + "\".";
         
        // Taille du Sprite
        this.referenceDuPerso.largeur = this.width / 9;
        this.referenceDuPerso.hauteur = this.height / 8;
    }
    this.image.src = "sprites/" + url;
}
 
Sprite.prototype.dessinerSprite = function(context) {
    var frame = 1; // NumÃ©ro de l'image Ã  prendre pour l'animation
    var decalageX = 0, decalageY = 0; // DÃ©calage Ã  appliquer Ã  la position du personnage
    if(this.etatAnimation >= DUREE_DEPLACEMENT) {
        // Si le dÃ©placement a atteint ou dÃ©passÃ© le temps nÃ©cÃ©ssaire pour s'effectuer, on le termine
        this.etatAnimation = -1;
    } else if(this.etatAnimation >= 0) {
        // On calcule l'image (frame) de l'animation Ã  afficher
        frame = Math.floor(this.etatAnimation / DUREE_ANIMATION);
        if(frame > 2) {
            frame %= 3;
        }
        
        // Nombre de pixels restant Ã  parcourir entre les deux cases
        var pixelsAParcourir = 32 - (32 * (this.etatAnimation / DUREE_DEPLACEMENT));
        
        // Ã€ partir de ce nombre, on dÃ©finit le dÃ©calage en x et y.
        if(this.direction == DIRECTION.HAUT) {
            decalageY = pixelsAParcourir;
        } else if(this.direction == DIRECTION.BAS) {
            decalageY = -pixelsAParcourir;
        } else if(this.direction == DIRECTION.GAUCHE) {
            decalageX = pixelsAParcourir;
        } else if(this.direction == DIRECTION.DROITE) {
            decalageX = -pixelsAParcourir;
        }
        
        // On incrÃ©mente d'une frame
        this.etatAnimation++;
    }
	

    context.drawImage(
        this.image, 
        this.largeur * frame, this.direction * this.hauteur, // Point d'origine du rectangle source Ã  prendre dans notre image
        this.largeur, this.hauteur, // Taille du rectangle source (c'est la taille du personnage)
        // Point de destination (dÃ©pend de la taille du personnage)
        (this.x * 32) - (this.largeur / 2) + 16 + decalageX, (this.y * 32) - this.hauteur + 24 + decalageY,
        this.largeur, this.hauteur // Taille du rectangle destination (c'est la taille du personnage)
    );
	
}
Sprite.prototype.getCoordonneesAdjacentes = function(direction)  {
    var coord = {'x' : this.x, 'y' : this.y};

    switch(direction) {
        case DIRECTION.BAS : 
            coord.y++;
            break;
        case DIRECTION.GAUCHE : 
            coord.x--;
            break;
        case DIRECTION.DROITE : 
            coord.x++;
            break;
        case DIRECTION.HAUT : 
            coord.y--;
            break;
    }

    return coord;
}
     
Sprite.prototype.deplacer = function(direction, map) {
    // On change la direction du personnage
    this.direction = direction;
         
    // On vérifie que la case demandée est bien située dans la carte
    var prochaineCase = this.getCoordonneesAdjacentes(direction);
    if(prochaineCase.x < 0 || prochaineCase.y < 0 || prochaineCase.x >= map.getLargeur() || prochaineCase.y >= map.getHauteur() 
        || map.terrain[prochaineCase.y][prochaineCase.x]===2 || map.terrain[prochaineCase.y][prochaineCase.x]===4 || isInt(map.terrain[prochaineCase.y][prochaineCase.x])!==true ) {
        // On retourne un booléen indiquant que le déplacement ne s'est pas fait, 
        // Ça ne coute pas cher et ca peut toujours servir
        return false;
    }
    //console.log(prochaineCase.x+' '+prochaineCase.y);
    // On effectue le déplacement
    this.x = prochaineCase.x;
    this.y = prochaineCase.y;

    return true;
}

function isInt(n) {
   return typeof n === 'number' && parseFloat(n) == parseInt(n, 10) && !isNaN(n);
} 