export const sendMessage = async (message) => {
  const response = await fetch("http://localhost:5005/webhooks/rest/webhook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sender: "user",
      message,
    }),
  });

  return response.json();
};