/*
  # Create search history table

  1. New Tables
    - `search_history`
      - `id` (uuid, primary key)
      - `product_name` (text) - Name of the searched product
      - `product_brand` (text, nullable) - Brand of the product
      - `product_category` (text, nullable) - Product category
      - `location` (text) - User's search location
      - `results_count` (integer) - Number of shops found
      - `searched_at` (timestamptz) - When the search was performed
      - `created_at` (timestamptz) - Record creation timestamp

  2. Security
    - Enable RLS on `search_history` table
    - Add policy for public read access (analytics purpose)
    - Add policy for public insert access (no auth required for searches)

  3. Indexes
    - Index on `searched_at` for efficient recent searches queries
    - Index on `location` for location-based analytics
*/

CREATE TABLE IF NOT EXISTS search_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name text NOT NULL,
  product_brand text,
  product_category text,
  location text NOT NULL,
  results_count integer DEFAULT 0,
  searched_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view search history"
  ON search_history
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert search history"
  ON search_history
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_search_history_searched_at ON search_history(searched_at DESC);
CREATE INDEX IF NOT EXISTS idx_search_history_location ON search_history(location);
