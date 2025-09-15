"use client";

export default function UserForm({
  isEdit,
  formData,
  setFormData,
  setIsEditModalOpen,
  setIsCreateModalOpen,
  onSubmit,
}) {
  return (
    <form className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[#FFD700] text-sm font-medium mb-2">
            First name
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            placeholder="Enter first name"
            className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
          />
        </div>
        <div>
          <label className="block text-[#FFD700] text-sm font-medium mb-2">
            Last name
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            placeholder="Enter last name"
            className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-[#FFD700] text-sm font-medium mb-2">
          Email
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Enter email"
          className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
        />
      </div>

      <div>
        <label className="block text-[#FFD700] text-sm font-medium mb-2">
          Phone number
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="Enter phone"
          className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
        />
      </div>

      {!isEdit && (
        <div>
          <label className="block text-[#FFD700] text-sm font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder="Enter password"
            className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
          />
        </div>
      )}

      <div>
        <label className="block text-[#FFD700] text-sm font-medium mb-2">
          Role
        </label>
        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
        >
          <option value="USER" className="bg-black text-white">
            USER
          </option>
          <option value="STAFF" className="bg-black text-white">
            STAFF
          </option>
          <option value="OPERATOR" className="bg-black text-white">
            OPERATOR
          </option>
          <option value="ADMIN" className="bg-black text-white">
            ADMIN
          </option>
        </select>
      </div>

      <div className="flex items-start space-x-2">
        <input
          type="checkbox"
          checked={formData.isActive}
          onChange={(e) =>
            setFormData({ ...formData, isActive: e.target.checked })
          }
          className="mt-1 w-4 h-4 text-[#FFD700] bg-black/50 border-[#FFD700]/30 rounded focus:ring-[#FFD700] focus:ring-2"
        />
        <label className="text-white/80 text-sm">Active</label>
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={() => {
            setIsEditModalOpen?.(false);
            setIsCreateModalOpen?.(false);
          }}
          className="flex-1 py-3 bg-black/50 border border-[#FFD700]/30 text-[#FFD700] font-medium rounded-xl hover:bg-[#FFD700]/10 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 transition-all"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onSubmit?.(isEdit)}
          className="flex-1 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black font-semibold rounded-xl hover:from-[#FFED4E] hover:to-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 transition-all"
        >
          {isEdit ? "Update User" : "Create User"}
        </button>
      </div>
    </form>
  );
}

