class Game
  attr_reader :planets, :fleets

  def initialize
    @planets = JSON.parse( File.read( "#{File.dirname(__FILE__)}/../db/planets.json" ) )
    @fleets = JSON.parse( File.read( "#{File.dirname(__FILE__)}/../db/fleets.json" ) )
  end

  def fleets_next_id
    @fleets.map{ |e| e["id"] }.max.to_i + 1
  end

  def save_fleet( fleet_hash )
    puts "XXX: fleet_hash: #{fleet_hash}"

    fleet_simplified_hash = {
      "id" =>             fleets_next_id,
      "name" =>           "F00#{fleets_next_id}",
      "origin_id" =>      fleet_hash["origin_id"],
      "destination_id" => fleet_hash["destination_id"],
      "percent" =>        "0",
      "shipsData" =>      fleet_hash["shipsData"].map { |e| { "id" => e["id"], "name" => e["name"] } }
    }

    @fleets << fleet_simplified_hash

    File.open( "#{File.dirname(__FILE__)}/../db/fleets.json", "w" ) do |f|
      f.write JSON.pretty_generate( fleets )
    end

    return fleet_simplified_hash
  end
end