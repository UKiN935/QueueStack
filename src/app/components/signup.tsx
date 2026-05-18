import {useState} from "react";
import { useNavigate } from "react-router";

export function Signup() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [password, setPass] = useState("");
    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
    
        try {
          const res = await fetch("http://localhost:3001/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name,
              password,
              email
            }),
          });
    
          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || "Something went wrong");
          }
    
          navigate("/login");
    
        } catch (err: any) {
          setError(err.message);
          setLoading(false);
        }
      };
    return (
  <div className="mx-auto max-w-[500px] px-8 py-12">
    <p className="text-foreground-muted text-xs font-mono tracking-widest mb-3">JOIN QUESTACK</p>
    <h1 className="heading text-4xl text-foreground mb-10">Sign Up</h1>

    <form onSubmit={handleSubmit} className="space-y-6">
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="w-full bg-background-secondary border border-border-strong text-foreground placeholder:text-foreground-muted font-light px-5 py-4 focus:outline-none focus:border-lime transition-colors"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full bg-background-secondary border border-border-strong text-foreground placeholder:text-foreground-muted font-light px-5 py-4 focus:outline-none focus:border-lime transition-colors"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPass(e.target.value)}
        required
        className="w-full bg-background-secondary border border-border-strong text-foreground placeholder:text-foreground-muted font-light px-5 py-4 focus:outline-none focus:border-lime transition-colors"
      />

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-lime text-black heading text-sm tracking-wider py-4 hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {loading ? "CREATING ACCOUNT..." : "SIGN UP"}
      </button>

      <p className="text-foreground-muted text-sm text-center">
        Already have an account?{" "}
        <span onClick={() => navigate("/login")} className="text-lime cursor-pointer hover:underline">
          Login
        </span>
      </p>
    </form>
  </div>
);
}