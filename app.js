const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(morgan('common'))
app.use(cors())

// REQUIRE ARRAY OF Google Apps
const googleApps = require('./playstore.js')

app.get('/apps', (req, res) => {
    // ALL OUR CODE INSIDE HERE...

    //set up search param with a default of ''
    const {search = '', sort} = req.query

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
    let results = googleApps
        .filter(googleApp =>
            googleApp
                .App // Name of App from data source
                .toLowerCase()
                .includes(search.toLowerCase())
                )
    //after the books are filtered by search then we can sort
    if(sort) {
        results
            .sort((a, b) => {
                return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
            })
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