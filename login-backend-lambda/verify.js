const util = require('./utils/util')
const auth = require('./utils/auth')

function verify(userInf){

    if(!userInf.username || !userInf.token)
    {
        return util.buildResponse(401,{
            verified:false,
            message: 'Incorrect Request Body'
        })
    }

    
    const username = userInf.username
    const token = userInf.token
    const verification =  auth.verifyToken(username,token)
    if(!verification.verified){
        return util.buildResponse(401,verification)
    }

    return util.buildResponse(200,{
        verified:true,
        message: 'Success',
        username: username,
        token: token
    })

}

module.exports.verify = verify



