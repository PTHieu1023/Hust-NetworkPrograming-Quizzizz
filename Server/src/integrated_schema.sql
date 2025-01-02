-- Users table
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL
);

CREATE INDEX idx_users_username ON users(username);

-- Session table 
CREATE TABLE IF NOT EXISTS session (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_session_user_id ON session(user_id);

-- Tests table (thay thế cho quiz)
CREATE TABLE IF NOT EXISTS tests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    author_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    is_private BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tests_author ON tests(author_id);
CREATE INDEX idx_tests_name ON tests(name);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    type VARCHAR(50),
    is_public BOOLEAN DEFAULT true,
    author_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE
);

-- Test questions mapping
CREATE TABLE IF NOT EXISTS test_questions (
    test_id INTEGER REFERENCES tests(id) ON DELETE CASCADE,
    question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
    PRIMARY KEY (test_id, question_id)
);

-- Question answers table
CREATE TABLE IF NOT EXISTS question_answers (
    id SERIAL PRIMARY KEY,
    question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_true BOOLEAN DEFAULT false
);

-- Rooms table 
CREATE TABLE IF NOT EXISTS rooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    test_id INTEGER REFERENCES tests(id) ON DELETE CASCADE,
    host_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    is_practice BOOLEAN DEFAULT false,
    is_private BOOLEAN DEFAULT false, 
    created_at TIMESTAMP NOT NULL,
    closed_at TIMESTAMP NOT NULL,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_rooms_code ON rooms(code);
CREATE INDEX idx_rooms_host ON rooms(host_id);
CREATE INDEX idx_rooms_test ON rooms(test_id);

-- Room participants
CREATE TABLE IF NOT EXISTS room_participants (
    id SERIAL PRIMARY KEY,
    room_id INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    result DOUBLE PRECISION,
    completed_at TIMESTAMP,
    UNIQUE(room_id, user_id)
);

CREATE INDEX idx_room_participants_room ON room_participants(room_id);
CREATE INDEX idx_room_participants_user ON room_participants(user_id);

-- Participant answers table
CREATE TABLE IF NOT EXISTS participant_answers (
    participant_id INTEGER REFERENCES room_participants(id) ON DELETE CASCADE,
    question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
    answer_id INTEGER REFERENCES question_answers(id) ON DELETE CASCADE,
    PRIMARY KEY (participant_id, question_id)
);

-- Feedback table
CREATE TABLE IF NOT EXISTS feedbacks (
    id SERIAL PRIMARY KEY,
    room_id INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    comments TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_feedbacks_room ON feedbacks(room_id);
CREATE INDEX idx_feedbacks_user ON feedbacks(user_id);