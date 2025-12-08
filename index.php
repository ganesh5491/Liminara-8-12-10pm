<?php
/**
 * Main Entry Point for IndoSaga PHP Application
 * Handles both API and static file serving
 */

// Get the request URI
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Handle API requests
if (strpos($requestUri, '/api/') === 0) {
    // Include the API router
    require_once __DIR__ . '/api/index.php';
    exit();
}

// For all other requests, serve the static React app
$staticFile = __DIR__ . '/dist' . $requestUri;

// Check if it's a static file that exists
if (file_exists($staticFile) && !is_dir($staticFile)) {
    // Serve the static file
    $extension = pathinfo($staticFile, PATHINFO_EXTENSION);
    
    // Set appropriate content type
    $contentTypes = [
        'html' => 'text/html',
        'css' => 'text/css',
        'js' => 'application/javascript',
        'json' => 'application/json',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'gif' => 'image/gif',
        'svg' => 'image/svg+xml',
        'ico' => 'image/x-icon',
        'woff' => 'font/woff',
        'woff2' => 'font/woff2',
        'ttf' => 'font/ttf',
        'eot' => 'application/vnd.ms-fontobject'
    ];
    
    if (isset($contentTypes[$extension])) {
        header('Content-Type: ' . $contentTypes[$extension]);
    }
    
    readfile($staticFile);
    exit();
}

// For all other requests (SPA routing), serve index.html
$indexFile = __DIR__ . '/dist/index.html';

if (file_exists($indexFile)) {
    header('Content-Type: text/html');
    readfile($indexFile);
} else {
    // Fallback if built app doesn't exist
    header('Content-Type: text/html');
    echo '<!DOCTYPE html>
<html>
<head>
    <title>Liminara Cosmetics • Backend Active</title>
    <style>
        body{
            font-family: "Segoe UI", Arial, sans-serif;
            background:#fff5fb;
            margin:40px;
            color:#333;
            text-align:center;
        }
        h1{
            background:linear-gradient(120deg,#ec4899,#d946ef);
            -webkit-background-clip:text;
            color:transparent;
            font-size:38px;
            font-weight:700;
        }
        .box{
            background:white;
            width:60%;
            margin:30px auto;
            padding:25px;
            border-radius:12px;
            box-shadow:0 4px 14px rgba(0,0,0,.1);
        }
        ul{ text-align:left; width:fit-content; margin:auto; }
        a{ color:#d946ef; font-weight:600; text-decoration:none; }
        a:hover{ text-decoration:underline; }
        pre{ background:#faf0ff; padding:10px; border-radius:6px; }
    </style>
</head>

<body>
    <h1>💖 Liminara Cosmetics</h1>
    <div class="box">
        <p>🚀 Your PHP backend is live and running beautifully!</p>

        <p>🛠 To generate production build, run:</p>
        <pre>npm run build</pre>

        <p>🔗 Backend API is available here → 
            <a href="/api">/api</a>
        </p>

        <p>📡 API Testing Endpoints</p>
        <ul>
            <li><a href="/api/categories">Product Categories</a></li>
            <li><a href="/api/products">All Products</a></li>
            <li><a href="/api/products/featured">Featured Products</a></li>
        </ul>
    </div>
</body>
</html>
