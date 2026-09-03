import type { NextConfig } from "next";

// GitHub Pages serves this repo at https://<user>.github.io/northern-trip-app/,
// so production builds need that path baked into every asset/link.
// Local `next dev` stays at the root (no prefix) for a normal dev experience.
const repoName = "northern-trip-app";
const isGithubActionsBuild = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: isGithubActionsBuild ? `/${repoName}` : "",
  assetPrefix: isGithubActionsBuild ? `/${repoName}/` : "",
};

export default nextConfig;
