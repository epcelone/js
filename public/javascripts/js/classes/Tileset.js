function Tileset(url) {
	// Chargement de l'image dans l'attribut image
	this.image = new Image();
	this.image.referenceDuTileset = this;
	this.image.src = "tilesets/" + url;
	this.image.onload = function() {
		if(!this.complete) 
			throw new Error("Erreur de chargement du tileset nommÃ© \"" + url + "\".");
		this.referenceDuTileset.largeur = this.width / 128;
	}
	
}


Tileset.prototype.dessinerTile = function(numero, context, xDestination, yDestination) {
	if(isInt(numero)){
		var xSourceEnTiles = numero % this.largeur;
		if(xSourceEnTiles == 0) xSourceEnTiles = this.largeur;
		var ySourceEnTiles = Math.ceil(numero / this.largeur);
		
		var xSource = (xSourceEnTiles - 1) * 128;
		var ySource = (ySourceEnTiles - 1) * 128;
		
		context.drawImage(this.image, xSource, ySource, 128, 128, xDestination, yDestination, 32, 32);
	}else {
		this.dessinerTile(8,context,xDestination,yDestination);
		this.dessinerTile(6,context,xDestination,yDestination-5);
	}


}
function isInt(n) {
   return typeof n === 'number' && parseFloat(n) == parseInt(n, 10) && !isNaN(n);
} 