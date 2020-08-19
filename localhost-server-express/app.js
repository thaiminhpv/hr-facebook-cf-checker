const express = require('express');
const app = express();

app.get('/', (req, res) => {
    console.log(req.query)
    let userCfArray = req.query.data;
    // TODO: Call Spreadsheet API update data on @userCfArray
    res.send(req.query);
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`runnning on ${port}...`);
})
