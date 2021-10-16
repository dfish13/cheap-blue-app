CREATE TABLE IF NOT EXISTS users (
    id SERIAL,
    uname VARCHAR(250) UNIQUE NOT NULL,
    pw_hash VARCHAR(250) NOT NULL, 
    is_admin BOOLEAN DEFAULT FALSE,
    session_data JSON,
    PRIMARY KEY (id)
);

INSERT INTO users (uname, pw_hash, is_admin)
VALUES ('admin', '$2a$10$a5KN/rJzzjX/h77r0E5W/eNE1On9LxyJGpmFMu/H9f91/gPnZSPI6', TRUE);
INSERT INTO users (uname, pw_hash)
VALUES ('duncanfish', '$2a$10$cvaJQqxZ6KY0ht3husTk/O.zn/bnGml2LpGO3skIGLhMX5wlvMUc2');

CREATE TABLE IF NOT EXISTS games (
    id SERIAL,
    user_id INT NOT NULL,
    user_color CHAR(5) NOT NULL,
    pgn TEXT,
    result CHAR(4),
    PRIMARY KEY (id),

    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS moves (
    id SERIAL,
    game_id INT NOT NULL,
    user_id INT NOT NULL,
    move_number INT NOT NULL,
    color CHAR(5) NOT NULL,
    move_text VARCHAR(20) NOT NULL,
    PRIMARY KEY (id, game_id, user_id), 

    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users(id),
    
    CONSTRAINT fk_game
        FOREIGN KEY (game_id)
        REFERENCES games(id)
);