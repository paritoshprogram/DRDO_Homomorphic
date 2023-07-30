
;(async ()=>{
    
    

    /*global seal */
const SEAL = require('node-seal')


const auth = require('./utils/auth')
const util = require('./utils/util')

async function initialise(){
    
    global.seal = await SEAL();

const userTable = 'users'

const schemeType = seal.SchemeType.bfv;
const params2 = seal.EncryptionParameters(schemeType);
const securityLevel = seal.SecurityLevel.tc128;
const polyModulusDegree = 4096;
const bitSizes = [36, 36, 37];
const bitSize = 20;
/*const keygen
const publicKey
const encryptor
const encoder
const decryptor
const evaluator*/


       

 // Set the PolyModulusDegree
        params2.setPolyModulusDegree(polyModulusDegree);
  
  // Create a suitable set of CoeffModulus primes
        params2.setCoeffModulus(
        seal.CoeffModulus.Create(polyModulusDegree, Int32Array.from(bitSizes))
         );

  // Set the PlainModulus to a prime of bitSize 20.
  params2.setPlainModulus(
    seal.PlainModulus.Batching(polyModulusDegree, bitSize)
  );

const context = seal.Context(
    params2, // Encryption Parameters
    true, // ExpandModChain
    securityLevel // Enforce a security level
  );

  if (!context.parametersSet()) {
    throw new Error(
      'Could not set the parameters in the given context. Please try different encryption parameters.'
    )
  }
  
     const evaluator = seal.Evaluator(context);

     const keygen  =  seal.KeyGenerator(context)

      const publicKey = keygen.createPublicKey()

     const secretKey = keygen.secretKey()

     const encryptor =  seal.Encryptor(context,publicKey)
      
      const encoder = seal.BatchEncoder(context)
      
     const decryptor = seal.Decryptor(context, secretKey)
      
      const relinKeys = keygen.createRelinKeys();
      
      return {
 
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

};

      
    
}

module.exports = initialise();







}) ();