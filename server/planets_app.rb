require 'sinatra/base'

class PlanetsApp < Sinatra::Base
  set :sessions, true
  set :foo, 'bar'

  get '/fleets' do
    headers( "Access-Control-Allow-Origin" => "*" )
    content_type :json
    File.read( "#{File.dirname(__FILE__)}/db/fleets.json" )
  end

  get '/planets' do
    headers( "Access-Control-Allow-Origin" => "*" )
    content_type :json
    File.read( "#{File.dirname(__FILE__)}/db/planets.json" )
  end
end