var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

let CREATE = 0;
let UPDATE = 1;

function createIndexHTML(filelist){
    var list = ``;
    
    for(key in filelist){
        list += `<li><a href="/?id=${filelist[key]}">${filelist[key]}</a></li>`;
    }
    return list;
}

function basicTempletHTML(title, filelist, body, handle){
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
            <p>${handle}</p>
            <h2>${title}</h2>
            
            <p>${body}</p>

            </body>
        </html>    
    `;
}

function basicTempletFormHTML(title, data, act){
    if(act === 1){
        return `
            <form action="/update_process" method="post">
                <input type="hidden" name="id" value="${title}"/>
                <p>
                <input type="text" name="title" placeholder="title" value="${title}" style="width:700px;" />
                </p>
                <p>
                    <textarea name="content" placeholder="content" style="width:700px; height:200px; resize:none;">${data}</textarea>
                </p>
                <input type="submit"/>
            </form>
        `;
    } else if(act === 0){
        return `
            <form action="/create_process" method="post">
                <p>
                <input type="text" name="title" placeholder="title" style="width:700px;" />
                </p>
                <p>
                    <textarea name="content" placeholder="content" style="width:700px; height:200px; resize:none;"></textarea>
                </p>
                <input type="submit"/>
            </form>
        `;
    }
    return `
        error
    `;
}


var server = http.createServer((request, response) => {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    var title = queryData.id;
    
    if(pathname === '/'){
        fs.readdir('./data', (err, list) => {
            var indexTemplate = createIndexHTML(list);
            
            fs.readFile(`./data/${title}`, 'utf-8', (err, data) => {
                if(data === undefined){
                    title = 'Welcome!';
                    data = 'Hello Node js';
                    var baseTemplate = basicTempletHTML(title, indexTemplate, data, `<a href="/create">create</a>`);
                } else {
                    var baseTemplate = basicTempletHTML(title, indexTemplate, data, `
                        <a href="/create">create</a> <a href="/update?id=${title}">update</a>
                    `);
                }                
                response.writeHead(200);
                response.end(baseTemplate);
            });
        });

    } else if(pathname === '/create'){
        title = "WEB - create";
        fs.readdir('./data', (err, list) => {
            var indexTemplate = createIndexHTML(list);
            var form = basicTempletFormHTML(``, ``, CREATE);
                var baseTemplate = basicTempletHTML(title, indexTemplate, form, ``);
                response.writeHead(200);
                response.end(baseTemplate);
        });

    } else if(pathname === '/create_process'){
        var body = '';
        request
            .on('data', (data) => { body += data; }) 
            .on('end', () => {
                var post = qs.parse(body);
                var title = post.title;
                var content = post.content;
                fs.writeFile(`./data/${title}`, content, 'utf-8', (err) => {
                    response.writeHead(302, {Location: `/?id=${title}`});
                    response.end();
                });
            });

    } else if(pathname === '/update') {
        fs.readdir('./data', (err, list) => {
            var indexTemplate = createIndexHTML(list);
            fs.readFile(`./data/${title}`, 'utf-8', (err, data) => {
                var title = queryData.id;
                var form = basicTempletFormHTML(title, data, UPDATE);
                var baseTemplate = basicTempletHTML(title, indexTemplate, form, ``);
                response.writeHead(200);
                response.end(baseTemplate);
            });
        });

    // file rename 처리할 방법..?
    } else if(pathname === '/update_process'){
        var body = '';
        request
            .on('data', (data) => { body += data; }) 
            .on('end', () => {
                var post = qs.parse(body);
                // console.log(post);
                var id = post.id;
                var title = post.title;
                var content = post.content;
                fs.rename(`data/${id}`, `data/${title}`, (err) => { 
                    fs.writeFile(`./data/${title}`, content, 'utf-8', (err) => {
                        response.writeHead(302, {Location: `/?id=${title}`});
                        response.end();
                    });
                });
            });

    } else {
        response.writeHead(404);
        response.end('Not Found');
    }
});

server.listen(8080);