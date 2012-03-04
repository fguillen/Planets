require "sinatra/base"
require "json"
require_relative "lib/game"

class PlanetsApp < Sinatra::Base
  game = Game.new
  set :sessions, true

  before do
    headers(
      'Access-Control-Allow-Origin'       => "*",
      'Access-Control-Allow-Methods'      => "POST, GET, OPTIONS, PUT, DELETE",
      'Access-Control-Allow-Headers'      => "*",
      'Access-Control-Max-Age'            => "1728000",
      'Access-Control-Allow-Headers'      => "Content-Type"
    )
  end



  get '/fleets' do
    puts "XXX: fleets"
    # headers( "Access-Control-Allow-Origin" => "*" )
    content_type :json
    game.fleets.to_json
  end

  get '/planets' do
    # cross_origin
    content_type :json
    game.planets.to_json
  end

  post "/fleets" do
    puts "XXX: params: #{params}"
    # puts "XXX: request.env['rack.input'].read: #{request.env["rack.input"].read}"
    fleet = game.save_fleet( JSON.parse( request.env["rack.input"].read ) )

    fleet.to_json
  end
end