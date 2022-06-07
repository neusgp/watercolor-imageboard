DROP TABLE IF EXISTS comments;

DROP TABLE IF EXISTS images;

CREATE TABLE images(
    id SERIAL PRIMARY KEY,
    url VARCHAR NOT NULL,
    username VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://mywatercolorimageboard.s3.eu-central-1.amazonaws.com/1.png',
    'neus',
    'Eye',
    'Watercolor 6x6cm'
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://mywatercolorimageboard.s3.eu-central-1.amazonaws.com/2.png',
    'neus',
    'Saturn',
    'Watercolor 6x6cm'
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://mywatercolorimageboard.s3.eu-central-1.amazonaws.com/3.png',
    'neus',
    'Clouds',
    'Watercolor 6x6cm'
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://mywatercolorimageboard.s3.eu-central-1.amazonaws.com/4.png',
    'neus',
    'Stripes',
    'Watercolor 6x6cm'
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://mywatercolorimageboard.s3.eu-central-1.amazonaws.com/5.png',
    'neus',
    'Footprints',
    'Watercolor 6x6cm'
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://mywatercolorimageboard.s3.eu-central-1.amazonaws.com/6.png',
    'neus',
    'Sand',
    'Watercolor 6x6cm'
);

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    comment VARCHAR (200) NOT NULL,
    image_id INTEGER NOT NULL REFERENCES images (id),
    username VARCHAR (40) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);