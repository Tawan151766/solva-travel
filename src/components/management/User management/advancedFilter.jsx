export function applyAdvancedFilters(users, searchTerm, filters) {
  let result = (users || []);

  // Apply search term filter
  if (searchTerm) {
    const q = searchTerm.toLowerCase();
    result = result.filter(
      (user) =>
        user.firstName?.toLowerCase().includes(q) ||
        user.lastName?.toLowerCase().includes(q) ||
        user.email?.toLowerCase().includes(q)
    );
  }

  // Apply role filter
  if (filters.roles && filters.roles.length > 0) {
    result = result.filter((user) => filters.roles.includes(user.role));
  }

  // Apply status filter
  if (filters.statuses && filters.statuses.length > 0) {
    result = result.filter((user) => {
      if (filters.statuses.includes("active") && user.isActive) return true;
      if (filters.statuses.includes("inactive") && !user.isActive) return true;
      return false;
    });
  }

  // Apply sorting
  if (filters.sortBy) {
    result = [...result].sort((a, b) => {
      let aVal, bVal;

      switch (filters.sortBy) {
        case "lastLogin":
          aVal = new Date(a.lastLoginAt || 0);
          bVal = new Date(b.lastLoginAt || 0);
          break;
        case "name":
          aVal = `${a.firstName} ${a.lastName}`.toLowerCase();
          bVal = `${b.firstName} ${b.lastName}`.toLowerCase();
          break;
        case "email":
          aVal = a.email?.toLowerCase() || "";
          bVal = b.email?.toLowerCase() || "";
          break;
        case "role":
          aVal = a.role?.toLowerCase() || "";
          bVal = b.role?.toLowerCase() || "";
          break;
        case "created":
          aVal = new Date(a.createdAt || 0);
          bVal = new Date(b.createdAt || 0);
          break;
        default:
          return 0;
      }

      if (filters.sortOrder === "desc") {
        if (aVal < bVal) return 1;
        if (aVal > bVal) return -1;
        return 0;
      } else {
        if (aVal < bVal) return -1;
        if (aVal > bVal) return 1;
        return 0;
      }
    });
  }

  return result;
}
