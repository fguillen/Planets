var planet1;
var planet1View;

function random(num){
  return Math.floor( Math.random() * num );
}

$(function(){
  var map = $("#map");

  var Planet = Backbone.Model.extend({});

  var PlanetView = Backbone.View.extend({
    tagName: "div",
    attributes: {
      class: "planet"
    },

    initialize: function(opts){
      this.model = new Planet(opts);
      map.append( $(this.el) );
      this.model.on( "change:x change:y", this.render, this )
    },

    render: function(){
      console.log( "render" );
      $(this.el).css({ "top"  : this.model.get("x") });
      $(this.el).css({ "left" : this.model.get("y") });
    }
  });

  planet1 = new Planet({
  });

  planet1View = new PlanetView({
    name: "X22" + random(9),
    x: (random(400) + 50),
    y: (random(400) + 50),
  });

  planet1View.render();

  var planets = [];

  _.each(
    [1, 2, 3, 4, 5, 6],
    function(num){
      var planet = new PlanetView({
        name: "X22" + num,
        x: (random(400) + 50),
        y: (random(400) + 50),
      });

      planet.render();
    }
  );

});