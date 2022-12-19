const express = require('express')
const app = express()

const port = process.env.PORT || 4000

app.use(express.static('public'))

const path = require('path');
const homePath = path.join(__dirname, 'views');

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');


const SakaiAPI = require("sakai-api").default;

(async () => {
    const API = new SakaiAPI();
    await API.login({ username: "rkl15", password: "LemurBoy@_@" });

    const siteId = API.getSite()[0];

})();


app.get('/', function (req, res) {
    res.render('index', {});
});

app.listen(port, () => console.log(`Server live on port ${port}!`))
