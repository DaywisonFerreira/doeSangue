const express = require('express')
const server = express()

// configurar o servidor para apresentar arquivos estáticos
server.use(express.static('public'))

// habilitar body do formulário
server.use(express.urlencoded({extended:true}))

// configurar a conexão com o banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})

// configurando a template engine
const nunjucks = require('nunjucks')
nunjucks.configure("./", {
    express: server,
    noCache: true,
})


server.get('/', function(req, res){
    const query = "SELECT * FROM donors"
    db.query(query, function(err, result){
        if(err) return res.send("Erro no banco de dados")

        const donors = result.rows
        return res.render('index.html', {donors})
    })
    
})

server.post('/', function(req, res) {
    //pegar dados do formulário
    const {name, email, blood} = req.body

    if(name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatórios")
    }

    // coloco valores dentro do banco de dados
    const query = `INSERT INTO donors ("name", "email", "blood") 
                    VALUES ($1, $2, $3)`
    
    const values = [name, email, blood]

    db.query(query, values, function(err){
        if(err) return res.send("Erro no banco de dados")
        return res.redirect('/')
    })
})

server.listen(3000, function(){
    console.log("iniciei o servidor")
})

