const app = require('../apps/app');

const config = require('config');

app.listen(process.env.PORT,()=>{
    console.log("Server running on port"+port);
})