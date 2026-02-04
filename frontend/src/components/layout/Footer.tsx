import { Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:py-8">
        <div className="flex flex-col items-center gap-4 md:hidden">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-600">
            <a className="transition-colors hover:text-slate-900" href="#">
              FAQ
            </a>
            <span className="text-slate-300">|</span>
            <a className="transition-colors hover:text-slate-900" href="#">
              Contact
            </a>
            <span className="text-slate-300">|</span>
            <a className="transition-colors hover:text-slate-900" href="#">
              Privacy
            </a>
          </div>
          <div className="flex items-center gap-6 text-slate-400">
            <Facebook className="h-5 w-5" />
            <Twitter className="h-5 w-5" />
            <Instagram className="h-5 w-5" />
          </div>
        </div>

        <div className="hidden items-center justify-center gap-6 text-sm text-slate-600 md:flex">
          <a className="transition-colors hover:text-slate-900" href="#">
            About
          </a>
          <span className="text-slate-300">|</span>
          <a className="transition-colors hover:text-slate-900" href="#">
            FAQ
          </a>
          <span className="text-slate-300">|</span>
          <a className="transition-colors hover:text-slate-900" href="#">
            Contact
          </a>
          <span className="text-slate-300">|</span>
          <a className="transition-colors hover:text-slate-900" href="#">
            Privacy Policy
          </a>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-4 text-slate-400">
            <Facebook className="h-4 w-4" />
            <Twitter className="h-4 w-4" />
            <Instagram className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-slate-400 md:mt-6">
          © {new Date().getFullYear()} Read-a-thon. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
