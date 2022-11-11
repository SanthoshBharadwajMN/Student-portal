const express = require('express')
const app = express()
const mysql = require('mysql2')

const PORT = process.env.PORT || 4040

app.set('view engine','ejs')
app.use(express.urlencoded({extended : true}))

//DATABASE CONNECTION

const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '14591459',
    database : 'StudentPortal'
})

db.connect((err)=>{
    if(err){
        throw err
    }
    console.log("Connected")
})

//CREATE DATABASE (ONLY ONCE)

app.get('/create',(req,res)=>{
    let sql = 'CREATE DATABASE StudentPortal'
    db.query(sql, (err,result)=>{
        if(err){
            throw err
        }
        res.send("DB created")
        console.log(result)
    })
})

//CREATE TABLE (ONLY ONCE)

app.get('/createtable', (req,res)=>{
    let sql = 'CREATE TABLE students(name VARCHAR(25), id INT, grade INT, email VARCHAR(30), password VARCHAR(10), PRIMARY KEY(id))'
    db.query(sql, (err,result)=>{
        if(err) throw err
        res.send("Table created")
        console.log(result)
    })
})

//HOME PAGE

app.get('/', (req,res)=>{
    res.render('home')
})

//REGISTRATION

app.get('/register', (req,res)=>{
    res.render('register1', { status : false })
})

app.post('/register', (req,res)=>{
    let post = {
        name : req.body.name,
        id : req.body.id,
        grade : req.body.grade,
        email : req.body.email, 
        password : req.body.password
    }
    let sql = 'INSERT INTO students SET ?'
        let query = db.query(sql, post, (err, result)=>{
            if(err){
                if(err.errno === 1062)
                    res.render('register1', { status : true })
                else
                    throw err
            } else{
                res.redirect('/login')
            }
        })
})

//LOGIN

app.get('/login', (req,res)=>{
    res.render('login1', { status : false })
})

app.post('/login',(req,res)=>{
    let sql = `SELECT * FROM students WHERE email = "${req.body.email}" AND password = "${req.body.password}" `
    let query = db.query(sql, (err, result)=>{
        if(err) throw err
        if(result.length > 0){
            const student = result
            res.render('admin', { student : student })
        }
        else {
            res.render('login1', { status : true })
        }
    })
})

app.listen(PORT, ()=>console.log("Server started."))