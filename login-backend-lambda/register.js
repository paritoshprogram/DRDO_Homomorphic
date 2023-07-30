;(async ()=>{
    
const aws = require('aws-sdk')   
aws.config.update({region: 'ap-southeast-2'})

    /*global seal */



const auth = require('./utils/auth')
const util = require('./utils/util')


    
const variables_promise = require('./variables')

const dynamodb = new aws.DynamoDB.DocumentClient();


//import seal from 'node-seal/throws_wasm_node_umd'

//import seal from 'node-seal/allows_wasm_node_umd'




  async function registerUser (userInfo) {
    try {
      // Handle user registration logic here
      // Access the request payload, generate encryption keys, encrypt data, and store it in DynamoDB
      // Return a response indicating the registration status
      
       // global.seal =  await SEAL()
        
     const {
   userTable,

 schemeType,
 params2,
 securityLevel,
 polyModulusDegree,
 context,
 bitSizes,
 bitSize,
 keygen,
 publicKey,
 secretKey,
 encryptor,
 encoder,
 decryptor,
 evaluator,
 seal
} = await variables_promise;

      const username = userInfo.username;
      const password = userInfo.password;
      const email = userInfo.email;
      const name = userInfo.name;
      
      
   

      if(!username || !password || !name || !email){

        return util.buildResponse(400,{message: 'Missing required fields'})}
        
        

        const dynamoUser = await getUser(username);

        if(dynamoUser && dynamoUser.username)
        {
            return util.buildResponse(400,{message: 'User already exists'});
   
        }
        
        
        

    const arr = Int32Array.from([password])

    const plaintext = encoder.encode(arr)


    const ciphertext = seal.CipherText();
   
   encryptor.encrypt(plaintext, ciphertext);

   console.log('Ciphertext is :- \n', ciphertext)
   
   
      const serializedCiphertext = ciphertext.save();

      const user = {
            username: username,
            password: serializedCiphertext,
            name: name,
            email: email
      };

        console.log(user)
        const saveUserResponse = await saveUser(user);

        if(!saveUserResponse){
            return util.buildResponse(500,{message: 'An error occurred during registration'});
        }

        return util.buildResponse(200,{message: 'User registration successful'});


    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'An error occurred during registration' }),
      };
    }
  };

  async function getUser(username){
    const params = {
        TableName: 'users',
        Key:{
            username: username
        }
    };

    return await dynamodb.get(params).promise().then(response =>{
        return response.Item;
    },error =>{
        console.error("There is an error: ",error);
    });
  }

  async function saveUser(user){
      
   

    const params = {
        TableName: 'users',
        Item:user
    };

    return await dynamodb.put(params).promise().then(response =>{
        return response;
    },error =>{
        console.error("There is an error saving user: ",error);
    });
    
  }


 
    
    module.exports.registerUser = registerUser


}) ();

