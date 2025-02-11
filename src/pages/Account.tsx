import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Building2, CalendarRange, CreditCard } from "lucide-react";

const Account = () => {
  const { user } = useAuth();

  // Hardcoded data for demonstration
  const organizationInfo = {
    name: "YCombinator",
    role: "User",
    department: "Technology",
  };

  const contractInfo = {
    planName: "Demo",
    value: "$5,000/month",
    startDate: "February 1st, 2025",
    endDate: "March 1st, 2025",
    status: "Active",
    billingCycle: "Monthly",
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Account Details</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <CreditCard className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Personal Information</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="mt-1">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">User ID</label>
              <p className="mt-1">{user?.id}</p>
            </div>
          </CardContent>
        </Card>

        {/* Organization Information */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Building2 className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Organization</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Organization Name</label>
              <p className="mt-1">{organizationInfo.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Your Role</label>
              <p className="mt-1">{organizationInfo.role}</p>
            </div>
          </CardContent>
        </Card>

        {/* Contract Information */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center gap-2">
            <CalendarRange className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Contract Details</h2>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Plan</label>
                <p className="mt-1">{contractInfo.planName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Start Date</label>
                <p className="mt-1">{contractInfo.startDate}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">End Date</label>
                <p className="mt-1">{contractInfo.endDate}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <p className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {contractInfo.status}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Account;