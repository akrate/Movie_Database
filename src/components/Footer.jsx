const iconCls =
  "h-7 w-7 rounded-md grayscale transition hover:grayscale-0 hover:scale-110";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-slate-800 bg-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-6 text-center">
        <p className="text-sm text-slate-400">© 2025 | Built by Oussama</p>
        <div className="flex items-center gap-4">
          <a
            href="https://www.instagram.com/oussa_maakrate?utm_source=qr&igsh=NDB6eXNrczR6MHM5"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
          >
            <img
              className={iconCls}
              src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png"
              alt="Instagram"
            />
          </a>
          <a
            href="https://www.linkedin.com/in/oussama-akrate-515614287/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <img
              className={iconCls}
              src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
              alt="LinkedIn"
            />
          </a>
          <a
            href="https://github.com/akrate"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <img
              className={iconCls}
              src="https://cdn-icons-png.flaticon.com/512/733/733553.png"
              alt="GitHub"
            />
          </a>
          <a
            href="https://wa.me/212697435506"
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
          >
            <img
              className={iconCls}
              src="https://cdn-icons-png.flaticon.com/512/733/733585.png"
              alt="WhatsApp"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
