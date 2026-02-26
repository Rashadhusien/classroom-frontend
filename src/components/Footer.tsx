import React from "react";
import { Link } from "react-router";
import {
  Building,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Github,
  BookOpen,
  Users,
  HelpCircle,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Building className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-foreground">
                Classroom
              </span>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Empowering education through innovative classroom management.
              Connect, learn, and grow with our comprehensive learning platform.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://github.com"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/classes"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  Browse Classes
                </Link>
              </li>
              <li>
                <Link
                  to="/departments"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Building className="w-4 h-4" />
                  Departments
                </Link>
              </li>
              <li>
                <Link
                  to="/help"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <HelpCircle className="w-4 h-4" />
                  Help & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/about"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-muted-foreground">
                    123 Education Street
                    <br />
                    Learning City, LC 12345
                    <br />
                    United States
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <a
                  href="mailto:info@classroom.com"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  info@classroom.com
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <a
                  href="tel:+1234567890"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  +1 (234) 567-890
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              © {currentYear} Classroom. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link
                to="/privacy"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy
              </Link>
              <Link
                to="/terms"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Terms
              </Link>
              <Link
                to="/cookies"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
