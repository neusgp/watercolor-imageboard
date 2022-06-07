const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:postgres:postgres@localhost:5432/imageboard");

module.exports.getAllImages = () => {
    return db.query("SELECT * FROM images ORDER BY id DESC LIMIT 3;");
};

module.exports.getImagesById = (id) => {
    const query = "SELECT * FROM images WHERE images.id=$1";
    const params = [id];
    return db.query(query, params);
};

module.exports.insertImage = (description, username, title, url) => {
    const query = `INSERT INTO images (description, username, title, url)
    VALUES ($1, $2, $3, $4)
    RETURNING *`;

    const params = [description, username, title, url];
    return db.query(query, params);
};

module.exports.addComment = (image_id, comment, username) => {
    const query = `INSERT INTO comments (image_id, comment, username)
    VALUES ($1, $2, $3)
    RETURNING *`;

    const params = [image_id, comment, username];
    return db.query(query, params);
};

module.exports.getCommentsByImgId = (id) => {
    const query = "SELECT * FROM comments WHERE comments.image_id=$1";
    const params = [id];
    return db.query(query, params);
};

module.exports.getMoreImages = (lowestId) => {
    const query = `SELECT url, title, id, (SELECT id FROM images ORDER BY id ASC LIMIT 1) AS "lowestId" FROM images WHERE id < $1 ORDER BY id DESC LIMIT 3;`;
    const params = [lowestId];

    return db.query(query, params);
};

/* module.exports.countImages = () => {
    return db.query("SELECT COUNT(id) FROM images");
}; */
