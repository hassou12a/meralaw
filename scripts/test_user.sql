-- Create simple test user (password: test123)
INSERT INTO "User" (email, name, profession, plan, password)
VALUES ('test@meralaw.dz', 'Test User', 'avocat', 'FREE', '$2a$10$8VrN2kyouOJBuyjCu8lsuuNKFROBabFtp2pt7iHh279MdiTMHKF8y')
ON CONFLICT DO NOTHING;

SELECT email, name, plan FROM "User";