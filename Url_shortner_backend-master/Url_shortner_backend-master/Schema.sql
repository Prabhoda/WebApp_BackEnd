CREATE TABLE users (id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,email TEXT NOT NULL,password TEXT NOT NULL);


INSERT INTO users(email, password) VALUES('hodo@gmail.com','admin');

select * from users;


CREATE TABLE shorturls (
    id SERIAL PRIMARY KEY,
    original_url TEXT NOT NULL,
    short_url TEXT NOT NULL,
    user_id UUID,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    expiration_time TIMESTAMPTZ,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO shorturls (original_url, short_url, user_id, expiration_time) VALUES ('https://google.com','shorturl',user_id,CURRENT_TIMESTAMP + INTERVAL '48 hours');