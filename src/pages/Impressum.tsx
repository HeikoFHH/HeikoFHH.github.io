import { legal } from "@/content/data";
import LegalPage, { LegalSection } from "./LegalPage";

const Impressum = () => (
  <LegalPage title="Impressum">
    <LegalSection title="Kontakt">
      <p>
        E-Mail:{" "}
        <a href={`mailto:${legal.email}`} className="underline">
          {legal.email}
        </a>
      </p>
    </LegalSection>

    <LegalSection title="Zweck der Website">
      <p>This website is for personal use only and has no commercial role.</p>
    </LegalSection>

    <LegalSection title="Haftung für Inhalte">
      <p>
        The contents of this website were created with great care. However, I cannot guarantee the
        accuracy, completeness, or timeliness of the content.
      </p>
    </LegalSection>

    <LegalSection title="Haftung für Links">
      <p>
        This website may contain links to external websites of third parties, over whose contents I
        have no control. Therefore, I cannot assume any liability for these external contents.
      </p>
    </LegalSection>

    <LegalSection title="Urheberrecht">
      <p>
        The content and works on this website are subject to copyright. Reproduction, editing,
        distribution, or any kind of use outside the limits of copyright law require prior written
        consent.
      </p>
    </LegalSection>
  </LegalPage>
);

export default Impressum;
