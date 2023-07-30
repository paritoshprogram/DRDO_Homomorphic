
const registerServ = require('./register')

const loginServ = require('./login')
const verifyServ = require('./verify')
const util = require('./utils/util')




const healthPath = '/health';
const registerPath = '/register';
const loginPath = '/login';
const verifyPath = '/verify';





exports.handler = async (event) => {
    console.log("event is - ", event);
    
    const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // Replace with your frontend origin
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
                'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
};

    let response; let f_response;
    
    // Set CORS headers for all responses
    const withCorsHeaders = (statusCode, body) => {
        return {
            statusCode,
            headers: corsHeaders,
            body: JSON.stringify(body),
        };
    };

    switch (true) {
        case event.httpMethod === 'GET' && event.path === healthPath:
            response = withCorsHeaders(200);
            break;

        case event.httpMethod === 'POST' && event.path === registerPath:
            const registerBody = JSON.parse(event.body);
            console.log(registerBody);
            response = await registerServ.registerUser(registerBody)
            f_response = withCorsHeaders(response.statusCode, response.body);
            console.log(f_response);
            break;

        case event.httpMethod === 'POST' && event.path === loginPath:
            const loginBody = JSON.parse(event.body);
            console.log(loginBody);
            response = await loginServ.loginUser(loginBody) 
            f_response = withCorsHeaders(response.statusCode, response.body);
            console.log(f_response);
            break;

        case event.httpMethod === 'POST' && event.path === verifyPath:
            const verifyBody = JSON.parse(event.body);
            console.log(verifyBody)
            response = await verifyServ.verify(verifyBody);
            f_response = withCorsHeaders(response.statusCode,response.body);
            console.log(f_response);
            break;

        default:
            response = withCorsHeaders(404, { message: '404 not found' });
    }

    return f_response;
};
