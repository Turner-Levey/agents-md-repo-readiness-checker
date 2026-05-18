const host = "agents-md-repo-readiness-checker.vercel.app";
const key = "771d71868dbb66bdf5c15a0ebe1e4054";
const baseUrl = `https://${host}`;
const urls = ["/", "/AGENTS.md", "/llms.txt", "/sitemap.xml"].map((pathname) => `${baseUrl}${pathname}`);

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    host,
    key,
    keyLocation: `${baseUrl}/${key}.txt`,
    urlList: urls
  })
});

console.log(JSON.stringify({ status: response.status, urls }, null, 2));
if (!response.ok && response.status !== 202) {
  process.exitCode = 1;
}
