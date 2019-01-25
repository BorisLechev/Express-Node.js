const fs = require('fs');
const url = require('url');
const path = require('path');

function getContentType(url) {
    const contentTypes = {
        ".css": "text/css",
        ".ico": "image/x-icon",
        ".html": "text/html",
        ".jpg": "image/jpeg",
        ".png": "image/png",
        ".js": "application/javascript"
    };

    let fileExtension = "." + url.split('.').pop();

    return contentTypes[fileExtension];
}

module.exports = (req, res) => {

    if (req.pathname.startsWith("/public/") && req.method === "GET") {
        let filePath = path.normalize(
            path.join(__dirname, `..${req.pathname}`)
        );

        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404, {
                    "Content-Type": "text/plain"
                });

                res.write("Resource not found");
                res.end();

                return;
            } else {
                let contentType = getContentType(req.pathname);

                if (contentType === undefined) {
                    res.writeHead(404, {
                        "Content-Type": "text/plain"
                    });

                    res.write("Resource not found");
                    res.end();
                    return;
                }

                res.writeHead(200, {
                    "Content-Type": contentType
                });

                res.write(data);
                res.end();
            }
        });
    } else {
        return true;
    }
};