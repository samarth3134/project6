// Import the built-in http module to create a web server
const http = require('http');
// Import fs module for async file reading
const fs = require('fs');
// Import path module for safe file path resolution
const path = require('path');

const PORT = 3001;

// Helper function to read an HTML file asynchronously
function readPage(fileName) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, 'pages', fileName);
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
}

// Helper function to read the CSS file
function readCSS() {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, 'public', 'style.css');
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
}

// Route definitions mapping paths to page files
const routes = {
  '/': 'home.html',
  '/home': 'home.html',
  '/about': 'about.html',
  '/contact': 'contact.html',
};

// Create the HTTP server
const server = http.createServer(async (req, res) => {
  const { url } = req;

  console.log(`Request: ${req.method} ${url}`);

  // Ignore favicon requests to prevent unwanted 404s
  if (url === '/favicon.ico') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Serve CSS file when requested
  if (url === '/style.css') {
    try {
      const css = await readCSS();
      res.writeHead(200, { 'Content-Type': 'text/css' });
      res.end(css);
    } catch {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    }
    return;
  }

  // Determine which page to serve based on the requested URL
  const pageFile = routes[url];

  if (pageFile) {
    try {
      const html = await readPage(pageFile);
      // 200 OK — the route exists and page was loaded
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
    } catch {
      // 500 Internal Server Error — file read failed
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 Internal Server Error');
    }
  } else {
    // 404 Not Found — no matching route, serve custom 404 page
    try {
      const html = await readPage('404.html');
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end(html);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Page Not Found');
    }
  }
});

// Start the server and listen on the specified port
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  console.log(`Routes: /home, /about, /contact`);
});
