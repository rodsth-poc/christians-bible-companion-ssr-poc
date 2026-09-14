const ARTICLE_URL =
  'https://christiansbiblecompanion.com/hcgi/platform/api/collections/articles/records?filter=slug%3D%22how-to-grow-spiritually-every-day%22&skipTotal=1';

export default async function ArticlePage() {
  const response = await fetch(ARTICLE_URL, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch article: ${response.status}`);
  }

  const data = await response.json();
  const article = data.items?.[0];

  if (!article) {
    throw new Error('Article not found');
  }

  return (
    <main>
      <h1>{article.title}</h1>
      <article dangerouslySetInnerHTML={{ __html: article.content }} />
    </main>
  );
}
