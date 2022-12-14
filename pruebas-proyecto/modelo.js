function Juego(test){
	//function Juego(){
	
		this.partidas={};
		this.usuarios={}; //array asociativo
		//this.cad= new cad.Cad();
		this.test=test;
	
		///this.agregarUsuario=function(nick){
		this.agregarUsuario=function(nick, guardar){
			let res={"nick":-1};
			if (!this.usuarios[nick]) {
				this.usuarios[nick] = new Usuario(nick, this);
				this.insertarLog({"operacion":"inicioSesion","usuario":nick,"fecha":Date()},function(){
					console.log("Registro de log(iniciar sesion) insertado");
				});
				res = { "nick": nick };
				console.log("Nuevo usuario: " + nick);
			}
			return res;
				
	
		}
	
		this.eliminarUsuario=function(nick){
			delete this.usuarios[nick];
		}
	
		this.usuarioSale=function(nick){
			if (this.usuarios[nick]){
				this.finalizarPartida(nick);
				this.eliminarUsuario(nick);
	
				if(!this.test){
					this.insertarLog({"operacion":"usuarioSale", "nick": nick, "fecha":Date()}, function(){
						console.log("Registro de salida de usuario");
					 });
				}
					
			}
		}
	
		this.jugadorCreaPartida=function(nick){
	
			let usr = this.usuarios[nick];
			let res={codigo:-1};
			  if (usr){
				let codigo=usr.crearPartida();
				//let codigo=this.crearPartida(usr);
			//console.log("Usuario: " + nick + " crea la partida: " + codigo);
				res={codigo:codigo};
			}
			return res;
		}
	
		this.jugadorSeUneAPartida=function(nick,codigo){
			let usr = this.usuarios[nick];
			let res={"codigo":-1};
			  if (usr){
				let valor=usr.unirseAPartida(codigo);
				//let valor=this.unirseAPartida(codigo,usr)
				res={"codigo":valor};
			}
			return res;
		}
	
		this.obtenerUsuario=function(nick){
			//if (this.usuarios[nick]){
				return this.usuarios[nick];
			//}
		}
	
		this.crearPartida=function(usr){
		  //obtener código único
		  //crear partida con propietario nick
		  //devolver el código
			let codigo=Date.now();
			console.log("Usuario "+usr.nick+ " crea partida "+codigo); 
	
			if(!this.test){
				this.insertarLog({"operacion":"crearPartida", "propietario": usr.nick, "fecha":Date()}, function(){
					console.log("Registro de partida creada");
				 });
			}
				
			this.partidas[codigo]=new Partida(codigo,usr); 
			return codigo;
		}
	
		this.unirseAPartida=function(codigo,usr){
			let res=-1;
			if (this.partidas[codigo]){
				res=this.partidas[codigo].agregarJugador(usr);
				
				if(!this.test){
					this.insertarLog({"operacion":"unirseAPartida", "codigo": codigo, "nick": usr.nick, "fecha":Date()}, function(){
						console.log("Registro de unirse a partida");
					 });
				} 
				 
			}
			else{
				console.log("La partida no existe");
			}
			return res;
		}
	
		this.obtenerPartidas=function(){
			let lista=[];
			for (let key in this.partidas){
				lista.push({"codigo":key,"owner":this.partidas[key].owner.nick});
			}
			return lista;
		}
	
		this.obtenerPartidasDisponibles=function(){
			let lista=[];
			for (let key in this.partidas){
				if (this.partidas[key].fase=="inicial"){
					lista.push({"codigo":key,"owner":this.partidas[key].owner.nick});
				}
			}
			return lista;
		}
	
		this.finalizarPartida=function(nick){
			for (let key in this.partidas){
				if (this.partidas[key].fase=="inicial" && this.partidas[key].estoy(nick)){
					this.partidas[key].fase="final";
						 
				}
			}
		}
	
		this.obtenerPartida=function(codigo){
			return this.partidas[codigo];
		}
	
	  this.abandonarPartida=function(codigo,usr){
		let res=-1;
		if (this.partidas[codigo]){
				this.finalizarPartida(usr);
				console.log("Abandonar partida");
	
				if(!this.test){			
					this.insertarLog({"operacion":"abandonarPartida","codigo": codigo, "fecha":Date()}, function(){
						console.log("Registro de las partidas abandonadas");
					 });
				} 
					  
		}
		else{
			console.log("La partida no existe");
		 }
	  }
	
	
	  this.jugadorAbandonaPartida=function(nick,codigo){
		let usr = this.usuarios[nick]; //juego.obtenerUsuario(nick)
		let res ={"codigo": -1};
	
		  if (usr){
			//let valor=usr.unirseAPartida(codigo);
			let valor = this.abandonarPartida(codigo);
			res={"codigo":valor};
	
		}
		return res;
	  }
	  
	
	
	  this.obtenerLogs = function(callback){
		this.cad.obtenerLogs(callback);
	}
	
	this.insertarLog=function(log,callback){
		if(this.test == 'false'){
			this.cad.insertarLog(log,callback)
		}
	}
	
	if(test == 'false'){
		this.cad.conectar(function(db){
			console.log("Conectandose a Atlas")
		})
	}
	
	}
	  
	
	
	function Usuario(nick,juego){
		this.nick=nick;
		this.juego=juego;
		this.tableroPropio;
		this.tableroRival;
		this.partida;
		this.flota={}; //podría ser array []
	
		this.crearPartida=function(){
			return this.juego.crearPartida(this)
		}
	
		this.unirseAPartida=function(codigo){
			return this.juego.unirseAPartida(codigo,this);
		}
	
		this.inicializarTableros=function(dim){
			this.tableroPropio=new Tablero(dim);
			this.tableroRival=new Tablero(dim);
		}
	
		this.inicializarFlota=function(){
			// this.flota.push(new Barco("b2",2));
			// this.flota.push(new Barco("b4",4));
	
			//this.flota["b2"]=new Barco("b2", 2);
			//this.flota["b4"]=new Barco("b4", 4);
	
			this.flota["b1-1"]=new Barco("b1-1",1);
			this.flota["b1-2"]=new Barco("b1-2",1);
			this.flota["b2"]=new Barco("b2",2);
			this.flota["b4"]=new Barco("b4",4);
			this.flota["b5"]=new Barco("b5",5);
			//this.flota["b2"]=new Barco("b2",2);
		
			// otros barcos: 1, 3, 5,...
		}
	
		this.colocarBarco=function(nombre,x,y){
			//comprobar fase
			let barco=this.flota[nombre]; 
			if (this.partida && this.partida.fase=="desplegando" && !barco.desplegado){  ///// && !this.barco.desplegado
				console.log("Jugador "+ this.nick+" coloca el barco en la posicion: x:"+ x + " y:" + y);
				this.tableroPropio.colocarBarco(barco,x,y);
	
			}
		}
	
		this.todosDesplegados=function(){
			for(var key in this.flota){
				if (!this.flota[key].desplegado){
					return false;
				}
			}
			return true;
		}
	
		this.barcosDesplegados=function(){
			if(this.partida){
				this.partida.barcosDesplegados();
			}
	
		}
	
		this.disparar = function (x, y) {
			return this.partida.disparar(this.nick, x, y);
		}
	
		this.meDisparan=function(x,y){
			return this.tableroPropio.meDisparan(x,y);
		}
	
		this.obtenerEstadoBarco=function(nombre){
			let res=false;
			if(this.flota[nombre]){
				res = this.flota[nombre].estado;
			}
			return res;
		}
	
		this.obtenerEstado=function(x,y){
			return this.tableroPropio.obtenerEstado(x,y);
		}
	
	
		this.obtenerEstadoMarcado=function(x,y){
			return this.tableroRival.obtenerEstado(x,y);
		}
	
		/*this.obtenerUsuario=function(nick){
			return this.partida.obtenerJugador(nick);
		}*/
	
		this.obtenerFlota=function(){
			return this.flota;
		}
	
	
		/*this.obtenerBarcoDesplegado=function(nombre){
			let res=false;
			if(this.flota[nombre]){
				res=this.flota[nombre].desplegado;
			}
			return res;
		}*/
	
		this.obtenerBarcoDesplegado = function (nombre, x) {
			for (let key in this.flota) {
				if (this.flota[key].nombre == nombre) {
					if (this.comprobarLimites(this.flota[key].tam, x)) {
						return this.flota[key];
					} else {
						return false
					}
				}
			}
			return undefined
		}
	
		this.marcarEstado = function (estado, x, y) {
			this.tableroRival.marcarEstado(estado, x, y);
			if (estado == "agua") {
				this.partida.cambiarTurno(this.nick);
			}
		}
	
	
		this.flotaHundida=function(){
			for(var key in this.flota){
				if (this.flota[key].estado!="hundido"){
					return false;
				}
			}
			return true;
		}
	
	
	}
	
	function Partida(codigo,usr){
		this.codigo=codigo;
		this.owner=usr;
		this.jugadores=[];
		this.fase="inicial"; //new Inicial()
		this.maxJugadores=2;
	
		this.agregarJugador=function(usr){ //this.puedeAgregarJugador
			let res=this.codigo;
			if (this.hayHueco()){ 
				this.jugadores.push(usr);
				console.log("El usuario "+usr.nick+" se une a la partida "+this.codigo); 
	
				/*usr.insertarLog({"operation":"unirseAPartida", "nick":usr.nick, "codigo": codigo, "fecha":Date()}, function(){
					console.log("Agregar usuario: Unirse a partida");
				 }); *///
				usr.partida=this;
				usr.inicializarTableros(10);
				usr.inicializarFlota();
				this.comprobarFase();
			}
			else{
				res=-1;
				console.log("La partida está completa")
			}
			return res;
		}
	
		this.comprobarFase=function(){
			if (!this.hayHueco()){
				this.fase="desplegando";
			}
		}
	
		this.hayHueco=function(){
			return (this.jugadores.length<this.maxJugadores)
		}
	
		this.estoy=function(nick){
			for(i=0;i<this.jugadores.length;i++){
				if (this.jugadores[i].nick==nick){
					return true
				}
			}
			return false;
		}
	
		this.esJugando=function(){
			return this.fase=="jugando";
		}
	
		this.esDesplegando=function(){
			return this.fase=="desplegando";
		}
	
		this.esFinal=function(){
			return this.fase=="final";
		}
	  
		this.flotasDesplegadas=function(){
			for(i=0;i<this.jugadores.length;i++){
				if (!this.jugadores[i].todosDesplegados()){
					return false;
				}
			}
			return true;
		}
	
		this.barcosDesplegados=function(){
			if (this.flotasDesplegadas()){
				this.fase="jugando";
				this.asignarTurnoInicial();
			}
		}
	
		this.asignarTurnoInicial=function(){
			this.turno=this.jugadores[0];
		}
	
		this.cambiarTurno=function(nick){
			this.turno=this.obtenerRival(nick);
		}
	
		this.obtenerRival=function(nick){
			let rival;
			for(i=0;i<this.jugadores.length;i++){
				if (this.jugadores[i].nick!=nick){
					rival=this.jugadores[i];
				}
			}
			return rival;
		}
	
		this.obtenerJugador=function(nick){
			let jugador;
			for(i=0;i<this.jugadores.length;i++){
				if (this.jugadores[i].nick==nick){
					jugador=this.jugadores[i];
				}
			}
			return jugador;
		}
	
	
		this.disparar = function (nick, x, y) {
			let atacante = this.obtenerJugador(nick);
			if (this.turno.nick == atacante.nick) {
				let atacado = this.obtenerRival(nick);
				let estado = atacado.meDisparan(x, y);
				//let estado=atacado.obtenerEstado(x,y);
				console.log(estado);
				atacante.marcarEstado(estado, x, y);
				
				this.comprobarFin(atacado);
				console.log(atacante.nick + ' dispara a ' + atacado.nick + ' en casillas ' + x, y);
				return estado;
			}
			else {
				console.log("No es tu turno")
			}
		}
	
		this.comprobarFin=function(jugador){
			if (jugador.flotaHundida()){
				this.fase="final";
				console.log("Fin de la partida");
				console.log("Ganador: "+this.turno.nick);
				//jugador.logFinalizarPartida(jugador.nick,this.turno.nick,this.codigo);
			}
		}
		this.agregarJugador(this.owner);
	}
	
	function Tablero(size){
		this.size=size; //filas=columnas=size
		this.casillas;
	
		this.crearTablero=function(tam){
			this.casillas=new Array(tam);
			for(x=0;x<tam;x++){
				this.casillas[x]=new Array(tam);
				for(y=0;y<tam;y++){
					this.casillas[x][y]=new Casilla(x,y);
				}
			}
		}
	
		this.colocarBarco=function(barco,x,y){
			/*if (this.casillasLibres(x,y,barco.tam)){
				for(i=0;i<barco.tam;i++){
					this.casillas[i+x][y].contiene=barco;
				}
				barco.posicion(x,y);
				//barco.desplegado=true;
			} */
	
			//this.barco.colocar(this, x,y); ///HV
			barco.colocar(this, x,y); //HV
		}
	
		this.casillasLibres=function(x,y,tam){
			if(x+tam>this.size){
				return false;
			}
			for(i=0;i<tam;i++){
				let contiene=this.casillas[x][y+i].contiene; ///let contiene=this.casillas[i+x][y].contiene;
				if (!contiene.esAgua()){
					return false;
				}
			}
			return true;
		}
	
		this.meDisparan=function(x,y){
			return this.casillas[x][y].contiene.meDisparan(this, x, y);
		}
	
		this.ponerAgua=function(x,y){
			this.casillas[x][y].contiene=new Agua();
		}
	
		this.obtenerEstado=function(x,y){
			return this.casillas[x][y].contiene.obtenerEstado();
		}
	
		this.marcarEstado=function(estado,x,y){
			this.casillas[x][y].contiene.estado=estado;
		}
	
		this.crearTablero(size);
	}
	
	function Casilla(x,y){
		this.x=x;
		this.y=y;
		this.contiene=new Agua();
	}
	
	function Barco(nombre,tam){ //"b2" barco tamaño 2
		this.nombre=nombre;
		this.tam=tam;
		this.orientacion= new Horizontal(); //horizontal, vertical... HV
		//this.orientacion;
		this.desplegado=false;
		this.estado="intacto";
		this.disparos=0; //deprecated
	
		this.x; //this.punto={}; this.punto.x=x; this.punto.y=y;
		this.y;
		this.casillas={}; //antes era []
	
		this.esAgua=function(){
			return false;
		}
	
		this.posicion=function(x,y){ 
			this.x=x;
			this.y=y;
			this.desplegado=true;
			this.iniCasillas();
		}
	
		this.colocar=function(tablero, x, y){  ///HV
			this.orientacion.colocarBarco(this, tablero, x, y); 
		}
	
		this.meDisparan=function(tablero, x, y){
			//this.disparos++;
			//if (this.disparos<this.tam){
			if(this.casillas[x]== "intacto"){  //this.punto.x+x
				this.estado="tocado";
				this.casillas[x]="tocado"; ///
				console.log("tocado");
			}
	
			//else{
			if(this.comprobarCasillas()){
				this.estado="hundido";
				console.log("hundido");		
			}
	
			//tablero.ponerAgua(x,y); 
			return this.estado;
	
		}
	
		this.obtenerEstado=function(){
			return this.estado;
		}
	
		this.comprobarCasillas=function(){
			//return this.estado;
			for(i=0; i< this.tam; i++){
				if(this.casillas[this.x+i]=="intacto"){
					return false;
				}
						
			}
	
			return true;
			//return this.estado;
		}
	
		this.iniCasillas=function(){ //Solo sirve para barcos horizontales
			for(i=0; i< this.tam; i++){
				this.casillas[i+ this.x]="intacto";	
			}
	
		}
	
		//this.iniCasillas(tam);
	
		function Horizontal(){ ///HV
			this.colocarBarco=function(barco, tablero, x, y){
				if (tablero.casillasLibres(x,y,barco.tam)){
					for(i=0;i<barco.tam;i++){
						tablero.casillas[i+x][y].contiene=barco;
					}
					barco.posicion(x,y);
	
				}
			}
	
		}
	
		function Vertical(){
	
		}
		
	}
	
	function Agua(){
		this.nombre="agua";
		this.estado="agua";
	
		this.esAgua=function(){
			return true;
		}
	
		this.meDisparan=function(tablero, x, y){
			console.log("agua");
			return this.estado;
		}
	
		this.obtenerEstado=function(){
			return this;
		}
	}
	
	function Inicial(){
		this.nombre="inicial";
	}
	
	function Jugando(){
		this.nombre="jugando";
	}
	
//module.exports.Juego = Juego;
  
  

  
  