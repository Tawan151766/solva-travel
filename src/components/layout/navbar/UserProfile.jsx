export function UserProfile() {
  return (
    <div className="relative group">
      <div
        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10 cursor-pointer ring-2 ring-slate-600/50 hover:ring-emerald-400/50 transition-all duration-300 transform hover:scale-105"
        style={{
          backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBREmh7K_Z_rhVbgwatlByCCmEGCRN2z2Iq5NR7rIX0JQ8WjiTRtFjmt8rHFpQQnShetucg1bCySYl87qDybdvYrdbBhlWKFGfcMWyMM0eWnuxQ7Jo8n_sCqqxqCujh4cCL6s1qnfMQwGIejytutHUmgE1VT6l110WV7d6oavAPcMtdCmX8KTciXdb91KV2W4Y4MK9dNT_1TjYVXeWIgExN7l-2nlf7xU0EqVEqAMeCEYdLLDhwvMiEGycdXqQyhv8bI22ie_yJueLK")`,
        }}
      />
      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-slate-900"></div>
    </div>
  );
}
