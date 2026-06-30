import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Wrench,
  MapPin,
  Star,
  Loader2,
  X,
  ArrowLeft,
} from "lucide-react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { mechanicsApi, adminApi, resolveImage } from "../lib/api";
import { auth } from "../lib/firebase";
import MechanicForm from "../components/admin/MechanicForm";

/**
 * Admin — Firebase-gated dashboard to manage map mechanics. The admin signs in
 * with email/password; the server then verifies the Firebase ID token and that
 * the email is an authorized admin before any create / edit / delete.
 */
export default function Admin() {
  const [user, setUser] = useState(null);
  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [accessError, setAccessError] = useState("");

  // React to Firebase auth state; once signed in, confirm admin access server-side.
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setAccessError("");
      if (u) {
        try {
          await adminApi.verify();
          setAllowed(true);
        } catch (e) {
          setAllowed(false);
          setAccessError(
            e.status === 403
              ? "This account isn't authorized as an admin."
              : "Couldn't verify admin access. Try again."
          );
        }
      } else {
        setAllowed(false);
      }
      setChecking(false);
    });
    return unsub;
  }, []);

  if (checking) {
    return (
      <div className="grid min-h-screen place-items-center bg-bg">
        <Loader2 className="size-6 animate-spin text-accent" />
      </div>
    );
  }

  return user && allowed ? (
    <Dashboard onLogout={() => signOut(auth)} adminEmail={user.email} />
  ) : (
    <Login signedInNotAdmin={!!user} accessError={accessError} onSignOut={() => signOut(auth)} />
  );
}

/** Maps Firebase auth error codes to friendly copy. */
function authMessage(code) {
  switch (code) {
    case "auth/invalid-email":
      return "That email address looks invalid.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password.";
    case "auth/too-many-requests":
      return "Too many attempts. Try again later.";
    default:
      return "Sign-in failed. Please try again.";
  }
}

/* ------------------------------- Login ------------------------------- */
function Login({ signedInNotAdmin, accessError, onSignOut }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // onAuthStateChanged in <Admin> takes over from here.
    } catch (e2) {
      setErr(authMessage(e2.code));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-bg px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm rounded-3xl border border-line bg-card p-8 shadow-soft"
      >
        <div className="mb-6 flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-2xl bg-accent/10 text-accent">
            <ShieldCheck className="size-6" />
          </span>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-fg">Amcar Admin</h1>
            <p className="text-sm text-text-muted">Mechanics dashboard</p>
          </div>
        </div>

        {signedInNotAdmin ? (
          // Authenticated, but the email isn't on the admin allowlist.
          <div className="space-y-4">
            <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600 dark:border-red-500/30 dark:bg-red-500/10">
              {accessError || "This account isn't authorized as an admin."}
            </p>
            <button
              onClick={onSignOut}
              className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-accent font-semibold text-white transition-colors hover:bg-accent-deep"
            >
              Sign in with a different account
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-fg">Email</span>
              <input
                type="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@amcar.ge"
                className="mt-1.5 w-full rounded-xl border border-line bg-card px-4 py-3 text-sm text-fg outline-none focus:border-accent focus:ring-4 focus:ring-accent/10"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-fg">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1.5 w-full rounded-xl border border-line bg-card px-4 py-3 text-sm text-fg outline-none focus:border-accent focus:ring-4 focus:ring-accent/10"
              />
            </label>
            {err && <p className="text-sm font-medium text-red-500">{err}</p>}
            <button
              type="submit"
              disabled={busy}
              className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-accent font-semibold text-white transition-colors hover:bg-accent-deep disabled:opacity-60"
            >
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>
        )}

        <Link to="/" className="mt-5 inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-fg">
          <ArrowLeft className="size-4" /> Back to site
        </Link>
      </motion.div>
    </div>
  );
}

