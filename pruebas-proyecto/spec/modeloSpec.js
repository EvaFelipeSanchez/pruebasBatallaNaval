describe("El juego...", function() {
    var miJuego;
    var usr1, usr2;
    
  
    beforeEach(function() {
        miJuego = new Juego();
        miJuego.agregarUsuario("pepe");
        miJuego.agregarUsuario("luis");
        let res= miJuego.jugadorCreaPartida("pepe");
        miJuego.jugadorSeUneAPartida("luis", res.codigo);
        let us1=miJuego.obtenerUsuario("pepe");
        let us2=miJuego.obtenerUsuario("luis");
        let partida=miJuego.obtenerPartida(res.codigo);
      
    });
  
    //Tests
    it("inicialmente", function() {	
       let lista = miJuego.obtenerPartidas();
       expect(lista.length).toEqual(0);
       expect(us1.nick).toEqual("pepe");
       expect(us2.nick).toEqual("luis");
       
       //Comprobar que los usuarios están en la partida
       //Comprobar que cada usuario tiene 2 tableros de 5x5
       //que contienen agua (método esAgua)
       //comprobar que cada usuario tiene 1 flota de 2 barcos
       //de tamaño 4 y 2
       //comprobar que la partida esta en fase jugando 
       // 
    });

    it("usuariosenpartida", function(){
        let codigo= us1.crearPartida();
        expect(miJuego.partidas[codigo]).toBeDefined();
        let partida= miJuego.partidas[codigo];
        expect(partida.owner.nick).toEqual(us1.nick);
        expect(partida.jugadores[0].nick).toEqual(us1.nick);
        expect(partida.codigo).toEqual(codigo);
  
    });

    it("los dos jugadores tienen tablero propio y rival", function(){
        expect(us1.tableroPropio).toBeDefined();
        expect(us2.tableroPropio).toBeDefined();
        expect(us1.tableroRival).toBeDefined();
        expect(us2.tableroRival).toBeDefined();

        expect(us1.tableroPropio.casillas.length).toEqual(5);
        expect(us2.tableroPropio.casillas.length).toEqual(5);


        //habría que recorrer las 5 columnas con un bucle for
        for (x=0; x < 5; x++){
            expect(us1.tableroPropio.casillas[x].length).toEqual(5);
        }
        
        //expect(us1.tableroPropio.casillas[0].length).toEqual(5);
        expect(us2.tableroPropio.casillas[0].length).toEqual(5);

    });

    it("los dos jugadores tienen flota", function(){
        expect(us1.flota).toBeDefined();
        expect(us2.flota).toBeDefined();
        expect(us1.flota.length).toEqual(2);
        expect(us2.flota.length).toEqual(2);

        expect(us1.flota[0].tam).toEqual(2);      
        expect(us1.flota[1].tam).toEqual(4); 
    });


    if("la partida está en fase jugando", function(){
        expect(partida.esJugando().toBeTrue());

    });
    
    if("la casilla contiene Agua", function(){

    });


    
    
     
  
   
  });
  