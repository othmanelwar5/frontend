const http = require("http");
const fs = require("fs");
const path = require("path");

const root = process.cwd();

function loadLocalEnv() {
    const envPath = path.join(root, ".env");
    if (!fs.existsSync(envPath)) return;

    const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
        const eq = trimmed.indexOf("=");
        const key = trimmed.slice(0, eq).trim();
        const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
        if (key && process.env[key] === undefined) {
            process.env[key] = value;
        }
    }
}

loadLocalEnv();

const port = process.env.PORT || 3000;
const publicApiUrl = process.env.MYMIZAN_API_URL || process.env.NEXT_PUBLIC_API_URL || "";

function envFlag(name, fallback) {
    const raw = process.env[name];
    if (raw === undefined || raw === "") return fallback;
    return raw !== "false" && raw !== "0";
}

const pixelConfig = {
    enabled: envFlag("NEXT_PUBLIC_ENABLE_PIXELS", envFlag("CAPI_ENABLED", true)),
    metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || process.env.META_PIXEL_ID || "",
    tiktokPixelId: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || process.env.TIKTOK_PIXEL_ID || "",
    snapPixelId: process.env.NEXT_PUBLIC_SNAP_PIXEL_ID || process.env.SNAP_PIXEL_ID || ""
};

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
        res.end(
            `window.MYMIZAN_API_URL = ${JSON.stringify(publicApiUrl)};\n` +
            `window.MYMIZAN_PIXEL_CONFIG = ${JSON.stringify(pixelConfig)};\n`
        );
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

        const ext = path.extname(file).toLowerCase();
        const noCache = ext === ".js" || ext === ".css" || ext === ".html";
        res.writeHead(200, {
            "Content-Type": types[ext] || "application/octet-stream",
            ...(noCache ? { "Cache-Control": "no-cache, no-store, must-revalidate" } : {})
        });
        res.end(data);
    });
});

const host = process.env.HOST || "0.0.0.0";
server.listen(port, host, () => {
    console.log(`Frontend server running at http://${host}:${port}`);
});
