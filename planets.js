var Game = "pepe";

$(function(){
  var map = $("#map");

  var Fleet = Backbone.Model.extend({
    initialize: function(){
      console.log( "Fleet.initialize", this );
      this.set( "selected", false );

      var coordinates = fleetCoordinates( this, Game.planets );

      this.set( "x", coordinates["x"] );
      this.set( "y", coordinates["y"] );
    },

    selectToogle: function(){
      if( this.get( "selected" ) ){
        this.set( "selected", false );
      } else {
        this.set( "selected", true );
      }
    },
  });

  var FleetView = Backbone.View.extend({
    template  : _.template( $('#fleet').html() ),

    attributes: {
      "class": "fleet"
    },

    events: {
      "click": "select"
    },

    select: function(){
      this.fleet.selectToogle();
    },

    initialize: function(opts){
      this.fleet = opts.fleet;
      this.fleet.on( "change:x change:y", this.updateAttributes, this );
      this.fleet.on( "change:selectable", this.updateSelectable, this );

      this.updateAttributes();
    },

    updateAttributes: function(){
      this.updatePositions();
      this.updateSelected();
    },

    updatePositions: function(){
      this.$el.css({ "left"  : this.fleet.get("x") });
      this.$el.css({ "top" : this.fleet.get("y") });
    },

    updateSelected: function(){
      if( this.fleet.get( "selected" ) ){
        this.$el.addClass( "selected" );
      } else {
        this.$el.removeClass( "selected" );
      }
    },

    render: function(){
      this.$el.html( this.template( this.fleet.toJSON() ) );
      return this;
    }
  });

  var Fleets = Backbone.Collection.extend({
    model: Fleet,

    initialize: function() {
      this.on( "change:selected", this.changeSelected );
    },

    anySelected: function(){
      var result =
        this.any( function( fleet ){
          var result = fleet.get( "selected" );
          console.log( "Fleets.anySelected", result );
          return result;
        });

      console.log( "Fleets.anySelected.result", result );

      return result;
    },

    changeSelected: function( model, val, opts ){
      if( val ){
        this.each( function( e ){
          if( e != model && e.get( "selected" ) ) {
            e.set( "selected", false );
          }
        });
      };
    },

    sync: function( method, model, options ){
      console.log( "Fleets.sync", method, model, options );
      var result = fleetsDataMock();

      options.success( result );

      return result;
    }
  });



  var Ship = Backbone.Model.extend({
    initialize: function(){
      this.set( "selected", false );
    },

    selectToogle: function(){
      if( this.get( "selected" ) ){
        this.set( "selected", false );
      } else {
        this.set( "selected", true );
      }
    },
  });

  var ShipView = Backbone.View.extend({
    tagName: 'li',
    template: _.template( $("#planet-ship").html() ),

    attributes: {
      "class": "ship"
    },

    events: {
      "click": "select"
    },

    select: function(){
      this.ship.selectToogle();
    },

    initialize: function(opts){
      this.ship = opts.ship;
      this.ship.on( "change:selected", this.updateSelected, this );
    },

    updateSelected: function(){
      if( this.ship.get( "selected" ) ){
        this.$el.addClass( "selected" );
      } else {
        this.$el.removeClass( "selected" );
      }
    },

    render: function(){
      this.$el.html( this.template( this.ship.toJSON() ) );
      return this;
    }
  });

  var Ships = Backbone.Collection.extend({
    model: Ship
  });

  var ShipsView = Backbone.View.extend({
    tagName: 'ul',

    attributes: {
      "class": "details"
    },

    initialize: function(opts){
      this.ships = opts.ships;
    },

    render: function(){
      this.ships.each( $.proxy( this.addOne, this ) );
      return this;
    },

    addOne: function( model ) {
      var view = new ShipView({ ship: model });
      this.$el.append( view.render().el );
    },

  });

  var Planet = Backbone.Model.extend({
    initialize: function(){
      console.log( "Planet.initialize", this );

      this.ships = new Ships().reset( this.get( "shipsData" ) );

      this.set( "selected", false );
    },

    selectToogle: function(){
      if( this.get( "selected" ) ){
        this.set( "selected", false );
      } else {
        this.set( "selected", true );
      }
    },
  });

  var Planets = Backbone.Collection.extend({
    model: Planet,

    initialize: function() {
      this.on( "change:selected", this.changeSelected );
      this.on( "change:creatingFleet", this.creatingFleet );
    },

    anySelected: function(){
      var result =
        this.any( function( planet ){
          var result = planet.get( "selected" );
          console.log( "Planets.anySelected", result );
          return result;
        });

      console.log( "Planets.anySelected.result", result );

      return result;
    },

    creatingFleet: function( model, val, opts ){
      console.log( "Planets.creatingFleet", val );

      this.each( function( e ){
        if( e != model ) {
          e.set( "selectable", val );
        }
      });
    },

    changeSelected: function( model, val, opts ){
      if( val ){
        this.each( function( e ){
          if( e != model && e.get( "selected" ) ) {
            e.set( "selected", false );
          }
        });
      };
    },

    sync: function( method, model, options ){
      console.log( "Planets.sync", method, model, options );
      var result = planetsDataMock();

      options.success( result );

      return result;
    }
  });

  var PlanetView = Backbone.View.extend({
    template  : _.template( $('#planet').html() ),

    attributes: {
      "class": "planet"
    },

    events: {
      "click": "select"
    },

    select: function(){
      if( this.planet.get( "selectable" ) ){
        sendFleetHere();
      } else {
        this.planet.selectToogle();
      }
    },

    sendFleetHere: function(){

    },

    initialize: function(opts){
      this.planet = opts.planet;
      this.planet.on( "change:x change:y", this.updateAttributes, this );
      this.planet.on( "change:selected", this.updateSelected, this );
      this.planet.on( "change:selectable", this.updateSelectable, this );

      this.updateAttributes();
    },

    updateAttributes: function(){
      this.updatePositions();
      this.updateSelected();
    },

    updatePositions: function(){
      this.$el.css({ "left"  : this.planet.get("x") });
      this.$el.css({ "top" : this.planet.get("y") });
    },

    updateSelected: function(){
      if( this.planet.get( "selected" ) ){
        this.$el.addClass( "selected" );
      } else {
        this.$el.removeClass( "selected" );
      }
    },

    updateSelectable: function(){
      if( this.planet.get( "selectable" ) ){
        this.$el.addClass( "selectable" );
      } else {
        this.$el.removeClass( "selectable" );
      }
    },

    render: function(){
      this.$el.html( this.template( this.planet.toJSON() ) );
      return this;
    }
  });


  var FleetInfoView = Backbone.View.extend({
    template  : _.template( $('#fleet-info').html() ),

    attributes: {
      "class": "fleet-info"
    },

    initialize: function(opts){
      console.log( "FleetInfoView.initialize", opts );

      this.fleet = opts.fleet;
      this.fleet.on( "change:selected", this.toogle, this );

      this.$el.attr( "id", "fleet-info-" + this.fleet.id );
    },

    toogle: function(){
      if( this.fleet.get( "selected" ) ){
        this.$el.css({ zIndex: 100 });
        this.$el.animate( { right: 0 }, 500 );
      } else {
        this.$el.css({ zIndex: 0 });
        this.$el.animate( { right: -400 }, 500 );
      }
    },

    render: function(){
      console.log( "FleetInfoView.render", this.fleet );

      this.$el.html( this.template( this.fleet.toJSON() ) );

      return this;
    }
  });

  var PlanetInfoView = Backbone.View.extend({
    template  : _.template( $('#planet-info').html() ),

    attributes: {
      "class": "planet-info"
    },

    events: {
      "click .create-fleet": "creatingFleet"
    },

    initialize: function(opts){
      console.log( "PlanetInfoView.initialize", opts );

      this.planet = opts.planet;
      this.planet.on( "change:selected", this.toogle, this );

      this.$el.attr( "id", "planet-info-" + this.planet.id );

      this.shipsView = new ShipsView({ ships: this.planet.ships });
    },

    creatingFleet: function(){
      console.log( "PlanetInfoView.creatingFleet" );
      this.planet.set( "creatingFleet", true );
    },

    toogle: function(){
      if( this.planet.get( "selected" ) ){
        this.$el.css({ zIndex: 100 });
        this.$el.animate( { right: 0 }, 500 );
      } else {
        this.$el.css({ zIndex: 0 });
        this.$el.animate( { right: -400 }, 500 );
      }
    },

    render: function(){
      console.log( "PlanetInfoView.render" );

      this.$el.html( this.template( this.planet.toJSON() ) );

      this.$el.find( ".navy" ).append( this.shipsView.render().el );


      return this;
    }
  });

  var MapView = Backbone.View.extend({
    el: "#map",

    initialize: function(opts){
      console.log( "MapView.initialize" );

      this.planets = opts.planets;
      this.planets.bind( 'reset', this.addAllPlanets, this );

      this.fleets = opts.fleets;
      this.fleets.bind( 'reset', this.addAllFleets, this );
    },

    addOnePlanet: function( model ) {
      var view = new PlanetView({ planet: model });
      this.$el.append( view.render().el );
    },

    addOneFleet: function( model ) {
      var view = new FleetView({ fleet: model });
      this.$el.append( view.render().el );
    },

    addAllPlanets: function() {
      this.planets.each( $.proxy( this.addOnePlanet, this ) );
    },

    addAllFleets: function() {
      this.fleets.each( $.proxy( this.addOneFleet, this ) );
    },
  });

  var InfoPanelView = Backbone.View.extend({
    el: "#info-panel",

    initialize: function(opts){
      this.planets = opts.planets;
      this.planets.bind( 'reset', this.addAllPlanets, this );

      this.fleets = opts.fleets;
      this.fleets.bind( 'reset', this.addAllFleets, this );
    },

    addOnePlanet: function( model ) {
      var view = new PlanetInfoView({ planet: model });
      this.$el.append( view.render().el );
    },

    addOneFleet: function( model ) {
      console.log( "InfoPanelView.addOneFleet", model );
      var view = new FleetInfoView({ fleet: model });
      this.$el.append( view.render().el );
    },

    addAllPlanets: function() {
      this.planets.each( $.proxy( this.addOnePlanet, this ) );
    },

    addAllFleets: function() {
      this.fleets.each( $.proxy( this.addOneFleet, this ) );
    },
  });

  var GameView = Backbone.View.extend({
    initialize: function(){
      console.log( "GameView.initialize" );

      this.data = data;
      this.planets = new Planets();
      this.fleets = new Fleets();

      this.map = new MapView({
        planets: this.planets,
        fleets: this.fleets,
      });

      this.infoPanel = new InfoPanelView({
        planets: this.planets,
        fleets: this.fleets,
      });

      console.log( "GameView.initialize END" );
    }
  });




  Game = new GameView();
  Game.planets.reset( data.planets );
  Game.fleets.reset( data.fleets );



});