const http= require("http")
http.createServer((request,response)=>
{
    console.log("Server created  at 5000")
response.write("hello guigui;")
response.end()
})
.listen(500);