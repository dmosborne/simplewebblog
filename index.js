const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const session = require("express-session");


const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));

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
    sessionUser: _req.session.username,
    });
    });

app.post('/login', (req, res) => {
    const username = req.body.username?.trim();
    if (username) req.session.username = username;
    res.redirect('/');
});
          


app.post("/submit", upload.single('myFile'), (req, res) => {

    if (!req.session.username) {
        return res.status(403).send("You must log in before posting.");
      }

    const newPost = req.body.newPost;
    const author = req.session.username;
    const file = req.file;

    if (newPost?.trim())
    addPost.push(newPost);
   
    if (author?.trim())
    yourName.push(author);  

    if (file) images.push(file.filename);
   
    
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
    const storedAuthor = yourName[blogId];

    if (blogId >= addPost.length || blogId < 0) {
        return res.status(404).send("Post not found");
    }
    
    if (!req.session.username) {
        return res.status(403).send("You must be logged in to edit posts.");
      }

    if (req.session.username !== storedAuthor) {
        return res.status(403).send("You can only edit your own posts.");
      }

        res.render("edit-blogs.ejs", { blog, blogId });
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
     if (req.session.username !== yourName[blogId]) {
        return res.redirect("/blogs");
       }

        addPost.splice(blogId, 1);
        yourName.splice(blogId, 1);
        images.splice(blogId, 1);

        res.redirect("/blogs");
    });
      
    
app.listen(port, () => {
console.log (`Listening on port ${port}`);
});
