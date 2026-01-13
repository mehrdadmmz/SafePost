import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Code, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-default-200 bg-default-50 dark:bg-default-100/50">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <img src="/vault.png" alt="DevVault" className="w-8 h-8" />
              <h3 className="text-lg font-bold">DevVault</h3>
            </div>
            <p className="text-sm text-default-600 max-w-md">
              Your vault of developer knowledge. Share solutions, tutorials, and technical insights with the community.
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-default-600 hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-default-600 hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-default-600 hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-default-600 hover:text-primary transition-colors">
                  Knowledge Base
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-default-600 hover:text-primary transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/tags" className="text-default-600 hover:text-primary transition-colors">
                  Tags
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-default-600 hover:text-primary transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-default-600 hover:text-primary transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="text-default-600 hover:text-primary transition-colors">
                  Community Guidelines
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-default-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-default-500">
            © {currentYear} DevVault. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-default-500">
            <span>Built with</span>
            <Heart size={12} className="text-danger fill-danger" />
            <span>by developers, for developers</span>
            <Code size={12} className="ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
