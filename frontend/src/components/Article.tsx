/**
 * Article component - Display reading content with dwell time tracking
 *
 * Each section has a data-section-id attribute for IntersectionObserver
 * tracking in useBehaviourCollector
 */

interface ArticleSection {
  id: string;
  heading: string;
  paragraphs: string[];
}

interface ArticleProps {
  sections: ArticleSection[];
}

export function Article({ sections }: ArticleProps) {
  return (
    <article className="max-w-3xl mx-auto">
      {sections.map((section) => (
        <section key={section.id} data-section-id={section.id} className="mb-12">
          <h2
            className="font-bold mb-4 adaptive-transition"
            style={{
              fontSize: 'calc(var(--font-size-base) * 1.5)',
              lineHeight: 'var(--line-height)',
            }}
          >
            {section.heading}
          </h2>
          <div className="space-y-4">
            {section.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="adaptive-transition"
                style={{
                  fontSize: 'var(--font-size-base)',
                  lineHeight: 'var(--line-height)',
                }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      ))}
    </article>
  );
}
