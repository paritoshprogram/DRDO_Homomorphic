const jwt = require('jsonwebtoken')

/*global secretK*/
global.secretK = 'secret'

function generateToken(userInfo)
{
    if (!userInfo) return null;



return jwt.sign(userInfo,secretK,{expiresIn: '1h'})
}

function verifyToken(username,token)
{
    return jwt.verify(token,secretK,(err,response)=>{
        if(err){
            return {
                verified:false,
                message: 'Invalid token'
            }
        }

        if(response.username !== username){
            return {
                verified:false,
                message: 'Invalid User'
            }
        }
        return {
            verified:true,
            message: 'Valid User'
        }
    })
}
module.exports.generateToken = generateToken
module.exports.verifyToken = verifyToken