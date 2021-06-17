const app = require("express")();
const bodyParser = require('body-parser')
const cors = require('cors');
const redis = require('redis');
let data = {}
let publisher = redis.createClient(process.argv[2])
let subscriber = redis.createClient(process.argv[2])

subscriber.subscribe('notification');
subscriber.on('message', (channel, dataRedis)=> {
        let dataParsed = JSON.parse(dataRedis)
        data[dataParsed.key] = dataParsed.value
    })

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



app.post('/put',(req,res)=>{
    let {key,value} = req.body
    console.log({key,value})
    if(!key||!value){
        res.json('wrong values')
    }
    else {
        data[key] = value
        let obj = {key,value}
        publisher.publish('notification', JSON.stringify(obj))
        res.json('stored')
    }
})

app.get('/get',(req,res)=>{
    let {key} = req.body
    if(data[key]){
        res.json(data[key])
    }
    else{
        res.json('not found')
    }
})

app.get('/',(req,res)=>{
    console.log(req)
})

app.listen(3000, () => {
    console.log("apps running 3000");
});

