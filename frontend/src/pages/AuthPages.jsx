import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Mail,
  Lock,
  User,
  ArrowRight,
} from "lucide-react";
import { authService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Input, Label } from "../components/ui/index.jsx";
import { Spinner } from "../components/Loader";

const validators = {
  name: (v) =>
    v.trim().length < 2 ? "Name must be at least 2 characters" : "",
  email: (v) =>
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Enter a valid email address" : "",
  password: (v) =>
    v.length < 6 ? "Password must be at least 6 characters" : "",
  confirm: (v, pw) => (v !== pw ? "Passwords do not match" : ""),
};

function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1.5 text-xs text-destructive mt-1.5 animate-fade-in">
      <XCircle className="h-3.5 w-3.5 shrink-0" />
      {msg}
    </p>
  );
}

function PasswordInput({ id, value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="pr-10"
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

function PasswordStrength({ password }) {
  if (!password) return null;
  const score = [
    password.length >= 6,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = [
    "",
    "bg-red-500",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-emerald-500",
  ];
  const textColors = [
    "",
    "text-red-500",
    "text-orange-400",
    "text-yellow-500",
    "text-emerald-600",
  ];
  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= score ? colors[score] : "bg-border"}`}
          />
        ))}
      </div>
      {score > 0 && (
        <p className="text-xs text-muted-foreground">
          Strength:{" "}
          <span className={`font-semibold ${textColors[score]}`}>
            {labels[score]}
          </span>
        </p>
      )}
    </div>
  );
}

/* ── Shared split layout ──────────────────────────────────── */
function AuthLayout({ children, title, subtitle, isLogin }) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 p-12 relative overflow-hidden"
        style={{ background: "var(--navy)" }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -top-20 -left-20 w-72 h-72 rounded-full blur-[100px]"
            style={{ background: "rgba(26,158,143,0.2)" }}
          />
          <div
            className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full blur-[100px]"
            style={{ background: "rgba(245,166,35,0.12)" }}
          />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />
        </div>
        <div className="relative">
          <Link to="/" className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm"
              style={{ background: "var(--teal)" }}
            >
              CF
            </div>
            <span className="font-black text-xl text-white">MilestoFund</span>
          </Link>
        </div>
        <div className="relative space-y-6">
          <h2 className="text-3xl font-black text-white leading-snug">
            {isLogin ? "Welcome\nback." : "Join\nthousands\nof creators."}
          </h2>
          <div className="space-y-4">
            {[
              ["🚀", "Launch campaigns in minutes"],
              ["🤖", "AI-powered pitch writing"],
              ["💳", "Secure Razorpay payments"],
              ["📊", "Real-time analytics dashboard"],
            ].map(([emoji, text]) => (
              <div key={text} className="flex items-center gap-3">
                <span className="text-xl">{emoji}</span>
                <p className="text-white/65 text-sm font-medium">{text}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-white/25 text-xs">
          © 2026 MilestoFund · Made in India
        </p>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-black text-[17px]">
              Milesto<span style={{ color: "var(--teal)" }}>Fund</span>
            </span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-black mb-2 tracking-tight">{title}</h1>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

/* ── Login ──────────────────────────────────────────────── */
export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiErr, setApiErr] = useState("");

  const set = (f, v) => {
    setForm((p) => ({ ...p, [f]: v }));
    if (touched[f]) setErrors((e) => ({ ...e, [f]: validators[f]?.(v) || "" }));
  };
  const blur = (f) => {
    setTouched((t) => ({ ...t, [f]: true }));
    setErrors((e) => ({ ...e, [f]: validators[f]?.(form[f]) || "" }));
  };
  const validate = () => {
    const e = {
      email: validators.email(form.email),
      password: validators.password(form.password),
    };
    setErrors(e);
    setTouched({ email: true, password: true });
    return !Object.values(e).some(Boolean);
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiErr("");
    try {
      const res = await authService.login(form);
      login(res.data.data.user, res.data.data.token);
      navigate(state?.from || "/", { replace: true });
    } catch (err) {
      setApiErr(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your CrowdFund account"
      isLogin
    >
      <form onSubmit={submit} noValidate className="space-y-5">
        <div className={errors.email && touched.email ? "field-error" : ""}>
          <Label className="mb-1.5 block font-semibold text-sm">
            Email address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              onBlur={() => blur("email")}
              className="pl-10"
            />
            {!!form.email && !errors.email && touched.email && (
              <CheckCircle2 className="h-4 w-4 text-emerald-500 absolute right-3 top-1/2 -translate-y-1/2" />
            )}
          </div>
          <FieldError msg={touched.email && errors.email} />
        </div>

        <div
          className={errors.password && touched.password ? "field-error" : ""}
        >
          <Label className="mb-1.5 block font-semibold text-sm">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
            <div className="pl-10">
              <PasswordInput
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
              />
            </div>
          </div>
          <FieldError msg={touched.password && errors.password} />
        </div>

        {apiErr && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm animate-fade-in">
            <XCircle className="h-4 w-4 shrink-0" />
            {apiErr}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl text-[15px] font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
          style={{ background: "var(--teal)" }}
        >
          {loading ? (
            <Spinner className="h-5 w-5 text-white" />
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-semibold hover:underline"
          style={{ color: "var(--teal)" }}
        >
          Sign up free
        </Link>
      </p>
    </AuthLayout>
  );
}

/* ── Register ───────────────────────────────────────────── */
export function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiErr, setApiErr] = useState("");

  const set = (f, v) => {
    setForm((p) => ({ ...p, [f]: v }));
    if (touched[f]) {
      const err =
        f === "confirm"
          ? validators.confirm(v, form.password)
          : validators[f]?.(v) || "";
      setErrors((e) => ({ ...e, [f]: err }));
    }
  };
  const blur = (f) => {
    setTouched((t) => ({ ...t, [f]: true }));
    const err =
      f === "confirm"
        ? validators.confirm(form.confirm, form.password)
        : validators[f]?.(form[f]) || "";
    setErrors((e) => ({ ...e, [f]: err }));
  };
  const validate = () => {
    const e = {
      name: validators.name(form.name),
      email: validators.email(form.email),
      password: validators.password(form.password),
      confirm: validators.confirm(form.confirm, form.password),
    };
    setErrors(e);
    setTouched({ name: true, email: true, password: true, confirm: true });
    return !Object.values(e).some(Boolean);
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiErr("");
    try {
      const res = await authService.register({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      login(res.data.data.user, res.data.data.token);
      navigate("/discover");
    } catch (err) {
      setApiErr(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const ok = (f) => !!form[f] && !errors[f] && touched[f];

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join thousands of creators and backers"
    >
      <form onSubmit={submit} noValidate className="space-y-4">
        {[
          {
            f: "name",
            label: "Full name",
            icon: <User className="h-4 w-4" />,
            type: "text",
            ph: "John Doe",
          },
          {
            f: "email",
            label: "Email address",
            icon: <Mail className="h-4 w-4" />,
            type: "email",
            ph: "you@example.com",
          },
        ].map(({ f, label, icon, type, ph }) => (
          <div
            key={f}
            className={
              errors[f] && touched[f]
                ? "field-error"
                : ok(f)
                  ? "field-success"
                  : ""
            }
          >
            <Label className="mb-1.5 block font-semibold text-sm">
              {label}
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {icon}
              </span>
              <Input
                type={type}
                placeholder={ph}
                value={form[f]}
                onChange={(e) => set(f, e.target.value)}
                onBlur={() => blur(f)}
                className="pl-10"
              />
              {ok(f) && (
                <CheckCircle2 className="h-4 w-4 text-emerald-500 absolute right-3 top-1/2 -translate-y-1/2" />
              )}
            </div>
            <FieldError msg={touched[f] && errors[f]} />
          </div>
        ))}

        <div
          className={errors.password && touched.password ? "field-error" : ""}
        >
          <Label className="mb-1.5 block font-semibold text-sm">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
            <div className="pl-10">
              <PasswordInput
                placeholder="At least 6 characters"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
              />
            </div>
          </div>
          <PasswordStrength password={form.password} />
          <FieldError msg={touched.password && errors.password} />
        </div>

        <div
          className={
            errors.confirm && touched.confirm
              ? "field-error"
              : ok("confirm")
                ? "field-success"
                : ""
          }
        >
          <Label className="mb-1.5 block font-semibold text-sm">
            Confirm password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
            <div className="pl-10">
              <PasswordInput
                placeholder="••••••••"
                value={form.confirm}
                onChange={(e) => set("confirm", e.target.value)}
              />
            </div>
            {ok("confirm") && (
              <CheckCircle2 className="h-4 w-4 text-emerald-500 absolute right-3 top-1/2 -translate-y-1/2" />
            )}
          </div>
          <FieldError msg={touched.confirm && errors.confirm} />
        </div>

        {apiErr && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm animate-fade-in">
            <XCircle className="h-4 w-4 shrink-0" />
            {apiErr}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl text-[15px] font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
          style={{ background: "var(--teal)" }}
        >
          {loading ? (
            <Spinner className="h-5 w-5 text-white" />
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold hover:underline"
          style={{ color: "var(--teal)" }}
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
