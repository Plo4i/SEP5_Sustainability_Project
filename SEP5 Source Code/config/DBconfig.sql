SHOW search_path;
SET search_path TO EcoEval;

DROP TABLE IF EXISTS Users CASCADE ;

CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    image_url VARCHAR(100),
    username VARCHAR(100),
    password VARCHAR(100),
    email VARCHAR(100),
    subscription_status VARCHAR(100),
    registration_date TIMESTAMP
);

DROP TABLE IF EXISTS Companies CASCADE ;

CREATE TABLE Companies (
    cvr INT PRIMARY KEY,
    name VARCHAR(100),
    website VARCHAR(100),
    email VARCHAR(100),
    image_url VARCHAR(100),
    industry VARCHAR(100)
);


DROP TABLE IF EXISTS ESG_score CASCADE ;

CREATE TABLE ESG_score (
    score_id SERIAL PRIMARY KEY,
    user_id SERIAL REFERENCES Users(id),
    company_id INT REFERENCES Companies(cvr),
    environmental_s DOUBLE PRECISION,
    social_s DOUBLE PRECISION,
    governance_s DOUBLE PRECISION,
    total_score DOUBLE PRECISION GENERATED ALWAYS AS
        ((environmental_s + social_s + governance_s)/3) STORED,
    date_created TIMESTAMP
);

DROP TABLE IF EXISTS Rate CASCADE ;

CREATE TABLE Rate (
    id SERIAL PRIMARY KEY,
    liked VARCHAR(50),
    comment TEXT,
    company_id INT REFERENCES Companies(cvr),
    user_id SERIAL REFERENCES Users(id)
);

CREATE VIEW Avg_ESG_Scores AS
SELECT ESG_score.company_id, AVG(ESG_score.total_score) as avgScore
FROM ESG_score
GROUP BY ESG_score.company_id;
