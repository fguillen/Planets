class Game
  attr_reader :planets, :fleets

  def initialize
    @planets = JSON.parse( File.read( "#{File.dirname(__FILE__)}/../db/planets.json" ) )
    @fleets = JSON.parse( File.read( "#{File.dirname(__FILE__)}/../db/fleets.json" ) )
  end

  def save_fleet( fleet_hash )
    fleet_simplified_hash = {
      "id" =>             "4",
      "name" =>           "F004",
      "origin_id" =>      fleet_hash["origin_id"],
      "destination_id" => fleet_hash["destination_id"],
      "percent" =>        "0",
      "shipsData" =>      fleet_hash["shipsData"].map { |e| { "id" => e["id"], "name" => e["name"] } }
    }

    @fleets << fleet_simplified_hash

    File.open( "#{File.dirname(__FILE__)}/../db/fleets.json", "w" ) do |f|
      f.write fleets.to_json
    end

    return fleet_simplified_hash
  end
end