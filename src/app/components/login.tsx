import {useState} from "react";
import { useNavigate } from "react-router";

export function Login() {
    const navigate = useNavigate();

    const[email, setEmail] = useState("");
    const[password, setPass] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

        const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
    
        try {
          const res = await fetch("http://localhost:3001/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              password,
              email
            }),
          });
    
          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || "Something went wrong");
          }
          const data = await res.json();
          localStorage.setItem("token", data.token)
          localStorage.setItem("name", data.name)
          navigate("/");
            
    
        } catch (err: any) {
          setError(err.message);
          setLoading(false);
        }
      };
      return (
    <div className="mx-auto max-w-[500px] px-8 py-12">
      <p className="text-foreground-muted text-xs font-mono tracking-widest mb-3">WELCOME BACK</p>
      <h1 className="heading text-4xl text-foreground mb-10">Login</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
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
          {loading ? "LOGGING IN..." : "LOGIN"}
        </button>

        <p className="text-foreground-muted text-sm text-center">
          Don't have an account?{" "}
          <span onClick={() => navigate("/signup")} className="text-lime cursor-pointer hover:underline">
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
}

