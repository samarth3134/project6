const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

function readPage(fileName) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(rootDir, 'pages', fileName);
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
}

function readCSS() {
  return new Promise((resolve, reject) => {
    const filePath = path.join(rootDir, 'public', 'style.css');
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
}

const routes = {
  '/': 'home.html',
  '/home': 'home.html',
  '/about': 'about.html',
  '/contact': 'contact.html',
};

module.exports = async (req, res) => {
  const { url } = req;

  if (url === '/favicon.ico') {
    res.writeHead(204);
    res.end();
    return;
  }

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

  const pageFile = routes[url];

  if (pageFile) {
    try {
      const html = await readPage(pageFile);
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
    } catch {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 Internal Server Error');
    }
  } else {
    try {
      const html = await readPage('404.html');
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end(html);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Page Not Found');
    }
  }
};
