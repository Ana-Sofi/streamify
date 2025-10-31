SET search_path TO streamify;

-- ===== Genres =====
INSERT INTO Genre (genre_id, genre_name) VALUES
(1, 'Drama'),
(2, 'Action'),
(3, 'Comedy'),
(4, 'Sci-Fi'),
(5, 'Horror'),
(6, 'Fantasy'),
(7, 'Thriller'),
(8, 'Crime'),
(9, 'Animation'),
(10, 'Adventure'),
(11, 'Romance'),
(12, 'Mystery')
ON CONFLICT DO NOTHING;

-- ===== Staff Members =====
INSERT INTO Staff_Member (staff_member_id, name, last_name) VALUES
(1, 'Leonardo', 'DiCaprio'),
(2, 'Joseph', 'Gordon-Levitt'),
(3, 'Elliot', 'Page'),
(4, 'Christopher', 'Nolan'),

(5, 'Keanu', 'Reeves'),
(6, 'Laurence', 'Fishburne'),
(7, 'Carrie-Anne', 'Moss'),
(8, 'Lana', 'Wachowski'),

(9, 'Robert', 'Downey Jr.'),
(10, 'Chris', 'Evans'),
(11, 'Scarlett', 'Johansson'),
(12, 'Joss', 'Whedon'),

(13, 'Matt', 'Damon'),
(14, 'Emily', 'Blunt'),
(15, 'Ridley', 'Scott'),

(16, 'Tom', 'Hanks'),
(17, 'Robin', 'Wright'),
(18, 'Robert', 'Zemeckis'),

(19, 'Christian', 'Bale'),
(20, 'Heath', 'Ledger'),
(21, 'Aaron', 'Eckhart'),

(23, 'James', 'McAvoy'),

(24, 'Natalie', 'Portman'),
(25, 'Mila', 'Kunis'),
(26, 'Darren', 'Aronofsky'),

(27, 'Brad', 'Pitt'),
(28, 'Edward', 'Norton'),
(29, 'David', 'Fincher')
ON CONFLICT DO NOTHING;

-- ===== Movies =====
INSERT INTO Movie (movie_id, name, description, view_count, score_average) VALUES
(1, 'Inception', 'Dream-within-a-dream heist thriller.', 0, 0),
(2, 'The Matrix', 'A hacker discovers reality is a simulation.', 0, 0),
(3, 'Avengers', 'Earth''s mightiest heroes unite.', 0, 0),
(4, 'The Martian', 'Astronaut stranded on Mars.', 0, 0),
(5, 'Forrest Gump', 'Life of a simple man with a big heart.', 0, 0),
(6, 'The Dark Knight', 'Batman faces the Joker.', 0, 0),
(7, 'Split', 'Man with 23 personalities.', 0, 0),
(8, 'Glass', 'Superhuman trilogy finale.', 0, 0),
(9, 'Black Swan', 'Ballerina loses grip on reality.', 0, 0),
(10, 'Fight Club', 'Insomniac forms underground club.', 0, 0),
(11, 'Harry Potter', 'Wizard boy attends magical school.', 0, 0),
(12, 'Interstellar', 'Space travel to save humanity.', 0, 0),
(13, 'Dune', 'Noble family battles destiny on desert world.', 0, 0),
(14, 'Tenet', 'Time inversion espionage.', 0, 0),
(15, 'The Prestige', 'Magicians rivalry turns deadly.', 0, 0),
(16, 'Blade Runner 2049', 'Replicant hunts secrets of his past.', 0, 0),
(17, 'The Sinner', 'Man plays dual roles in same film.', 0, 0),
(18, 'Pulp Fiction', 'Nonlinear crime classic.', 0, 0),
(19, 'Shrek', 'Ogre saving princess.', 0, 0),
(20, 'Finding Nemo', 'Fish father searches for son.', 0, 0),
(21, 'Toy Story', 'Toys come to life.', 0, 8.3),
(22, 'Minions', 'Yellow creatures serve new villain.', 0, 0),
(23, 'The Godfather', 'Crime family saga.', 0, 0),
(24, 'Joker', 'Failed comedian turns violent.', 0, 0),
(25, 'Whiplash', 'Music student learns obsession.', 0, 0),
(26, 'La La Land', 'Musical romance in LA.', 0, 0),
(27, 'Parasite', 'Class war thriller.', 0, 8.6),
(28, 'The Revenant', 'Frontier survival revenge.', 0, 0),
(29, 'Mad Max: Fury Road', 'Post-apocalyptic chase.', 0, 0),
(30, 'Her', 'Man falls for AI.', 0, 8.0)
ON CONFLICT DO NOTHING;

