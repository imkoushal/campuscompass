import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-outline-variant/10 bg-surface-container-lowest w-full py-12 px-4 md:px-8 mt-12">
      <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="max-w-xs">
          <div className="text-2xl font-bold text-on-surface mb-3">CampusCompass</div>
          <p className="text-sm text-on-surface-variant">
            The definitive platform for higher education insights and college discovery.
            Built for the next generation of leaders.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          <div>
            <h5 className="text-xs font-bold text-on-surface uppercase mb-4 tracking-wider">Product</h5>
            <ul className="space-y-2 text-sm text-on-surface-variant">
              <li><Link href="/colleges" className="hover:text-secondary transition-colors">Discovery</Link></li>
              <li><Link href="/compare" className="hover:text-secondary transition-colors">Compare</Link></li>
              <li><Link href="/saved" className="hover:text-secondary transition-colors">Saved</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-xs font-bold text-on-surface uppercase mb-4 tracking-wider">Company</h5>
            <ul className="space-y-2 text-sm text-on-surface-variant">
              <li><a href="#" className="hover:text-secondary transition-colors">About</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-xs font-bold text-on-surface uppercase mb-4 tracking-wider">Legal</h5>
            <ul className="space-y-2 text-sm text-on-surface-variant">
              <li><a href="#" className="hover:text-secondary transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-screen-2xl mx-auto mt-10 pt-6 border-t border-outline-variant/5 text-center">
        <p className="text-xs text-on-surface-variant">© 2024 CampusCompass Inc. All rights reserved.</p>
      </div>
    </footer>
  );
}
