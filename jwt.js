const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

// generate token for another API to use in req.header
app.post('/login', (req, res) => {
    const user = {
        id: 1,
        username: 'abhishek',
        email: "abhishek@gmail.com"
    }
    let token = jwt.sign({ user: user }, 'shhhhh');
    res.send(token);
})

// verifyToken is a function that is used for check in API that token exist or not
// it can be put in between n number of API to check that authoriZed user loggedin or not.
app.get('/api', verifyToken, (req, res) => {
    try {
        jwt.verify(req.token, 'shhhhh', (error, authData) => {
            if (error) {
                res.send("not logged in")
            }
            res.json({
                message: "post Created",
                authData
            })
        })
    } catch (error) {
        res.send(error)
    }
})

// This function is middleware.
function verifyToken(req, res, next) {
    try {
        const bearerHeader = req.headers['authorization'];
        if (typeof bearerHeader !== 'undefined') {
            const bearerToken = bearerHeader.split(' ')[1];
            req.token = bearerToken;
            next();
        }
        else {
            res.send("Not logged-in")
        }
    }
    catch {
        res.send("something went wrong")
    }
}

app.listen(3000, () => {
    console.log("server is runing")
})