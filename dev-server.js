const http = require("http");
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const port = process.env.PORT || 3000;
const publicApiUrl = process.env.MYMIZAN_API_URL || process.env.NEXT_PUBLIC_API_URL || "";

const types = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".webp": "image/webp"
};

function resolveFile(urlPath) {
    const decoded = decodeURIComponent(urlPath.split("?")[0]);
    const cleanPath = decoded === "/" ? "index.html" : decoded.replace(/^\/+/, "");
    const withIndex = cleanPath.endsWith("/") ? `${cleanPath}index.html` : cleanPath;
    const directFile = path.normalize(path.join(root, withIndex));

    if (directFile.startsWith(root) && fs.existsSync(directFile) && fs.statSync(directFile).isFile()) {
        return directFile;
    }

    const htmlFile = path.normalize(path.join(root, `${cleanPath}.html`));
    if (htmlFile.startsWith(root) && fs.existsSync(htmlFile) && fs.statSync(htmlFile).isFile()) {
        return htmlFile;
    }

    const nestedIndex = path.normalize(path.join(root, cleanPath, "index.html"));
    if (nestedIndex.startsWith(root) && fs.existsSync(nestedIndex) && fs.statSync(nestedIndex).isFile()) {
        return nestedIndex;
    }

    return null;
}

const server = http.createServer((req, res) => {
    const requestPath = (req.url || "/").split("?")[0];
    if (requestPath === "/env.js") {
        res.writeHead(200, {
            "Content-Type": "text/javascript; charset=utf-8",
            "Cache-Control": "no-store"
        });
        res.end(`window.MYMIZAN_API_URL = ${JSON.stringify(publicApiUrl)};\n`);
        return;
    }

    const file = resolveFile(req.url || "/");
    if (!file) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Not found");
        return;
    }

    fs.readFile(file, (error, data) => {
        if (error) {
            res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("Server error");
            return;
        }

        res.writeHead(200, { "Content-Type": types[path.extname(file).toLowerCase()] || "application/octet-stream" });
        res.end(data);
    });
});

const host = process.env.HOST || "0.0.0.0";
server.listen(port, host, () => {
    console.log(`Frontend server running at http://${host}:${port}`);
});
