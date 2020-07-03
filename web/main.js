var http = require('http');
var fs = require('fs');
var url = require('url');

var server = http.createServer((request, response) => {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    // console.log(queryData.id);
    var title = queryData.id;
    
    // if(_url === '/favicon.ico'){
    //     return response.writeHead(404);
    // }

    if(pathname === '/'){
        var pageindex = ``;

        fs.readdir('./data', (err, list) => {
            console.log(list);
            for(key in list){
                pageindex += `<li><a href="/?id=${list[key]}">${list[key]}</a></li>`;
            }

            fs.readFile(`./data/${title}`, 'utf-8', (err, data) => {
                if(data === undefined){
                    title = 'Welcome!';
                    data = 'Hello Node js';
                }
                console.log(pageindex);
                var template = `
                    <!doctype html>
                    <html>
                    <head>
                        <title> WEB - ${title}</title>
                        <meta charset="utf-8">
                    </head>
                    <body>
                        <h1><a href="/">WEB</a></h1>
    
                        <ul>${pageindex}</ul>
    
                        <h2>${title}</h2>
                
                        <p>${data}</p>
                
                        </body>
                    </html>
                `;
                // console.log(template);
                response.writeHead(200);
                response.end(template);
            });
        });
        //response.end(fs.readFileSync(__dirname + _url));
        // response.end(queryData.id);
    }
    else {
        response.writeHead(404);
        response.end('Not Found');
    }
});

server.listen(8000);