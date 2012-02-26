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
    name: ("X22" + random(9)),
    x: (random(400) + 50),
    y: (random(400) + 50),
    level: random(10),
    production: random(100),
    ships: shipssDataMock()
  }

  return data;
}

function shipssDataMock(){
  var result =
    _.map(
      [1, 2, 3, 4],
      shipDataMock
    );

  return result;
};

function shipDataMock(){
  var data = {
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

  });

  var Ships = Backbone.Model.extend({
    model: Ship
  })

  var Planet = Backbone.Model.extend({
    initialize: function(){
      this.set( "selected", false );
      this.set( "creatingFloat", false );
    },

    selectToogle: function(){
      if( this.get( "selected" ) ){
        this.set( "selected", false );
        this.set( "creatingFloat", false );
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
            e.set( "creatingFloat", false );
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
    tagName: "div",
    attributes: {
      class: "planet"
    },

    events: {
      "click": "select"
    },

    select: function(){
      this.planet.selectToogle();
    },

    initialize: function(opts){
      this.planet = opts.planet;
      this.planet.on( "change:x change:y", this.render, this )
      this.planet.on( "change:selected", this.render, this )
    },

    render: function(){
      console.log( "PlanetView.render" );
      console.log( "PlanetView.render.planet", this.planet );

      // position
      this.$el.css({ "top"  : this.planet.get("x") });
      this.$el.css({ "left" : this.planet.get("y") });

      // selected
      if( this.planet.get( "selected" ) ){
        this.$el.addClass( "selected" );
      } else {
        this.$el.removeClass( "selected" );
      }

      return this;
    }
  });

  var PlanetCreatingFleetView = Backbone.View.extend({
    template  : _.template( $('#planet-creating-fleet').html() ),

    attributes: {
      "class": "planet-creating-fleet",
    },


  });

  var PlanetInfoView = Backbone.View.extend({
    template  : _.template( $('#planet-info').html() ),

    attributes: {
      "class": "planet-info",
    },

    event: {
      "click .create-fleet": "creatingFleet"
    },

    initialize: function(opts){
      this.planet = opts.planet;
      this.planet.on( "change:selected", this.toogle, this );
    },

    creatingFleet: function(){
      this.planet.set( "creatingFleet", true );
    },

    toogle: function(){
      if( this.planet.get( "selected" ) ){
        this.$el.animate( { right: 0 }, 500 );
      } else {
        this.$el.animate( { right: -300 }, 500 );
      }
    },

    render: function(){
      console.log( "PlanetInfoView.render" );

      this.$el.html( this.template( this.planet.toJSON() ) );

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