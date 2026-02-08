import { Link } from 'react-router-dom';
import { Linkedin, Facebook, Github } from 'lucide-react';

const socials = [
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/imtiaz-al-kabir/', icon: Linkedin },
  { name: 'Facebook', href: 'https://www.facebook.com/imtiaz.alkabir', icon: Facebook },
  { name: 'GitHub', href: 'https://github.com/imtiaz-al-kabir/react-increment', icon: Github },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/5 bg-dark-950/50 backdrop-blur-sm relative z-10">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-500/20">
            T
          </div>
          <span className="font-display font-bold text-xl tracking-wide text-white">
            TaskEarn
          </span>
        </Link>

        <p className="text-sm text-slate-500">
          &copy; {new Date().getFullYear()} TaskEarn. All rights reserved.
        </p>

        <div className="flex gap-4">
          {socials.map(({ name, href, icon: Icon }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-brand-400 transition-all hover:scale-110"
              aria-label={name}
            >
              <Icon size={20} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
