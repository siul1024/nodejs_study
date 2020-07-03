var http = require('http');
var fs = require('fs');
var url = require('url');

function createIndexHTML(filelist){
    var list = ``;
    
    for(key in filelist){
        list += `<li><a href="/?id=${filelist[key]}">${filelist[key]}</a></li>`;
    }

    return list;
}

function basicTempletHTML(title, filelist, data){
    return `
    <!doctype html>
    <html>
    <head>
        <title> WEB - ${title}</title>
        <meta charset="utf-8">
    </head>
    <body>
        <h1><a href="/">WEB</a></h1>

        <ul>${filelist}</ul>

        <h2>${title}</h2>

        <p>${data}</p>

        </body>
    </html>    
    `;
}

var server = http.createServer((request, response) => {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    var title = queryData.id;
    
    if(pathname === '/')
    {
        fs.readdir('./data', (err, list) => {
            var indexTemplate = createIndexHTML(list);
            
            fs.readFile(`./data/${title}`, 'utf-8', (err, data) => {
                if(data === undefined){
                    title = 'Welcome!';
                    data = 'Hello Node js';
                }
                var baseTemplate = basicTempletHTML(title, indexTemplate, data);
                
                response.writeHead(200);
                response.end(baseTemplate);
            });
        });
        // response.end(fs.readFileSync(__dirname + _url));
        // response.end(queryData.id);
    }
    else {
        response.writeHead(404);
        response.end('Not Found');
    }
});

server.listen(8000);