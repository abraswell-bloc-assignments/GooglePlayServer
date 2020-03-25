const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(morgan('common'))
app.use(cors())

// REQUIRE ARRAY OF Google Apps
const googleapps = require('./playstore.js')

app.get('/apps', (req, res) => {
    // ALL OUR CODE INSIDE HERE...

    //set up search param with a default of ''
    const {search = '', genres = '', sort} = req.query
    console.log(genres)

    //search is not required but if included it should only
    //be "title" or "rank"
    if(sort) {
        if(!['app', 'rating'].includes(sort)) {
            return res
                .status(400)
                .send('Sort must be one of app or rating')
        }
    }

    //set up filter function on books to include lowercase
      let results = googleapps
        .filter(googleapp =>
            googleapp
                .App // Name of App from data source
                .toLowerCase()
                .includes(search.toLowerCase())
                )        

    if(sort) {
        //account for the capitalization in returned data
        // if sort = "rating" then sortCap = Rating
        // have to have index [0] to make it work
        // toLowerCase won't work because data is capitalized...  .Rating
        let sortCap = sort[0].toUpperCase() + sort.slice(1)
        // sort results
        results
            .sort((a, b) => {
                
                return a[sortCap] > b[sortCap] ? 1 : a[sortCap] < b[sortCap] ? -1 : 0;
            })
    }

    //search is not required but if included it should 
    //filter the results
    if(genres) {
        console.log('genre conditional worked')
        results = results.filter(result => 
            result
            .Genres
            .toUpperCase()
            .includes(genres.toUpperCase()))
    }

    res
    // CHECK THAT ARRAY IS COMING IN WITH POSTMAN
        // .json(googleApps)
    // CHECK THAT ARRAY IS COMING IN WITH ACTUAL CODE
    .json(results)
})

module.exports = app

app.listen(8000, () => {
    console.log('Server started on PORT 8000')
})