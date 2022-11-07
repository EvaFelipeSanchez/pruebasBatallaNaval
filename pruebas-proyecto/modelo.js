function Juego(){
    this.partidas={};
    this.usuarios={}; //array asociativo
    
    this.agregarUsuario=function(nick){
        let res={"nick":-1};
          if (!this.usuarios[nick]){
            this.usuarios[nick]=new Usuario(nick,this);
            res={"nick":nick};
            console.log("Nuevo usuario: "+nick);
      }
      return res;
    }
      this.eliminarUsuario=function(nick){
          delete this.usuarios[nick];
      }
  
      this.usuarioSalir=function(nick){   //
          if (this.usuarios[nick]){
              this.eliminarPartida(nick);
              this.eliminarUsuario(nick);
          }
      }
  
    this.jugadorCreaPartida=function(nick){
          let usr = this.usuarios[nick]; //juego.obtenerUsuario(nick)
          let res={codigo:-1};
  
            if (usr){
              let codigo=usr.crearPartida();
              //let codigo=this.crearPartida(usr);
              res={codigo:codigo};
              //console.log("Usuario: " + nick + " crea la partida: " + codigo);
              //console.log("El usuario " + nick + " se une a la partida " + codigo);
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
        if (this.usuarios[nick]){
          return this.usuarios[nick];
        }
    }
    
    this.crearPartida= function(usr){
        //obtener código único
        //crear partida con propietario nick
        //devolver el código
        let codigo = Date.now();
        console.log("Usuario "+ usr.nick + " crea la partida: "+codigo);
        this.partidas[codigo] = new Partida(codigo, usr);
        return codigo;
    }
    
    this.unirseAPartida=function(codigo,usr){
      let res=-1;
      if (this.partidas[codigo]){
          res=this.partidas[codigo].agregarJugador(usr);
       }
      else{
          console.log("La partida no existe");
       }
      return res;
      }
    
    this.obtenerPartidas=function(){
        let lista=[];
        //for(i=0;i++; i<this.partidas.length). Abajo esta el array asociativo
        for (let key in this.partidas){
            lista.push({"codigo":key, "owner":this.partidas[key].owner.nick});
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
  
    this.eliminarPartida=function(nick){
      for (let key in this.partidas){
          if (this.partidas[key].fase=="inicial" && this.partidas[key].estoy(nick)){
              this.partidas[key].fase="final";
          }
      }
    }

    this.obtenerPartida=function(codigo){
      return this.partidas[codigo];
    }
  
    /*this.abandonarPartida=function(codigo,usr){
      let res=-1;
      if (this.partidas[codigo]){
              this.eliminarPartida(usr);
      }
      else{
          console.log("La partida no existe");
       }
    }
    */
  
    /*this.jugadorAbandonaPartida=function(nick,codigo){
      let usr = this.usuarios[nick]; //juego.obtenerUsuario(nick)
      let res ={"codigo": -1};
  
        if (usr){
          //let valor=usr.unirseAPartida(codigo);
          let valor = this.abandonarPartida(codigo);
          res={"codigo":valor};
  
      }
      return res;
    }
    */
  

    
    
  }
  
  function Usuario(nick, juego){
      this.nick= nick;
      this.juego= juego;
      this.tableroPropio;
      this.tableroRival;
      this.partida;
      this.flota={}; //podría ser array []
  
      this.crearPartida=function(){
          return this.juego.crearPartida(this);
      }
      this.unirseAPartida=function(codigo){
          return this.juego.unirseAPartida(codigo, this);
      }
  
      this.inicializarTableros=function(dim){
          this.tableroPropio= new Tablero(dim);
          this.tableroRival= new Tablero(dim);
          
      }
  
      this.inicializarFlota=function(){
          //this.flota.push(new Barco("b2", 2));
          //this.flota.push(new Barco("b4", 4));
          this.flota["b2"]= new Barco("b2", 2);
          this.flota["b4"]= new Barco("b4", 4);
          //Ampliar esto con otros barcos de distintos tamaños...
  
      }
  
      this.colocarBarco=function(nombre,x,y){
        //comprobar fase
        if (this.partida.fase=="desplegando"){
          let barco=this.flota[nombre];
          this.tableroPropio.colocarBarco(barco,x,y);
        }
      }

      this.todosDesplegados=function(){
        for(var key in this.flota){
            if(!this.flota[key].desplegado){
                return false;
            }
        }
        return true;
      }

      this.barcosDesplegados=function(){
        this.partida.barcosDesplegados();
      }

      this.disparar=function(x,y){
        this.partida.disparar(this.nick, x, y);
      }

      this.meDisparan=function(x,y){
        this.tableroPropio.meDisparan(x,y);
      }

      this.obtenerEstado=function(x,y){
        return this.tableroPropio.obtenerEstado(x,y);
      }

      this.marcarEstado=function(estado, x, y){
        this.tableroRival.marcarEstado(estado, x,y);
        if(estado=="agua"){
            this.partida.cambiarTurno(this.nick);
        }
      }

      this.flotaHundida=function(){
        for(var key in this.flota){
            if(!this.flota[key].estado=="hundido"){
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
      
      this.agregarJugador=function(usr){
          let res=this.codigo;
          if (this.hayHueco()){
              this.jugadores.push(usr);
              console.log("El usuario "+usr.nick+" se une a la partida "+this.codigo);
              usr.partida=this;
              usr.inicializarTableros(5);
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

              //this.fase="jugando";
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

      this.flotasDesplegadas=function(){
        for(i=0; i<this.jugadores.lenth; i++){
            if(!this.jugadores[i].todosDesplegados()){
                return false;
            }          
        }
        return true;
      }

      this.barcosDesplegados=function(){
        if(this.flotasDesplegadas()){
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
        for(i=0; i < this.jugadores.length; i++){
            if(this.jugadores[i].nick!=nick){
                rival=this.jugadores[i];
            }

        }
        return rival;
      }

      
      this.obtenerJugador=function(nick){
        let rival;
        for(i=0; i < this.jugadores.length; i++){
            if(this.jugadores[i].nick==nick){
                jugador=this.jugadores[i];
            }

        }
        return jugador;
      }
      this.disparar=function(nick,x,y){
        let atacante=this.obtenerJugador(nick);
        
        if (this.turno.nick==atacante.nick){

            let atacado=this.obtenerRival(nick);
            atacado.meDisparan(x,y);

            let estado=atacado.obtenerEstado(x,y);
            atacante.marcarEstado(estado,x,y);
            this.comprobarFin(atacado);
        }	
        else{
          console.log("No es tu turno")
        }
      }
      this.comprobarFin=function(jugador){
        if (jugador.flotaHundida()){
          this.fase="final";
          console.log("Fin de la partida");
          
          console.log("Ganador: "+this.turno.nick);
        }
      }
  
      this.agregarJugador(this.owner);
      
  }
  
  function Tablero(size){
      this.size=size; //files=columnas=size
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
      this.colocarBarco=function(barco, x, y){
        if(this.casillasLibres(x,y, barco.tam)){
            for(i=0; i< barco.tam; i++){
                this.casillas[i][y].contiene=barco;
            }
            barco.desplegado = true; 
          }
      }      

      this.casillasLibres=function(x,y,tam){
        for(i=x;i<tam;i++){
          let contiene=this.casillas[i][y].contiene;
          if (!contiene.esAgua()){
            return false;
          }
        }
        return true;
      }

      this.meDisparan=function(x,y){
        this.casillas[x][y].contiene.meDisparan();
      }

      this.obtenerEstado=function(x,y){
        return this.casillas[x][y].contiene.obtenerEstado();
      }

      this.marcarEstado=function(estado, x, y){
        this.casillas[x][y].contiene=estado;
      }

      this.crearTablero(size);
  
    }
  
  function Casilla(x,y){
      this.x=x;
      this.y=y;
      this.contiene = new Agua();
  }


  function Barco(nombre, tam){ //"b2" barco tamaño 2
      this.nombre=nombre;
      this.tam = tam;
      this.orientacion; //horizontal, vertical.... Pero no se usa salvo añadidos
      this.desplegado=false;
      this.estado="intacto";
      this.disparos=0;

      this.esAgua=function(){
        return false;
      }

      this.meDisparan=function(){
        this.disparos++;
        if(this.disparos<this.tam){
            this.estado="tocado";
            console.log("tocado");
        }else{
            this.estado="hundido";
            console.log("hundido");
        }

      }

      this.obtenerEstado=function(){
        return this.estado;
        //console.log("agua");

      }
  
  }
  
  function Agua(){
      this.nombre= "agua";
      
      this.esAgua=function(){
        return true;
      }

      this.meDisparan=function(){
        console.log("agua");
      }

      
      this.obtenerEstado=function(){
        console.log("agua");
        
      }
  
  }
  
  //module.exports.Juego = Juego;
  
  