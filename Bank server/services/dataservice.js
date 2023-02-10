//import jsonwebtoken

const jwt=require('jsonwebtoken');

//import db.js

const db=require('./db')

// userdetails = {
//     1000: { acno: 1000, username: 'sanjay', password: 1000, balance: 2000,transactions:[] },
//     1001: { acno: 1001, username: 'san', password: 1001, balance: 2000,transactions:[] },
//     1002: { acno: 1002, username: 'sanju', password: 1002, balance: 2000,transactions:[] },

//   }
 const register=(acno,username,password )=>{
    // var userdetails=this.userdetails;
    return db.User.findOne({acno}).then(//asynchronous call
    user=>{
      if(user){
        return{
          status:false,
          statusCode:401,
          message:"user already exist"
        }
      }
      else{
        const newUser=new db.User({
          acno:acno,
          username:username,
          password:password,
          balance:0,
          transactions:[]
        })
        newUser.save()//to save new data to mongodb
        return{
          status:true,
          statusCode:200,
          message:"Register successful"
        }
      }
    }        

    )
  //   if(acno in userdetails){
  //       return{
  //           status:false,
  //           statusCode:401,
  //           message:"user already exists"
  //       }
     
  //  }
  //  else{
  //   userdetails[acno]={
  //     acno:acno,
  //     username:username,
  //     password:password,
  //     balance:0,
  //     transactions:[]
  //   }
  //   return{
  //       status:true,
  //       statusCode:200,
  //       message:"Regsiter successful"
  //   }
  //  }
  }

 const login=(acno,password)=>{
  return db.User.findOne({acno,password}).then(
    user=>{
      if(user){
        currentUser=user.username;
        currentAcno=acno
        //token geenration
        const token=jwt.sign({currentAcno:acno},'superkey2023')
        return{
          status:true,
          statusCode:200,
          message:"login successful",
          token:token,
          currentUser:user.username,
          currentAcno:acno
        }
      }
      else{
        return{
          status:false,
      statusCode:401,
      message:"invalid userdetails"
        }
      }
     
      
    }

  )//asynchronous call
    // if(acno in userdetails){
    //  if(password==userdetails[acno]['password']){
    //    currentUser=userdetails[acno]['username']
    //    currentAcno=acno
    //    //token generation
    //    const token=jwt.sign({currentAcno:acno},'superkey2023')
    //  //superkey2023 will generate na number  eg:insgoiuenraignlg
    //     return{
    //     status:true,
    //     statusCode:200,
    //     message:"login successful",
    //     token:token
    // }
    //  }
    //  else{
    //    return {
    //     status:false,
    //     statusCode:401,
    //     message:"innvalid password"
    //    }
    //  }
    // }
    // else{
    //  return {
    //   status:false,
    //   statusCode:401,
    //   message:"invalid userdetails"
    //  }
    // }
 }
const deposit=(acno,password,amt)=>{
  var amount=parseInt(amt)
  return db.User.findOne({acno,password}).then(
    user=>{
      if(user){
        if(password==user.password){
          user.balance+=amount;
          user.transaction.push({
            type:'credit',
            amount
          })
          user.save();//save to mongodb
          return{
            status:true,
        statusCode:200,
        message:`${amount} is credited and balance is ${user.balance}`
          }
        }
        else{
          return{
            status:false,
            statusCode:401,
            message:"invalid userdetails"
          }
        }
      }

    }
  )
  // if(acno in userdetails){
  //   if(pswd==userdetails[acno]['password']){
  //     userdetails[acno]['balance']+=amount;
  //     userdetails[acno]['transactions'].push({
  //       type:'credit',
  //       amount
  //     })
      
  //     return {
  //       status:true,
  //       statusCode:200,
  //       message:`${amount} is credited and balance is ${userdetails[acno]['balance']}`
  //   }
  //   }
  //   else{
     
  //     return {
  //       status:false,
  //       statusCode:401,
  //       message:"inavalid password"
  //      }
      
  //   }
  // }
  // else{
  //   return {
  //     status:false,
  //     statusCode:401,
  //     message:"invalid userdetails"
  //    }
  // }
}
const withdraw=(acno,pswd,amt)=>{
  var amount=parseInt(amt)
  return db.User.findOne({acno,pswd}).then(
    user=>{
      if(user){
        if(pswd==user.password){
          if(user.balance>amount){
            user.balance-=amount;
            user.transaction.push({
              type:'credit',
              amount
            })
            user.save();
            return{
              status:true,
          statusCode:200,
          message:`${amount} is debited and balance is ${user.balance}`
            }
            
          }
        }
      }
    }
  )
  // if(acno in userdetails){
  //   if(pswd==userdetails[acno]['password']){
  //     if(userdetails[acno]['balance']>amount){
  //       userdetails[acno]['balance']-=amount;
  //       userdetails[acno]['transactions'].push({
  //         type:'debit',
  //         amount
  //       })
       
  //       return {
  //         status:true,
  //         statusCode:200,
  //         message:`${amount} is debited and balance is ${userdetails[acno]['balance']}`
  //     }
  //     }
     
  //   }
  //   else{
      
  //     return  {
  //       status:false,
  //       statusCode:401,
  //       message:"inavalid password"
  //      }
      
  //   }
  // }
  // else{
   
  //   return  {
  //     status:false,
  //     statusCode:401,
  //     message:"inavalid userdetails"
  //    }
  // }
}
const getTransaction=(acno)=>{
  return db.User.findOne({acno}).then(
    user=>{
      if(user){
      return {
        status:true,
        statusCode:200,
        transaction:user.transaction
    }
  }
  else{
    return{
    status:false,
    statusCode:401,
    message:'error'
    }
  }
    
    }
  )
 
  return {
    status:true,
    statusCode:200,
    message:userdetails[acno]['transactions']
}
}

//delete account
const deleteAcc=(acno)=>{
  return db.User.findOneAndDelete({acno}).then(
    user=>{
      if(user){
        return{
          status:true,
          statusCode:200,
          message:"user deleted"
        }
      }
      else{
        return{
          status:false,
          statusCode:401,
          message:'user not found'
          }
    }
  }
  )
}


  module.exports={
    register,
    login,
    deposit,
    withdraw,
    getTransaction,
    deleteAcc
  }