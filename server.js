const express = require("express");
const db = require("./sql/db.js");
const app = express();
const fs = require("fs");
app.use(express.static("./public"));
app.use(express.static("./uploads"));

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

// Core path module
const path = require("path");
// Random string generator
const uidSafe = require("uid-safe");
// Multer file data middleware
const multer = require("multer");
const aws = require("aws-sdk");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

// Specify the storage location
const storage = multer.diskStorage({
    // Directory
    destination: (req, file, callback) => {
        callback(null, path.join(__dirname, "uploads"));
    },
    // Filename
    filename: (req, file, callback) => {
        // 1. Generate a random string
        uidSafe(24).then((randomId) => {
            // 2. Construct random file name with extension
            const fileName = `${randomId}${path.extname(file.originalname)}`;
            callback(null, fileName);
        });
    },
});

const uploader = multer({
    storage: storage,
    limits: {
        fileSize: 2097152,
    },
});

app.post("/image", uploader.single("image"), (req, res) => {
    console.log("POST request to upload image");

    console.log("file:", req.file);
    console.log("input:", req.body);
    awsUpload(req.file).then(() => {
        console.log("PUT successful");

        let url =
            "https://mywatercolorimageboard.s3.eu-central-1.amazonaws.com/" +
            req.file.filename;

        db.insertImage(
            req.body.description,
            req.body.username,
            req.body.title,
            url
        )
            .then(({ rows }) => {
                console.log("new image", rows[0]);
                res.json(rows[0]);
            })
            .catch((err) => {
                console.log("error", err);
            });
    });
});

app.get("/api/images", (req, res) => {
    console.log("GET request made");
    db.getAllImages()
        .then(({ rows }) => {
            console.log("server array", rows);
            res.json(rows);
        })
        .catch((err) => {
            console.log("error getting images", err);
        });
});

/* app.get("/api/images/" + location.pathname.slice(1), (req, res) => {
    console.log("GET request made");
    db.getAllImages()
        .then(({ rows }) => {
            console.log("server array", rows);
            res.json(rows);
        })
        .catch((err) => {
            console.log("error getting images", err);
        });
}); */

app.get("/image/:image_id", (req, res) => {
    console.log("GET request made");
    const { image_id } = req.params;
    console.log("url id", image_id);

    db.getImagesById(image_id)
        .then(({ rows }) => {
            if (!rows) {
                res.status(404).json({
                    message: "Image not found",
                });
                return;
            }
            console.log("selected image", rows);
            res.json(rows);
        })
        .catch((err) => {
            console.log("error getting images", err);
        });
});

app.post("/comments/:image_id", (req, res) => {
    console.log("POST request made");

    const { image_id, comment, username } = req.body;

    db.addComment(image_id, comment, username)
        .then(({ rows }) => {
            console.log("inserted comment", rows);
            res.json(rows);
        })
        .catch((err) => {
            console.log("error getting images", err);
        });
});

app.get("/comments/:image_id", (req, res) => {
    console.log("GET request made to get comments");

    const { image_id } = req.params;

    console.log("image id (for comments)", image_id);

    db.getCommentsByImgId(image_id)
        .then(({ rows }) => {
            if (!rows) {
                res.status(404).json({
                    message: "no comments found!",
                });
                return;
            }
            console.log("selected comments", rows);
            res.json(rows);
        })
        .catch((err) => {
            console.log("error getting comments", err);
        });
});

app.get("/images/more/:lowestId", (req, res) => {
    console.log("GET request made to get more images");

    const { lowestId } = req.params;

    console.log("lowestId (for images)", lowestId);

    db.getMoreImages(lowestId)
        .then(({ rows }) => {
            if (!rows) {
                res.status(404).json({
                    message: "no comments found!",
                });
                return;
            }
            console.log("found more images", rows);
            res.json(rows);
        })
        .catch((err) => {
            console.log("error getting more images", err);
        });
});

/* app.get("/images/count", (req, res) => {
    console.log("GET request made to count images");

    db.countImages()
        .then(({ rows }) => {
            const count = rows[0].count;
            console.log("number of images:", count);
            res.json(count);
        })
        .catch((err) => {
            console.log("error counting images", err);
        });
}); */

function awsUpload(req_file) {
    const promise = s3
        .putObject({
            Bucket: "mywatercolorimageboard",
            ACL: "public-read",
            Key: req_file.filename,
            Body: fs.createReadStream(req_file.path),
            ContentType: req_file.mimetype,
            ContentLength: req_file.size,
        })
        .promise();

    return promise
        .then(() => {
            console.log("File uploaded");
        })
        .catch((err) => {
            console.log("error uploading file");
            console.log(err);
        });
}

app.get("*", (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`);
});

app.listen(8080, () => console.log(`I'm listening.`));
