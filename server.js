var express = require("express")
var app = express()
const PORT = 3000
var path = require("path")
var hbs = require("express-handlebars")
var formidable = require('formidable');
const exp = require("constants")

app.set("views", path.join(__dirname, "views"))
// app.engine("hbs", hbs({ defaultLayout: null }))
app.engine("hbs", hbs({ defaultLayout: "main.hbs" }))
app.engine("hbs", hbs({
    extname: '.hbs',
    partialsDir: "views/partials",
}))
app.set("view engine", "hbs")
app.use(express.static('static'))
app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})

app.get("/upload", function (req, res) {
    res.render('upload.hbs');
})

let arr = []
i = 0
app.post("/filemanager", function (req, res) {
    let form = formidable({})

    form.keepExtensions = true
    form.multiples = true
    form.uploadDir = __dirname + '/static/upload'
    form.parse(req, function (err, fields, files) {
        if (Array.isArray(files.upload)) {
            files.upload.map(function(file){
                i += 1
                arr.push({ id: i, name: file.name, size: file.size, type: file.type, path: file.path, savedate: file.lastModifiedDate.getTime()})
            })
        }
        else {
            let file = files.upload
            i += 1
            arr.push({ id: i, name: file.name, size: file.size, type: file.type, path: file.path, savedate: file.lastModifiedDate.getTime()})
        }
        res.render("filemanager.hbs", { files: arr })
    })
})
app.get("/filemanager", function (req, res){
    res.render("filemanager.hbs", { files: arr })
})

app.get("/info/:id", function(req, res){
    let fileOfId
    arr.map(function(file){
        if(file.id == req.params.id){
            fileOfId = file
        }
    })
    res.render("info.hbs", fileOfId)
})
app.get("/info", function(req, res){
    res.render("info.hbs")
})
app.get("/reset",function(req, res){
    arr = []
    res.render("filemanager.hbs", { files: arr })
})