class CreateMovies < ActiveRecord::Migration[6.0]
  def change
    create_table :movies do |t|
      t.integer :movie_id
      t.string :movie_title
      t.integer :thumbs_up
      t.integer :thumbs_down

      t.timestamps
    end
  end
end
