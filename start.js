const app = require('./app')
const Database = require("./database/database");
require("dotenv").config()

Database.connect().then(() => {
    app.listen(process.env.PORT || 5000, () => console.log("It's running birch!"))
}).catch(error => console.log(error));
