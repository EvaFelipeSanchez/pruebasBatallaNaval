let modelo=require("./modelo.js");

describe("El juego...", function() {
  var miJuego;
  var us1,us2,partida;

  beforeEach(function() {
    miJuego=new modelo.Juego(true);
    miJuego.agregarUsuario("pepe");
    miJuego.agregarUsuario("luis");
    let res=miJuego.jugadorCreaPartida("pepe");
    miJuego.jugadorSeUneAPartida("luis",res.codigo);
    us1=miJuego.obtenerUsuario("pepe");
    us2=miJuego.obtenerUsuario("luis");
    partida=miJuego.obtenerPartida(res.codigo);
  });

  it("comprobamos los nick de los usuarios", function(){
    expect(us1.nick).toEqual("pepe");
    expect(us2.nick).toEqual("luis");
  });

  it("comprobamos que luis y pepe están en la partida",function(){
    expect(partida.estoy("pepe")).toEqual(true);
    expect(partida.estoy("luis")).toEqual(true);
  });

  it("los dos jugadores tienen tablero propio y rival",function(){
    expect(us1.tableroPropio).toBeDefined();
    expect(us2.tableroPropio).toBeDefined();
    expect(us1.tableroRival).toBeDefined();
    expect(us2.tableroRival).toBeDefined();

    expect(us1.tableroPropio.casillas.length).toEqual(10);
    expect(us2.tableroPropio.casillas.length).toEqual(10);

    //habría que recorrer las 5 columnas
    for(x=0;x<10;x++){
      expect(us1.tableroPropio.casillas[x].length).toEqual(10);
    }
  //  expect(us2.tableroPropio.casillas[0].length).toEqual(5);
    
    //habría que recorrer todo el tablero
    expect(us1.tableroPropio.casillas[0][0].contiene.esAgua()).toEqual(true);
  });

  it("los dos jugadores tienen flota (5 barcos, tam 1,1,2, 4 y 5)",function(){
    expect(us1.flota).toBeDefined();
    expect(us2.flota).toBeDefined();
    
    expect(Object.keys(us1.flota).length).toEqual(5);
    expect(Object.keys(us2.flota).length).toEqual(5);
    
    expect(us1.flota["b1-1"].tam).toEqual(1);
    expect(us1.flota["b1-2"].tam).toEqual(1);
    expect(us1.flota["b2"].tam).toEqual(2);
    expect(us1.flota["b4"].tam).toEqual(4);
    expect(us1.flota["b5"].tam).toEqual(5);

  });

  it("la partida está en fase desplegando",function(){
    expect(partida.esJugando()).toEqual(false);
    expect(partida.esDesplegando()).toEqual(true);
  });

  describe("A jugar!",function(){
    beforeEach(function(){
      us1.colocarBarco("b1-1",0,0, "horizontal"); 
      us1.colocarBarco("b1-2",0,1, "horizontal");
      us1.colocarBarco("b2",0,2, "horizontal");
      us1.colocarBarco("b4",0,3, "horizontal");
      us1.colocarBarco("b5",0,4, "vertical");
      us1.barcosDesplegados();
      us2.colocarBarco("b1-1",0,0, "horizontal"); 
      us2.colocarBarco("b1-2",0,1, "horizontal");
      us2.colocarBarco("b2",0,2, "horizontal");
      us2.colocarBarco("b4",0,3, "horizontal");
      us2.colocarBarco("b5",0,4, "vertical");
      us2.barcosDesplegados();
    });

    it("Comprobar que las flotas están desplegadas",function(){
      expect(us1.todosDesplegados()).toEqual(true);
      expect(us2.todosDesplegados()).toEqual(true);
      expect(partida.flotasDesplegadas()).toEqual(true);
    });

    it("Comprobar jugada que Pepe gana (Comprueba orientación)",function(){
      expect(partida.turno.nick).toEqual("pepe");
      expect(us2.flota["b1-1"].estado).toEqual("intacto");
      us1.disparar(0,0);
      expect(us2.flota["b1-1"].estado).toEqual("hundido");
      us1.disparar(0,1);
      expect(us2.flota["b1-2"].estado).toEqual("hundido");


      expect(us2.flota["b2"].estado).toEqual("intacto");
      us1.disparar(0,2);
      expect(us2.flota["b2"].estado).toEqual("tocado");
      us1.disparar(1,2);
      expect(us2.flota["b2"].estado).toEqual("hundido");

      expect(us2.flota["b4"].estado).toEqual("intacto");
      us1.disparar(0,3);
      expect(us2.flota["b4"].estado).toEqual("tocado");
      us1.disparar(1,3);
      expect(us2.flota["b4"].estado).toEqual("tocado");
      us1.disparar(2,3);
      expect(us2.flota["b4"].estado).toEqual("tocado");
      us1.disparar(3,3);
      expect(us2.flota["b4"].estado).toEqual("hundido");

      
      expect(us2.flota["b5"].estado).toEqual("intacto");
      us1.disparar(0,4);
      expect(us2.flota["b5"].estado).toEqual("tocado");
      us1.disparar(0,5);
      expect(us2.flota["b5"].estado).toEqual("tocado");
      us1.disparar(0,6);
      expect(us2.flota["b5"].estado).toEqual("tocado");
      us1.disparar(0,7);
      expect(us2.flota["b5"].estado).toEqual("tocado");
      us1.disparar(0,8);
      expect(us2.flota["b5"].estado).toEqual("hundido")
      

      expect(partida.esFinal()).toEqual(true);
      expect(us2.flotaHundida()).toEqual(true);
      expect(us1.flotaHundida()).toEqual(false);
    });

    it("Comprobar el cambio de turno",function(){
      us1.disparar(6,0);
      expect(partida.turno.nick).toEqual("luis");
    });

    it("Comprobar que no deja disparar sin turno",function(){
      us2.disparar(7,1);
      expect(us1.flota["b1-1"].estado).toEqual("intacto");
    });


    it("Comprobar estado de una casilla de tablero (agua) tras un disparo",function(){
      us1.disparar(7,1);
      expect(us1.tableroPropio.casillas[7][1].contiene.esAgua()).toEqual(true);
    });

    it("Comprobar cambio de turno doble",function(){
      expect(partida.turno.nick).toEqual("pepe");
      us1.disparar(6,0);
      expect(partida.turno.nick).toEqual("luis");
      us2.disparar(6,0);
      expect(partida.turno.nick).toEqual("pepe");
      us1.disparar(7,0);
      expect(partida.turno.nick).toEqual("luis");
    });




  });
});
    
    
     


  
  
   
    
    
     
