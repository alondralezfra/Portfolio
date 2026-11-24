import type { Story } from "../model";

interface Props {
  story: Story;
}

function Photo({ src, alt }: { src: string | null; alt: string }) {
  if (src) return <img src={`${import.meta.env.BASE_URL}${src}`} alt={alt} className="photo" loading="lazy" />;
  // Placeholder until a real photo is added; hidden from assistive tech because it carries no information.
  return <div className="photo placeholder" aria-hidden="true">photo coming soon</div>;
}

/** "Our Story": the corkboard with the owner's note, hobbies, the Valley and photos. */
export function OurStory({ story }: Props) {
  return (
    <div className="story">
      <section className="note owner" aria-labelledby="story-owner">
        <h2 id="story-owner">{story.owner.heading}</h2>
        <Photo src={story.owner.photo} alt={story.owner.photoAlt} />
        {story.owner.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
        <p>
          <strong>{story.origin.heading}:</strong> {story.origin.text}
        </p>
      </section>

      <section aria-labelledby="story-hobbies">
        <h2 id="story-hobbies">Hobbies</h2>
        <ul className="polaroids">
          {story.hobbies.map((hobby) => (
            <li key={hobby.id} className="polaroid">
              <Photo src={hobby.photo} alt={hobby.photoAlt} />
              <h3>{hobby.title}</h3>
              <p>{hobby.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="note culture" aria-labelledby="story-culture">
        <h2 id="story-culture">{story.culture.heading}</h2>
        {story.culture.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </section>

      <section aria-labelledby="story-photos">
        <h2 id="story-photos">Photos</h2>
        <ul className="polaroids">
          {story.photos.map((photo) => (
            <li key={photo.id} className="polaroid">
              <Photo src={photo.src} alt={photo.alt} />
              <p>{photo.caption}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
