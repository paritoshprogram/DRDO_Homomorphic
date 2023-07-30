

;(async ()=>{
    
  
    
const aws = require('aws-sdk')   
aws.config.update({region: 'ap-southeast-2'})
    

    /*global seal */
const SEAL = require('node-seal')


const auth = require('./utils/auth')
const util = require('./utils/util')

const variablesPromise = require('./variables')
//import seal from 'node-seal/throws_wasm_node_umd'

//import seal from 'node-seal/allows_wasm_node_umd'


const dynamodb = new aws.DynamoDB.DocumentClient();


  
 

    async function loginUser (user) {
        
        //global.seal =  await SEAL()

        

       
    const  {
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
}  = await variablesPromise;
      
      const username = user.username
      const password = user.password
      
      console.log("user is - ",user)
      
      
        if(!username || !password ){

            return util.buildResponse(400,{message: 'Missing required fields'})}

        const dynamoUser = await getUser(username);  
        
        console.log("User is - ",dynamoUser)
        
        if(!dynamoUser || !dynamoUser.username){
            return util.buildResponse(403,{message: 'User does not exist'});
        }
        
        const arr = Int32Array.from([password])

        const plaintext = encoder.encode(arr)



        const ciphertext =  seal.CipherText();
        encryptor.encrypt(plaintext, ciphertext);

        console.log('User entered pass - ', ciphertext)
   
        


       // const userRecord = await dynamodb.getItem({ TableName: userTable, Key: { username: username } }).promise();

       // const ciphertext_db = userRecord.Item.password;
       const ciphertext_db = dynamoUser.password
       
       const loadedCiphertext = seal.CipherText();
       loadedCiphertext.load(context, ciphertext_db);
       
       console.log("DB loaded pass - ",loadedCiphertext)
       
       
       
       const difference = seal.CipherText();
       
       evaluator.sub(ciphertext, loadedCiphertext, difference);
       
       //evaluator.exponentiate(difference,1023,relinKeys)
        
       const decryptedResult1 = decryptor.decrypt(difference)
        
       const decodedResult1 = encoder.decode(decryptedResult1);
       
       console.log(decodedResult1)
       

       
       const isEqual = decodedResult1[0]
       
        
        if(isEqual!=0){
            return util.buildResponse(403,{message: 'Incorrect password'});
        }
     
        const userInfo = {
            username: dynamoUser.username,
            name: dynamoUser.name,
            email: dynamoUser.email
            
        };

        const token = auth.generateToken(userInfo);
        
        console.log("Access Token - ",token);

        const response = {
            user:userInfo,
            token:token

        };

     return util.buildResponse(200,response);


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

    
    
    module.exports.loginUser = loginUser
    


}) ();


