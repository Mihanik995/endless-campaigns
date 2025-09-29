const app = require('./src/config/server')

app.listen(5000, () => {
    console.log("Server started on port 5000");
});