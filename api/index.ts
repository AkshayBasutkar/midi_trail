export default function handler(req: any, res: any) {
  if (req.method === "GET" && req.url === "/api/test") {
    return res.status(200).json({
      message: "Server is working",
      timestamp: new Date().toISOString(),
    });
  }

  // For any other API routes, return 404
  return res.status(404).json({
    message: "API endpoint not found",
  });
}
