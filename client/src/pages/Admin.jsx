import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  LogOut,
  Plus,
  Trash2,
  Wrench,
  MapPin,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { mechanicsApi, adminApi } from "../lib/api";
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

        <Link to="/home" className="mt-5 inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-fg">
          <ArrowLeft className="size-4" /> Back to site
        </Link>
      </motion.div>
    </div>
  );
}

/* ----------------------------- Dashboard ----------------------------- */
// Two screens, matching the mobile admin panel: a Mechanics List and a shared
// Add/Edit Form. `editing` selects the screen: null → List, "new" → Form
// (create), a mechanic object → Form (edit).
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
      setEditing(null); // back to the List…
      load(); // …which refreshes.
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

  // Screen B — the Add/Edit Form (full screen, own header + fixed Save footer).
  if (editing) {
    return (
      <div className="min-h-screen bg-bg">
        <MechanicForm
          initial={editing === "new" ? null : editing}
          onSubmit={save}
          onCancel={() => setEditing(null)}
          busy={busy}
        />
      </div>
    );
  }

  // Screen A — the Mechanics List.
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-line bg-card/85 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-accent/10 text-accent">
              <ShieldCheck className="size-5" />
            </span>
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-fg">Admin</h1>
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
              onClick={onLogout}
              className="grid size-9 place-items-center rounded-xl border border-line text-text-muted hover:text-red-500"
              title="Log out"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </header>

      {/* List body */}
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        {loading ? (
          <div className="grid place-items-center py-24">
            <Loader2 className="size-6 animate-spin text-accent" />
          </div>
        ) : mechanics.length === 0 ? (
          <Empty onAdd={() => setEditing("new")} />
        ) : (
          <ul className="space-y-2">
            {mechanics.map((m) => (
              <MechanicRow key={m._id} m={m} onEdit={() => setEditing(m)} onDelete={() => remove(m)} />
            ))}
          </ul>
        )}
      </main>

      {/* Fixed "Add mechanic" footer */}
      <footer className="sticky bottom-0 border-t border-line bg-card/85 px-4 py-3 backdrop-blur">
        <div className="mx-auto max-w-2xl">
          <button
            onClick={() => setEditing("new")}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent font-semibold text-white hover:bg-accent-deep"
          >
            <Plus className="size-5" /> Add mechanic
          </button>
        </div>
      </footer>
    </div>
  );
}

/** One list row: wrench badge · name + address/coords · status dot · delete. */
function MechanicRow({ m, onEdit, onDelete }) {
  const subline =
    m.address ||
    (m.coordinate
      ? `${Number(m.coordinate.latitude).toFixed(4)}, ${Number(m.coordinate.longitude).toFixed(4)}`
      : "");
  return (
    <li>
      <div
        onClick={onEdit}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onEdit()}
        className="flex cursor-pointer items-center gap-3 rounded-2xl border border-line bg-card p-3 shadow-soft transition-colors hover:border-ink/30"
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent/10 text-accent">
          <Wrench className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold tracking-tight text-fg">{m.name}</p>
          {subline && <p className="truncate text-sm text-text-muted">{subline}</p>}
        </div>
        <span
          className={`size-2.5 shrink-0 rounded-full ${m.isOpen ? "bg-emerald-500" : "bg-red-500"}`}
          title={m.isOpen ? "Open" : "Closed"}
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="grid size-9 shrink-0 place-items-center rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20"
          title="Delete"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </li>
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
