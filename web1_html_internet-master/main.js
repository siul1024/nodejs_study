var http = require('http');
var fs = require('fs');
var url = require('url');

var server = http.createServer((request, response) => {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    // console.log(queryData.id);
    var title = queryData.id;
    
    if(_url === '/'){
        title = 'Welcome!';
    }
    // if(_url === '/favicon.ico'){
    //     return response.writeHead(404);
    // }
    if(pathname === '/'){
        fs.readFile(`./data/${queryData.id}`, 'utf-8', (err, data) => {
            if(data === undefined){
                data = 'Hello Node js';
            }
            var template = `
                <!doctype html>
                <html>
                <head>
                    <title> WEB - ${title}</title>
                    <meta charset="utf-8">
                </head>
                <body>
                    <h1><a href="/">WEB</a></h1>
                    <ul>
                        <li><a href="/?id=HTML">HTML</a></li>
                        <li><a href="/?id=CSS">CSS</a></li>
                        <li><a href="/?id=JavaScript">JavaScript</a></li>
                    </ul>
                    <h2>${title}</h2>
            
                    ${data}
            
                    </body>
                </html>
            `;
            response.writeHead(200);
            response.end(template);
        });
        //response.end(fs.readFileSync(__dirname + _url));
        // response.end(queryData.id);
    }
    else {
        response.writeHead(404);
        response.end('Not Found');
    }
});

server.listen(3000);