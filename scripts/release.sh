echo "* cleaning up release files"
rm -rf .release
mkdir .release

echo "* building extension"
pnpm build
mv extension.zip .release/

echo "* zipping sources"
zip -r .release/source.zip ./src ./package.json ./pnpm-lock.yaml ./README.md ./postcss.config.cjs ./tsconfig.json ./vite.config.ts ./manifest.json ./biome.json ./tailwind.config.cjs ./LICENSE ./AA.json ./assets

echo "* publishing extension"
pnpm publish-extension \
  --chrome-zip .release/extension.zip \
  --firefox-zip .release/extension.zip \
  --firefox-sources-zip .release/source.zip