/* ----------------------------- Dashboard ----------------------------- */
function Dashboard({ onLogout, adminEmail }) {
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // mechanic | "new" | null
  const [busy, setBusy] = useState(false);

  const load = () => {
    setLoading(true);
    mechanicsApi.list().then(setMechanics).catch(() => {}).finally(() => setLoading(false));
  };

  // Initial fetch — `loading` already starts true, so we don't re-set it here
  // (keeps the effect free of synchronous setState).
  useEffect(() => {
    let alive = true;
    mechanicsApi
      .list()
      .then((d) => alive && setMechanics(d))
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const save = async (payload) => {
    setBusy(true);
    try {
      if (editing === "new") await mechanicsApi.create(payload);
      else await mechanicsApi.update(editing._id, payload);
      setEditing(null);
      load();
    } catch (e) {
      alert(`Save failed: ${e.message}${e.detail ? ` — ${e.detail}` : ""}`);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (m) => {
    if (!confirm(`Delete "${m.name}"? This cannot be undone.`)) return;
    try {
      await mechanicsApi.remove(m._id);
      load();
    } catch (e) {
      alert(`Delete failed: ${e.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-line bg-card/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-accent/10 text-accent">
              <ShieldCheck className="size-5" />
            </span>
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-fg">Amcar Admin</h1>
              <p className="text-xs text-text-muted">
                {mechanics.length} mechanics{adminEmail ? ` · ${adminEmail}` : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/map"
              className="hidden items-center gap-1.5 rounded-xl border border-line px-3 py-2 text-sm font-semibold text-fg hover:border-ink/30 sm:inline-flex"
            >
              <MapPin className="size-4" /> View map
            </Link>
            <button
              onClick={() => setEditing("new")}
              className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-3.5 py-2 text-sm font-semibold text-white hover:bg-accent-deep"
            >
              <Plus className="size-4" /> Add mechanic
            </button>
            <button
              onClick={onLogout}
              className="grid size-9 place-items-center rounded-xl border border-line text-text-muted hover:text-red-500"
              title="Log out"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </header>

      {/* List */}
      <main className="mx-auto max-w-6xl px-4 py-6">
        {loading ? (
          <div className="grid place-items-center py-24">
            <Loader2 className="size-6 animate-spin text-accent" />
          </div>
        ) : mechanics.length === 0 ? (
          <Empty onAdd={() => setEditing("new")} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mechanics.map((m) => (
              <MechanicCard key={m._id} m={m} onEdit={() => setEditing(m)} onDelete={() => remove(m)} />
            ))}
          </div>
        )}
      </main>

      {/* Editor modal */}
      <AnimatePresence>
        {editing && (
          <Modal title={editing === "new" ? "New mechanic" : `Edit · ${editing.name}`} onClose={() => setEditing(null)}>
            <MechanicForm
              initial={editing === "new" ? null : editing}
              onSubmit={save}
              onCancel={() => setEditing(null)}
              busy={busy}
            />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

function MechanicCard({ m, onEdit, onDelete }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-card shadow-soft">
      <div className="relative h-32 bg-surface">
        {m.image ? (
          <img src={resolveImage(m.image)} alt="" className="size-full object-cover" />
        ) : (
          <div className="grid size-full place-items-center text-text-muted">
            <Wrench className="size-8 opacity-40" />
          </div>
        )}
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-bold text-white ${
            m.isOpen ? "bg-emerald-500" : "bg-red-500"
          }`}
        >
          {m.isOpen ? "Open" : "Closed"}
        </span>
      </div>
      <div className="p-4">
        <h3 className="truncate font-bold tracking-tight text-fg">{m.name}</h3>
        <div className="mt-1 flex items-center gap-1.5 text-sm text-text-muted">
          <Star className="size-4 fill-amber-400 text-amber-400" />
          {Number(m.rating || 0).toFixed(1)} · {m.reviews || 0} reviews
        </div>
        {m.address && (
          <p className="mt-1.5 flex items-start gap-1.5 text-xs text-text-muted">
            <MapPin className="mt-0.5 size-3.5 shrink-0" /> <span className="line-clamp-1">{m.address}</span>
          </p>
        )}
        <div className="mt-4 flex gap-2">
          <button
            onClick={onEdit}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-line py-2 text-sm font-semibold text-fg hover:border-ink/30"
          >
            <Pencil className="size-4" /> Edit
          </button>
          <button
            onClick={onDelete}
            className="grid size-9 place-items-center rounded-lg border border-line text-text-muted hover:border-red-300 hover:text-red-500"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Empty({ onAdd }) {
  return (
    <div className="grid place-items-center rounded-3xl border border-dashed border-line py-24 text-center">
      <Wrench className="size-10 text-text-muted opacity-40" />
      <h3 className="mt-4 text-lg font-bold text-fg">No mechanics yet</h3>
      <p className="mt-1 max-w-xs text-sm text-text-muted">
        Add your first car mechanic to plot it on the map.
      </p>
      <button
        onClick={onAdd}
        className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-deep"
      >
        <Plus className="size-4" /> Add mechanic
      </button>
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="my-8 w-full max-w-2xl rounded-3xl border border-line bg-card shadow-lift"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-3xl border-b border-line bg-card/95 px-6 py-4 backdrop-blur">
          <h2 className="text-lg font-extrabold tracking-tight text-fg">{title}</h2>
          <button
            onClick={onClose}
            className="grid size-9 place-items-center rounded-xl text-text-muted hover:bg-ink/5 hover:text-fg"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </motion.div>
  );
}
