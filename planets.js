var planet1;
var planet1View;

function random(num){
  return Math.floor( Math.random() * num );
};

function planetsDataMock(){
  var result =
    _.map(
      [1, 2, 3, 4, 5, 6],
      planetDataMock
    );

  return result;
};

function planetDataMock(){
  var data = {
    id:           random(400),
    name:         ("X22" + random(9)),
    x:            (random(400) + 50),
    y:            (random(400) + 50),
    level:        random(10),
    production:   random(100),
    shipsData:    shipsDataMock()
  }

  return data;
}

function shipsDataMock(){
  var result =
    _.map(
      [1, 2, 3, 4],
      shipDataMock
    );

  return result;
};

function shipDataMock(){
  var data = {
    id:   random(400),
    name: ("S22" + random(9))
  }

  return data;
}

$(function(){
  // _.templateSettings = {
  //   interpolate : /\{\{(.+?)\}\}/g
  // };

  var map = $("#map");

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

      console.log( "ShipView.render END", this.$el );
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

    changeSelected: function( model, val, options ){
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
      this.planet.selectToogle();
    },

    initialize: function(opts){
      this.planet = opts.planet;
      this.planet.on( "change:x change:y", this.updateAttributes, this );
      this.planet.on( "change:selected", this.updateSelected, this );

      this.updateAttributes();
    },

    updateAttributes: function(){
      this.updatePositions();
      this.updateSelected();
    },

    updatePositions: function(){
      this.$el.css({ "top"  : this.planet.get("x") });
      this.$el.css({ "left" : this.planet.get("y") });
    },

    updateSelected: function(){
      if( this.planet.get( "selected" ) ){
        this.$el.addClass( "selected" );
      } else {
        this.$el.removeClass( "selected" );
      }
    },

    render: function(){
      this.$el.html( this.template( this.planet.toJSON() ) );
      return this;
    }
  });

  var PlanetInfoView = Backbone.View.extend({
    template  : _.template( $('#planet-info').html() ),

    attributes: {
      "class": "planet-info"
    },

    event: {
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
      this.planets.bind( 'reset', this.addAll, this );
    },

    addOne: function( model ) {
      var view = new PlanetView({ planet: model });
      this.$el.append( view.render().el );
    },

    addAll: function() {
      console.log( "MapView.addAll" );

      this.planets.each( $.proxy( this.addOne, this ) );
    },
  });

  var InfoPanelView = Backbone.View.extend({
    el: "#info-panel",

    initialize: function(opts){
      this.planets = opts.planets;
      this.planets.bind( 'reset', this.addAll, this );
    },

    addOne: function( model ) {
      var view = new PlanetInfoView({ planet: model });
      this.$el.append( view.render().el );
    },

    addAll: function() {
      this.planets.each( $.proxy( this.addOne, this ) );
    },
  });

  var GameView = Backbone.View.extend({
    initialize: function(){
      console.log( "GameView.initialize" );

      this.planets = new Planets({});
      this.map = new MapView({
        planets: this.planets,
      });

      this.infoPanel = new InfoPanelView({
        planets: this.planets,
      });

      this.planets.fetch();
    }
  });




  var game = new GameView();



});