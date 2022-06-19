const app = require('../apps/app');

const config = require('config');

app.listen(port=process.env.PORT || 3000,()=>{
    console.log("Server running on port"+port);
})