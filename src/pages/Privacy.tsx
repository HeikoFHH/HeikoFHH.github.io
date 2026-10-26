import { legal } from "@/content/data";
import LegalPage, { LegalSection } from "./LegalPage";

const Privacy = () => (
  <LegalPage title="Privacy Policy">
    <LegalSection title="1. General information">
      <p>
        I take the protection of your personal data seriously. This website is processed in
        accordance with the General Data Protection Regulation (GDPR) and applicable German data
        protection law.
      </p>
    </LegalSection>

    <LegalSection title="2. Hosting and server log files">
      <p>
        This website is hosted on GitHub Pages, a service of GitHub Inc. (88 Colin P. Kelly Jr.
        Street, San Francisco, CA 94107, USA). When you visit this website, the hosting provider may
        automatically collect information such as IP address, browser type, operating system,
        referrer URL, time of access, and requested pages. This processing is carried out to ensure
        the technical operation, security, and stability of the website.
      </p>
      <p>Legal basis: Art. 6(1)(f) GDPR.</p>
    </LegalSection>

    <LegalSection title="3. Local storage">
      <p>
        If you switch between the light and dark theme, your choice is saved in your browser's local
        storage so that it can be applied on your next visit. This information stays on your device
        and is not transmitted to me or to third parties. Fonts are delivered from this website
        itself; no data is sent to external font providers.
      </p>
    </LegalSection>

    <LegalSection title="4. Contact by e-mail">
      <p>
        If you contact me by e-mail, the data you provide will be processed for the purpose of
        handling your request and any follow-up communication.
      </p>
      <p>
        Legal basis: Art. 6(1)(b) GDPR if your request relates to pre-contractual communication,
        otherwise Art. 6(1)(f) GDPR.
      </p>
    </LegalSection>

    <LegalSection title="5. Recipients">
      <p>
        Your data may be processed by technical service providers involved in hosting and delivering
        this website. Data is only shared where necessary for the operation of the site.
      </p>
    </LegalSection>

    <LegalSection title="6. Storage period">
      <p>
        Personal data is stored only for as long as necessary for the relevant processing purpose or
        as required by law.
      </p>
    </LegalSection>

    <LegalSection title="7. Your rights">
      <p>
        Under the GDPR, you have the right of access, rectification, erasure, restriction of
        processing, data portability, and objection. You also have the right to lodge a complaint
        with a competent supervisory authority.
      </p>
    </LegalSection>

    <LegalSection title="8. Third-country transfers">
      <p>
        Because the website is hosted by a provider based in the USA, data such as your IP address
        may be transferred to countries outside the EU/EEA. This will only take place in accordance
        with the applicable GDPR requirements.
      </p>
    </LegalSection>

    <LegalSection title="9. Changes">
      <p>
        I may update this Privacy Policy from time to time to reflect legal, technical, or
        operational changes. Last updated: {legal.updated}.
      </p>
    </LegalSection>
  </LegalPage>
);

export default Privacy;
