export function filterUsers(users, searchTerm) {
  const q = (searchTerm || "").toLowerCase();
  return (users || []).filter(
    (user) =>
      user.firstName?.toLowerCase().includes(q) ||
      user.lastName?.toLowerCase().includes(q) ||
      user.email?.toLowerCase().includes(q)
  );
}

