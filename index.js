const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");


const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

const storage = multer.diskStorage({
    destination: 'public/uploads/',
    filename: (_req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

let yourName =[];
let addPost =[];
let images = [];

app.get("/", (_req, res) =>{
    const d = new Date().toLocaleDateString("en-US", {
       weekday: 'long',
       month: 'long',
       day: 'numeric',
       year: 'numeric',
       
    });
        
    res.render("index.ejs", {
    day:d,
    newPost: addPost,
    author: yourName,
    myFile: images,
    
    });
    });
    

app.post("/submit", upload.single('myFile'), (req, res) => {
    const newPost = req.body.newPost;
    const author = req.body.author;
    const file = req.file;

    if (newPost?.trim())
    addPost.push(newPost);
    //else addPost.push("(No content)");


    if (author?.trim())
    yourName.push(author);
    //else yourName.push("Anonymous");
    

    if (file) images.push(file.filename);
   //else images.push(null);
    
    res.redirect("/");
});

app.get('/blogs', (_req, res) => {

const d = new Date().toLocaleDateString("en-US", {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        });

    res.render('blogs.ejs', {
        title: 'View Posts',
        day: d,
        newPost: addPost,
        author: yourName,
        myFile: images,

        });
    });


app.get("/edit-blog/:id", (req, res) => {
    const blogId = parseInt(req.params.id);
    const blog = addPost[blogId];


    if (blog) {
        res.render("edit-blogs.ejs", { blog, blogId });
    } else {
        res.redirect("/blogs");
    }
    });

app.post("/update-blog/:id", (req, res) => {
    const blogId = parseInt(req.params.id);
    const newPost = req.body.newPost;

    if (newPost) {
        addPost[blogId] = newPost;
    }
    
    res.redirect("/blogs");
});

app.post("/delete-blog/:id", (req, res) => {
    const blogId = parseInt(req.params.id);
    addPost.splice(blogId, 1);
    res.redirect("/blogs");
});


app.listen(port, () => {
console.log (`Listening on port ${port}`);
});
