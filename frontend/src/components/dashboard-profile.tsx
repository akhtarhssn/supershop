import { IUser } from "@/types/types";

export default function ProfileSettings({ user }: { user: IUser }) {
  return (
    <div className="max-w-4xl space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
        {/* Avatar + Name */}
        <div className="flex items-center gap-5">
          <img
            src={user.avatar || "/default-avatar.png"}
            className="w-20 h-20 rounded-full object-cover border"
          />

          <div className="flex-1">
            <h2 className="text-lg font-medium">{user.name}</h2>
            <p className="text-gray-500 text-sm">{user.email}</p>

            <button className="mt-2 text-sm text-indigo-600 hover:underline">
              Change Photo
            </button>
          </div>

          {/* Status Badge */}
          <span
            className={`px-3 py-1 text-xs rounded-full font-medium ${
              user.status === "Active"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {user.status}
          </span>
        </div>

        {/* Divider */}
        <hr />

        {/* Profile Info */}
        <div className="grid grid-cols-2 gap-4">
          <Input label="Full Name" value={user.name} />
          <Input label="Phone" value={user.phone} />
          <Input label="Email" value={user.email} disabled />
          <Input label="Address" value={user.address || "Not provided"} />
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <h3 className="font-medium text-gray-700">Account Info</h3>

        <div className="flex items-center justify-between">
          <span className="text-gray-500">Role</span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
            {user.role}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-500">Email Verified</span>
          <span
            className={`text-xs px-3 py-1 rounded-full ${
              user.isEmailVerified
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {user.isEmailVerified ? "Verified" : "Not Verified"}
          </span>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <h3 className="font-medium text-gray-700">Security</h3>

        <div className="flex items-center justify-between">
          <span className="text-gray-500">Password</span>
          <button className="text-indigo-600 text-sm hover:underline">
            Change Password
          </button>
        </div>

        <div className="text-sm text-gray-400">
          Last changed:{" "}
          {user.passwordChangedAt
            ? new Date(user.passwordChangedAt).toLocaleDateString()
            : "Never"}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
          Save Changes
        </button>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  disabled,
}: {
  label: string;
  value?: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-500">{label}</label>
      <input
        className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        defaultValue={value}
        disabled={disabled}
      />
    </div>
  );
}
