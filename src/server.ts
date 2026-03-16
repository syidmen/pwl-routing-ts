import * as http from 'http';

// 1. Data Statis
const products = [
  { id: 1, name: "Laptop" },
  { id: 2, name: "Mouse" }
];

const users = [
  { id: 123, name: "Alice", role: "Admin" },
  { id: 456, name: "Bob", role: "User" }
];

const PORT = 3000; // Tugas no 4: Node.js di port 3000

const server = http.createServer((req, res) => {
  // --- 3. MIDDLEWARE: LOG WAKTU ---
  const start = performance.now(); // Mulai hitung waktu
  
  const url = req.url || '/';
  const method = req.method || 'GET';

  // Helper untuk mengirim JSON (agar tidak menulis res.writeHead berulang kali)
  const sendJSON = (status: number, data: any) => {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  };

  // --- 1. RUTE PRODUK ---
  if (url === '/products' && method === 'GET') {
    sendJSON(200, products);
  } 
  else if (url === '/products' && method === 'POST') {
    sendJSON(201, { message: "Produk berhasil ditambahkan (Node.js Simulasi)" });
  }

  // --- 2. RUTE USER DINAMIS (/users/:id) ---
  else if (url.startsWith('/users/') && method === 'GET') {
    const pathParts = url.split('/'); // ["", "users", "123"]
    const idRaw = pathParts[2];
    const userId = parseInt(idRaw);

    if (isNaN(userId)) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end("ID harus berupa angka");
    } else {
      const user = users.find(u => u.id === userId);
      if (user) {
        sendJSON(200, user);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end("User Tidak Ditemukan");
      }
    }
  }

  // Rute Utama
  else if (url === '/' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>🏠 Server Node.js</h1><p>Gunakan /products atau /users/123</p>');
  }

  // Default 404
  else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>❌ 404 - Halaman Tidak Ditemukan</h1>');
  }

  // --- SELESAI MIDDLEWARE: HITUNG DURASI ---
  // Kita gunakan event 'finish' agar waktu yang dihitung benar-benar sampai respons selesai dikirim
  res.on('finish', () => {
    const duration = (performance.now() - start).toFixed(4);
    console.log(`[${new Date().toLocaleTimeString()}] ${method} ${url} - ${duration}ms`);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Node.js Server berjalan di http://localhost:${PORT}`);
});