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
  /** When set, renderAfterSection is rendered immediately after the section with this id */
  insertAfterSectionId?: string;
  renderAfterSection?: React.ReactNode;
}

export function Article({ sections, insertAfterSectionId, renderAfterSection }: ArticleProps) {
  return (
    <article className="max-w-3xl mx-auto">
      {sections.map((section) => (
        <div key={section.id}>
          <section data-section-id={section.id} className="mb-12">
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
          {section.id === insertAfterSectionId && renderAfterSection}
        </div>
      ))}
    </article>
  );
}
