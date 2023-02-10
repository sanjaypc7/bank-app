//server creation 

//1 import express
const express=require('express')
//import jsonwebtoken
const jwt=require('jsonwebtoken');

//import cors
const cors =require('cors')

const dataservice=require('./services/dataservice')

//2 Create an app using express

const app=express();

// app.use(express.json);
app.use(express.json())

//give command to share data via cors
app.use(cors({
    orgin:['http://localhost:4200','http://192.168.0.168:8080']
}))

//3 create a port number

app.listen(3000,()=>{
    console.log('listenig on the port 3000');
})

//application specific miiddleware

const appMiddleware=(req,res,next)=>{
    console.log('application specific middleware');
    next();
}
app.use(appMiddleware)

//router specific middleware

const jwtRouterMiddleware=(req,res,next)=>{
   try{
    console.log('Router soecific middleware');
    const token=req.header('x-access-token')
    const data=jwt.verify(token,'superkey2023')
    console.log(data);
    next();
   }
   catch{
    res.status(422).json({
        statusCode:422,
        status:false,
        message:'please login first '
    })
   }
}

//4 resolving http requests

// app.get('/',(req,res)=>{
//     res.send('get http request')
// })

// app.post('/',(req,res)=>{
//     res.send('post http request')
// })

// app.put('/',(req,res)=>{
//     res.send('put http request')
// })

// app.patch('/',(req,res)=>{
//     res.send('patch http request')
// })

// app.delete('/',(req,res)=>{
//     res.send('delete http request')
// })

//Api calls
//Register request
app.post('/register',(req,res)=>{
    dataservice.register(req.body.acno,req.body.username,req.body.password).then(
        result=>{
            res.status(result.statusCode).json(result)
        }
    )
    // if(result){
    //     res.send('register successful')
    //     console.log(req.body);
    // }
    // else{
    //     res.send('register failed')
    // }
    
   
})
//login request

app.post('/login',(req,res)=>{
    dataservice.login(req.body.acno,req.body.password).then(
        result=>{
        res.status(result.statusCode).json(result)
    }
    )
    
})
//deposit request
app.post('/deposit',jwtRouterMiddleware,(req,res)=>{
    dataservice.deposit(req.body.acno,req.body.password,req.body.amount).then(
        result=>{
            res.status(result.statusCode).json(result)
        }
    )
   
})
//withdraw request
app.post('/withdraw',jwtRouterMiddleware,(req,res)=>{
    dataservice.withdraw(req.body.acno,req.body.password,req.body.amount).then(
        result=>{
            res.status(result.statusCode).json(result)
        }
    )
   
})
//transaction request
app.post('/transaction',jwtRouterMiddleware,(req,res)=>{
    dataservice.getTransaction(req.body.acno).then(
        result=>{
        res.status(result.statusCode).json(result)
        }
    )
    
})
//delete request
app.delete('/deleteAcc/:acno',(req,res)=>{
    dataservice.deleteAcc(req.params.acno).then(
        result=>{
            res.status(result.statusCode).json(result)
        }
    )
})