function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      if (!body.trim()) {
        return reject(new Error("Empty body received"));
      }

      try {
        const parsed = JSON.parse(body);
        resolve(parsed);
      } catch {
        reject(new Error("Invalid JSON format"));
      }
    });

    req.on("error", reject);
  });
}

module.exports = { parseBody };
