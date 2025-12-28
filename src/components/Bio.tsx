/**
 * Props interface to pass in title and bio as a single object destructured.
 */
interface Props {
  title: string;
  bio: string;
}

/**
 * React component for bio.
 * @param param0 
 * @returns 
 */
export function Bio({ title, bio }: Props) {
    return (
        <section>
            <h1 className="hero-title" data-testid="title">{title}</h1>
            <p className="hero-bio" data-testid="bio">{bio}</p>
        </section>
    )
};