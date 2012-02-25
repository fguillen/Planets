var planet1;
var planet1View;

function random(num){
  return Math.floor( Math.random() * num );
};

function planetsDataMock(){
  var result =
    _.map(
      [1, 2, 3, 4, 5, 6],
      function(num){
        var planetData = {
          name: "X22" + num,
          x: (random(400) + 50),
          y: (random(400) + 50),
          level: random(10),
          production: random(100),
        }

        return planetData;
      }
    );

  return result;
};

$(function(){
  _.templateSettings = {
    interpolate : /\{\{(.+?)\}\}/g
  };

  var map = $("#map");

  var Planet = Backbone.Model.extend({
    selected: false,

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

  var PlanetInfoView = Backbone.View.extend({
    template  : _.template( $('#planet-info').html() ),

    attributes: {
      "style": "display:none;"
    },

    initialize: function(opts){
      this.planet = opts.planet;
      this.planet.on( "change:selected", this.toogle, this );
    },

    toogle: function(){
      if( this.planet.get( "selected" ) ){
        this.$el.show();
      } else {
        this.$el.hide();
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