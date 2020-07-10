var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');


//code___basicTempletFormHTML( , , code)
const CREATE = '0';
const UPDATE = '1';
const DELETE = '2';

//code___basicTempletHTML( , , , code)
const INDEXPAGE = '0';
const DETAILPAGE = '1';


function createIndexHTML(filelist){
    var list = ``;
    for(key in filelist){
        list += `<li><a href="/?id=${filelist[key]}">${filelist[key]}</a></li>`;
    }
    return list;
}


function basicTempletHTML(title, filelist, body, code){
    var actCreateLink = ``;
    var btnDelete = ``;
    if(code==='0'){
        actCreateLink = `<a href="/create">create</a>`;
    } else if(code==='1') {
        actCreateLink = `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`;
        btnDelete = basicTempletFormHTML(title, ``, DELETE);
    } else {
        console.log('error___basicTempleHTML()');
    }
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
                <br>
            <p>${actCreateLink}</p>

            <h2>${title}</h2>
            
            <p>${body}</p>
            <p>${btnDelete}</p>

            </body>
        </html>    
    `;
}


function basicTempletFormHTML(title=null, data=null, code){
    //FORM '/create'
    if(code === '0'){
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
    //FORM '/update'
    } else if(code === '1'){
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
    //FORM '/delete'
    } else if(code === '2'){
        return `
            <form action="/delete_process" method="post" onsubmit="return confirm('delete??');">
                <input type="hidden" name="id" value="${title}"/>
                <p>
                    <br><input type="submit" name="${title}" value="delete"/>
                </p>
            </form>
        `;
    }
    return `
        error___basicTempletFormHTML()
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
                var baseTemplate = ``;
                var body = ``;
                // data===undefined  ->  root page
                if(data === undefined){
                    title = 'Welcome!';
                    body = 'Hello Node js';
                    baseTemplate = basicTempletHTML(title, indexTemplate, body, INDEXPAGE);
                } else {
                    body = data;
                    baseTemplate = basicTempletHTML(title, indexTemplate, body, DETAILPAGE);
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
                var baseTemplate = basicTempletHTML(title, indexTemplate, form, null);
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
                var baseTemplate = basicTempletHTML(title, indexTemplate, form, null);
                response.writeHead(200);
                response.end(baseTemplate);
            });
        });
    
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
    
    } else if(pathname === '/delete_process'){
        var body = '';
        request
            .on('data', (data) => { body += data; })
            .on('end', () => {
                var post = qs.parse(body);
                console.log(post);
                var title = post.id;
                fs.unlink(`data/${title}`, (err) => {
                    response.writeHead(302, {Location: `/`});
                    response.end();
                });
            });
    
    } else {
        response.writeHead(404);
        response.end('Not Found');
    }
});

server.listen(8080);