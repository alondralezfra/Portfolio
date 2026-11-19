import { useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import type { Contact } from "../model";

interface Props {
  contact: Contact;
}

type CopyStatus = "idle" | "copied" | "failed";

/** Header button that opens the cafe company card in a modal dialog. The native <dialog> traps focus and restores it on close. */
export function BusinessCard({ contact }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [flipped, setFlipped] = useState(false);
  const [copy, setCopy] = useState<CopyStatus>("idle");

  function open() {
    setFlipped(false);
    setCopy("idle");
    dialogRef.current?.showModal();
  }

  function close() {
    dialogRef.current?.close();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    }
  }

  // A click on the dialog element itself (not its contents) is a click on the backdrop.
  function onClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) close();
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopy("copied");
    } catch {
      setCopy("failed");
    }
  }

  return (
    <>
      <button type="button" className="btn card-button" onClick={open}>
        Get my card
      </button>
      <dialog
        ref={dialogRef}
        className="card-dialog"
        aria-label="Cafe company card"
        onKeyDown={onKeyDown}
        onClick={onClick}
      >
        <div className="card">
          <div hidden={flipped} className="card-face">
            <p className="eyebrow">Cafe company card</p>
            <h2 id="card-title">{contact.name}</h2>
            <p className="card-role">{contact.role}</p>
            <p>{contact.tagline}</p>
          </div>
          <div hidden={!flipped} className="card-face">
            <h2 className="card-back-title">Find me here</h2>
            <ul className="card-links">
              <li>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>{" "}
                <button type="button" className="btn secondary" onClick={copyEmail}>
                  Copy email
                </button>
              </li>
              <li>
                <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn<span className="visually-hidden"> (opens in a new tab)</span>
                </a>
              </li>
              <li>
                <a href={contact.github} target="_blank" rel="noopener noreferrer">
                  GitHub<span className="visually-hidden"> (opens in a new tab)</span>
                </a>
              </li>
            </ul>
            <p role="status" className="card-status">
              {copy === "copied" && "Email copied to the clipboard."}
              {copy === "failed" && "Could not copy. Select the email above and copy it."}
            </p>
          </div>
        </div>
        <div className="card-actions">
          <button type="button" className="btn secondary" onClick={() => setFlipped((f) => !f)}>
            Flip card<span className="visually-hidden"> to see {flipped ? "the front" : "the back with contact links"}</span>
          </button>
          <button type="button" className="btn" onClick={close}>
            Close
          </button>
        </div>
      </dialog>
    </>
  );
}
