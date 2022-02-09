const express = require('express');
const path = require('path');
const app = express();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'notindex.html'));
});

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => console.log(`Sever started on port ${PORT}`));
