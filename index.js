import bodyParser from "body-parser";
import express from "express";

const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');


let yourName =[];
let addPost =[];

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
    
    });
    });
    

app.post("/submit", (req, res) => {
const newPost = req.body.newPost;    
    if (newPost.trim()!==""){
    addPost.push(newPost);
    }

const author = req.body.author;
    if (author.trim()!==""){
    yourName.push(author);
    }

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


app.listen(port, '0.0.0.0' () => {
console.log (`Listening on port ${port}`);
});
