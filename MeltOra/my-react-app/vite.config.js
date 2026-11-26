{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [
    {
      "source": "/meltora-br-admin",
      "destination": "/index.html"
    },
    {
      "source": "/((?!assets/|favicon\\.svg|icons\\.svg).*)",
      "destination": "/index.html"
    }
  ]
}
