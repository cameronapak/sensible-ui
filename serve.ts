Bun.serve({
  port: Number(process.env.PORT) || 3001,
  fetch() {
    return new Response(Bun.file("./dist/static/index.html"), {
      headers: { "content-type": "text/html" },
    });
  },
});

console.log(`Sensible UI static server running on port ${Number(process.env.PORT) || 3001}`);