function authenticateToken(req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
        if (!token) {
          return res.sendStatus(401);
        }
        console.log(token)
        jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
            if (err) return sendStatus(403);
            req.user = user;  
            next();
        });
    } catch (err) {
        console.log(err)
        res.status(400).send('Invalid token !');
    }
}