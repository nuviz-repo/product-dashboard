import { useAuth } from "@/contexts/AuthContext";

const Account = () => {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Account Details</h1>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-500">Email</label>
          <p className="mt-1">{user?.email}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">User ID</label>
          <p className="mt-1">{user?.id}</p>
        </div>
      </div>
    </div>
  );
};

export default Account;