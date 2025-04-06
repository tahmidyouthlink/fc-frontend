// app/api/theme/route.js
export async function GET() {
  // Simulate 2-second delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Fake data
  const isTopHeaderEnabled = false; // Change this to simulate the behavior

  return new Response(JSON.stringify({ isTopHeaderEnabled }));
}
