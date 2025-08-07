function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        if (!body.trim()) {
          return reject(new Error("Empty request body"));
        }

        const parsed = JSON.parse(body);
        resolve(parsed);
      } catch (err) {
        reject(new Error("Invalid JSON format"));
      }
    });

    req.on("error", (err) => {
      reject(err);
    });
  });
}

module.exports = { parseBody };