-- ===== Movie Genres (Movie_Genre) =====
INSERT INTO Movie_Genre(movie_id, genre_id) VALUES
-- Inception
(1,1), (1,4), (1,7),
-- Matrix
(2,2), (2,4),
-- Avengers
(3,2), (3,10),
-- Martian
(4,4), (4,1),
-- Forrest Gump
(5,1), (5,11),
-- Dark Knight
(6,2), (6,7), (6,8),
-- Split
(7,5), (7,7),
-- Glass
(8,4), (8,7),
-- Black Swan
(9,1), (9,5),
-- Fight Club
(10,7), (10,8),
-- Harry Potter
(11,6), (11,10),
-- Interstellar
(12,4), (12,1),
-- Dune
(13,4), (13,10),
-- Tenet
(14,2), (14,4),
-- Prestige
(15,1), (15,12),
-- Blade Runner
(16,4), (16,7),
-- The Sinner (double role concept)
(17,7), (17,12),
-- Pulp Fiction
(18,8), (18,7),
-- Shrek
(19,9), (19,3), (19,10),
-- Nemo
(20,9), (20,10),
-- Toy Story
(21,9), (21,3),
-- Minions
(22,9), (22,3),
-- Godfather
(23,8), (23,1),
-- Joker
(24,1), (24,7),
-- Whiplash
(25,1), (25,12),
-- La La Land
(26,3), (26,11),
-- Parasite
(27,1), (27,7),
-- Revenant
(28,1), (28,10),
-- Fury Road
(29,2), (29,10),
-- Her
(30,1), (30,4)
ON CONFLICT DO NOTHING;


-- ===== Movie Staff =====
INSERT INTO Movie_Staff (movie_staff_id, role_name, movie_id, staff_member_id) VALUES
-- Inception
(1,'Actor - Cobb',1,1),
(2,'Actor - Arthur',1,2),
(3,'Actor - Ariadne',1,3),
(4,'Director',1,4),
-- The Matrix
(5,'Actor - Neo',2,5),
(6,'Actor - Morpheus',2,6),
(7,'Actor - Trinity',2,7),
(8,'Director',2,8),
-- Avengers
(9,'Actor - Iron Man',3,9),
(10,'Actor - Captain America',3,10),
(11,'Actor - Black Widow',3,11),
(12,'Director',3,12),
-- The Martian
(13,'Actor - Watney',4,13),
(14,'Actor - Lewis',4,14),
(15,'Director',4,15),
-- Forrest Gump
(16,'Actor - Forrest',5,16),
(17,'Actor - Jenny',5,17),
(18,'Director',5,18),
-- The Dark Knight
(19,'Actor - Batman',6,19),
(20,'Actor - Joker',6,20),
(21,'Actor - Dent',6,21),
(22,'Director',6,4),
-- Split (multi-role character)
(23,'Actor - Kevin Crumb',7,23),
(24,'Actor - Patricia/Beast',7,23),
(25,'Actor - Kevin Crumb',8,23),
-- Black Swan
(26,'Actor - Nina',9,24),
(27,'Actor - Lily',9,25),
(28,'Director',9,26),
-- Fight Club
(29,'Actor - Tyler Durden',10,27),
(30,'Actor - Narrator',10,28),
(31,'Director',10,29)
ON CONFLICT DO NOTHING;

-- Reset autoincrement id serial sequence
SELECT setval(
    pg_get_serial_sequence('Movie', 'movie_id'),
    COALESCE((SELECT MAX(movie_id) FROM Movie), 0) + 1,
    false
);
SELECT setval(
    pg_get_serial_sequence('Genre', 'genre_id'),
    COALESCE((SELECT MAX(genre_id) FROM Genre), 0) + 1,
    false
);
SELECT setval(
    pg_get_serial_sequence('Staff_Member', 'staff_member_id'),
    COALESCE((SELECT MAX(staff_member_id) FROM Staff_Member), 0) + 1,
    false
);
SELECT setval(
    pg_get_serial_sequence('Movie_Staff', 'movie_staff_id'),
    COALESCE((SELECT MAX(movie_staff_id) FROM Movie_Staff), 0) + 1,
    false
);


