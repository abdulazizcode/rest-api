const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');

app.use(express.json());
app.use(express.urlencoded({ extended: true })); //Parse URL-encoded

//    Connecting to MongoDB
mongoose
    .connect('mongodb://localhost:27017/wikiDb', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.log('MongoDB Error');
        console.log(err);
    });

//   Creating blueprint Schema
const articlesSchema = {
    title: String,
    container: String
};

const Article = mongoose.model('Article', articlesSchema); // Using our blueprint Schema

//    Setting up route for all '/articles'
app.route('/articles')

    //    Getting all Posts
    .get((req, res) => {
        Article.find({}, (err, foundedData) => {
            if (!err) {
                res.send(foundedData);
            } else {
                res.send('Error while fetching data', err);
            }
        });
    })

    .post((req, res) => {
        //   Posting  new Post
        let newArticle = new Article({
            title: req.body.title,
            container: req.body.container
        });

        newArticle.save((err) => {
            if (!err) {
                res.send('Succesfully added new Post!');
            } else {
                res.send('Error occured while adding new Post!', err);
            }
        });
    })

    .delete((req, res) => {
        //   Deleteding all Posts
        Article.deleteMany({}, function (err) {
            if (!err) {
                res.send('Succesfully deleted all Posts!');
            } else {
                res.send('Error occured while deleting all Posts!', err);
            }
        });
    });

///////////////////////// /////////  Fetch based on Title with params  ////////////////////////////////////////
app.route('/articles/:articleTitle')
    .get((req, res) => {
        Article.findOne(
            { title: req.params.articleTitle },
            (err, foundedData) => {
                if (foundedData) {
                    res.send(foundedData);
                } else {
                    res.send('Error while fetching data');
                }
            }
        );
    })
    //  Updating based on title
    .put((req, res) => {
        Article.findOneAndUpdate(
            { title: req.params.articlesSchema },
            { title: req.body.title, container: req.body.container },
            { overwrite: true },

            function (err) {
                if (!err) {
                    res.send('Updated Succesfully');
                } else {
                    res.send('Error while updating values');
                }
            }
        );
    })

    // Deleting based on title
    .delete((req, res) => {
        Article.deleteOne(
            { title: req.params.articleTitle },

            function (err) {
                if (!err) {
                    res.send('Deleted succuessfully');
                } else {
                    res.send('Some err while del', err);
                }
            }
        );
    });
//    Listening to port
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
