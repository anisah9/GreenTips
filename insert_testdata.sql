# Select the database
USE greentips;

-- Insert test data into the 'users' table
INSERT INTO users (email, firstName, lastName, username, password)
VALUES
  ('john@gmail.com', 'John', 'Doe', 'johndoe123', '$2b$10$ZDmgmjtS.82SA4YfN2aJautcgRYEg7JU9CcePsCN.5N.sedyL8QpG'),
  ('jane@outlook.com', 'Jane', 'Doe', 'janedoe456', '$2b$10$GTd..041NHyH23w2wdGssex0KEVx1zfrv7ZjVIVzrJ9IR73gYmmKq'),
  ('bob@gmail.com', 'Bob', 'Smith', 'bobsmith789', '$2b$10$A1BMTAEDRd.eDFExAXzhme5Cx/XCkY61KDbxUrDtnIREBmDql/tra'),
  ('alice@outlook.com', 'Alice', 'Johnson', 'ajohnson789', '$2b$10$DjkH4vsjRAqsYHVYxbDdU.HqYTE/LuhfLSJcbforBhxH7A.USbxjO'),
  ('david@gmail.com', 'David', 'Lee', 'dlee456', '$2b$10$/QZjaC48D5jFLF6QHQHrPOFDpKMYsavNUfo4XVjlpjvDtuI7E9F7u'),
  ('emily@gmail.com', 'Emily', 'Wilson', 'ewilson123', '$2b$10$pIcnlfYLsix78f8s.oKeQOMdZ6jdOllqa1ejCwLhQx0LcCmeuHLW.');

-- Insert test data into the 'tips' table for specific categories
INSERT INTO tips (category, text, link, userID, created_at, upvotes, keywords)
VALUES
  ('Home', 'Create a cozy atmosphere at home with warm lighting.', 'https://www.homecozytips.com', 1, '2023-12-06 15:00:00', 2, 'home, cozy, atmosphere'),
  ('Home', 'Organize your living space for improved functionality.', 'https://www.homeorganization.com', 2, '2023-12-06 15:30:00', 2, 'home, organization, functionality'),

  ('Transportation', 'Save fuel by maintaining proper tire pressure.', 'https://www.fuelsavingtips.com', 3, '2023-12-06 16:00:00', 2, 'transportation, fuel, tires'),
  ('Transportation', 'Explore eco-friendly transportation options.', 'https://www.ecofriendlytransport.com', 4, '2023-12-06 16:30:00', 2, 'transportation, eco-friendly'),

  ('Food', 'Try a new recipe for a healthy and delicious meal.', 'https://www.healthymealrecipes.com', 5, '2023-12-06 17:00:00', 2, 'food, recipe, healthy'),
  ('Food', 'Reduce food waste by planning your meals effectively.', 'https://www.reducefoodwaste.com', 6, '2023-12-06 17:30:00', 2, 'food, waste reduction, meal planning'),

  ('Recycling', 'Learn the importance of recycling electronic waste.', 'https://www.electronicrecyclingtips.com', 1, '2023-12-06 18:00:00', 2, 'recycling, electronic waste'),
  ('Recycling', 'Create a DIY project using recycled materials.', 'https://www.recycleddiyprojects.com', 2, '2023-12-06 18:30:00', 2, 'recycling, DIY, recycled materials'),

  ('Clothing and Fashion', 'Organize your wardrobe for a clutter-free look.', 'https://www.organizedwardrobe.com', 3, '2023-12-06 19:00:00', 2, 'clothing, fashion, organization'),
  ('Clothing and Fashion', 'Explore sustainable fashion brands for ethical choices.', 'https://www.sustainablefashionbrands.com', 4, '2023-12-06 19:30:00', 2, 'clothing, fashion, sustainability'),

  ('Gardening', 'Grow your own herbs in a small indoor garden.', 'https://www.indoorgardeningtips.com', 5, '2023-12-06 20:00:00', 2, 'gardening, herbs, indoor garden'),
  ('Gardening', 'Compost kitchen scraps for nutrient-rich soil.', 'https://www.compostingtips.com', 6, '2023-12-06 20:30:00', 2, 'gardening, compost, soil nutrients'),

  ('Technology', 'Stay secure online with strong and unique passwords.', 'https://www.passwordsecuritytips.com', 1, '2023-12-06 21:00:00', 2, 'technology, security, passwords'),
  ('Technology', 'Explore the latest advancements in wearable technology.', 'https://www.wearabletechnews.com', 2, '2023-12-06 21:30:00', 2, 'technology, wearable tech, advancements'),

  ('Travel', 'Plan a budget-friendly weekend getaway to relax.', 'https://www.budgettravelgetaway.com', 3, '2023-12-06 22:00:00', 2, 'travel, budget-friendly, weekend getaway'),
  ('Travel', 'Discover hidden gems in your own city for a unique adventure.', 'https://www.cityexplorationtips.com', 4, '2023-12-06 22:30:00', 2, 'travel, city exploration'),

  ('General Tips', 'Practice mindfulness for a healthier and happier life.', 'https://www.mindfulnesstips.com', 5, '2023-12-06 23:00:00', 2, 'general tips, mindfulness, health'),
  ('General Tips', 'Stay hydrated throughout the day for optimal well-being.', 'https://www.hydrationwellness.com', 6, '2023-12-06 23:30:00', 2, 'general tips, hydration, well-being');
