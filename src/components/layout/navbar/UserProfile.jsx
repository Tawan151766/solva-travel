export function UserProfile() {
  return (
    <div className="relative cursor-pointer">
      <div
        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-12 h-12 border-2 border-[#FFD700]/30 hover:border-[#FFD700] shadow-lg shadow-[#FFD700]/20"
        style={{
          backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBREmh7K_Z_rhVbgwatlByCCmEGCRN2z2Iq5NR7rIX0JQ8WjiTRtFjmt8rHFpQQnShetucg1bCySYl87qDybdvYrdbBhlWKFGfcMWyMM0eWnuxQ7Jo8n_sCqqxqCujh4cCL6s1qnfMQwGIejytutHUmgE1VT6l110WV7d6oavAPcMtdCmX8KTciXdb91KV2W4Y4MK9dNT_1TjYVXeWIgExN7l-2nlf7xU0EqVEqAMeCEYdLLDhwvMiEGycdXqQyhv8bI22ie_yJueLK")`,
        }}
      />
      
      {/* Status Indicator */}
      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-[#FFD700] to-[#FFED4E] rounded-full border-2 border-black shadow-lg shadow-[#FFD700]/50 flex items-center justify-center">
        <div className="w-2 h-2 bg-black rounded-full"></div>
      </div>
    </div>
  );
}
