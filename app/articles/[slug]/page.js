const ARTICLE_API_BASE =
  'https://christiansbiblecompanion.com/hcgi/platform/api/collections/articles/records';

async function getArticle(slug) {
  const filter = encodeURIComponent(`slug="${slug}"`);
  const url = `${ARTICLE_API_BASE}?filter=${filter}&skipTotal=1`;

  const response = await fetch(url, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch article: ${response.status}`);
  }

  const data = await response.json();
  const article = data.items?.[0];

  if (!article) {
    return null;
  }

  return article;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return (
      <main>
        <h1>Article Not Found</h1>
        <p>No article was found for this URL.</p>
      </main>
    );
  }

  return (
    <main>
      <h1>{article.title}</h1>
      <article dangerouslySetInnerHTML={{ __html: article.content }} />
    </main>
  );
}
