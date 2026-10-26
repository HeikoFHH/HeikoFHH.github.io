import { Link } from "react-router-dom";
import { profile } from "@/content/data";

const Footer = () => (
  <footer className="mt-4 border-t border-line py-8 text-center text-xs text-muted">
    <p>© {new Date().getFullYear()} {profile.name}</p>
    <p className="mt-1">
      <Link to="/privacy" className="hover:underline">
        Privacy Policy
      </Link>{" "}
      |{" "}
      <Link to="/impressum" className="hover:underline">
        Impressum
      </Link>
    </p>
  </footer>
);

export default Footer;
