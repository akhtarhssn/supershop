"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Wallet,
  CreditCard,
  Building,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

interface BankDetails {
  _id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  isDefault: boolean;
}

interface WalletData {
  _id: string;
  totalEarnings: number;
  pendingBalance: number;
  availableBalance: number;
  totalWithdrawn: number;
  bankDetails: BankDetails[];
}

interface Withdrawal {
  _id: string;
  amount: number;
  status: "pending" | "approved" | "rejected" | "completed";
  createdAt: string;
  processedAt?: string;
  rejectionReason?: string;
}

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "text-amber-600 bg-amber-100",
    icon: Clock,
  },
  approved: {
    label: "Approved",
    color: "text-blue-600 bg-blue-100",
    icon: CheckCircle,
  },
  rejected: {
    label: "Rejected",
    color: "text-red-600 bg-red-100",
    icon: XCircle,
  },
  completed: {
    label: "Completed",
    color: "text-green-600 bg-green-100",
    icon: CheckCircle,
  },
};

export default function EarningsPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddBank, setShowAddBank] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [bankForm, setBankForm] = useState({
    bankName: "",
    accountName: "",
    accountNumber: "",
    branchCode: "",
    isDefault: false,
  });
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [selectedBankId, setSelectedBankId] = useState("");

  const loadData = async () => {
    try {
      const [walletRes, historyRes] = await Promise.all([
        api.withdrawals.getWallet(),
        api.withdrawals.getHistory(),
      ]);
      setWallet(walletRes.data);
      setWithdrawals(historyRes.data || []);
    } catch (error) {
      console.error("Failed to load earnings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await loadData();
    };
    init();
  }, []);

  const handleAddBank = async () => {
    if (
      !bankForm.bankName ||
      !bankForm.accountName ||
      !bankForm.accountNumber
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      await api.withdrawals.addBank(bankForm);
      toast.success("Bank account added!");
      setShowAddBank(false);
      setBankForm({
        bankName: "",
        accountName: "",
        accountNumber: "",
        branchCode: "",
        isDefault: false,
      });
      loadData();
    } catch (error) {
      toast.error("Failed to add bank account");
    }
  };

  const handleRequestWithdrawal = async () => {
    if (!withdrawAmount || !selectedBankId) {
      toast.error("Please enter amount and select bank");
      return;
    }
    const amount = parseFloat(withdrawAmount);
    if (amount > (wallet?.availableBalance || 0)) {
      toast.error("Insufficient balance");
      return;
    }
    try {
      await api.withdrawals.requestWithdrawal(amount, selectedBankId);
      toast.success("Withdrawal requested!");
      setShowWithdraw(false);
      setWithdrawAmount("");
      loadData();
    } catch (error) {
      toast.error("Failed to request withdrawal");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#6366F1] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-100">
                <Wallet className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Earnings</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(wallet?.totalEarnings || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-100">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Available Balance</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(wallet?.availableBalance || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-amber-100">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(wallet?.pendingBalance || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-purple-100">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Withdrawn</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(wallet?.totalWithdrawn || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Bank Accounts</CardTitle>
                <CardDescription>
                  Manage your withdrawal accounts
                </CardDescription>
              </div>
              <Dialog open={showAddBank} onOpenChange={setShowAddBank}>
                <DialogTrigger>
                  <span className="px-4 py-2 rounded-xl flex items-center gap-2 text-white bg-indigo-500 hover:bg-indigo-600 shadow-sm transition-all">
                    <Building className="w-4 h-4" />
                    Add Bank
                  </span>
                </DialogTrigger>

                <DialogContent className="max-w-md rounded-2xl p-6 bg-white/90 backdrop-blur-xl shadow-xl border border-gray-200">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold tracking-tight">
                      Add Bank Account
                    </DialogTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      Enter your banking details securely
                    </p>
                  </DialogHeader>

                  <div className="mt-6 space-y-5">
                    {/* Input Group */}
                    <div className="space-y-4">
                      <div>
                        <Label className="text-xs text-gray-500">
                          Bank Name
                        </Label>
                        <Input
                          placeholder="Chase Bank"
                          className="mt-1 rounded-xl bg-gray-50 border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                          value={bankForm.bankName}
                          onChange={(e) =>
                            setBankForm({
                              ...bankForm,
                              bankName: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div>
                        <Label className="text-xs text-gray-500">
                          Account Name
                        </Label>
                        <Input
                          placeholder="John Doe"
                          className="mt-1 rounded-xl bg-gray-50 border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                          value={bankForm.accountName}
                          onChange={(e) =>
                            setBankForm({
                              ...bankForm,
                              accountName: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div>
                        <Label className="text-xs text-gray-500">
                          Account Number
                        </Label>
                        <Input
                          placeholder="•••• •••• ••••"
                          className="mt-1 rounded-xl bg-gray-50 border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition tracking-widest"
                          value={bankForm.accountNumber}
                          onChange={(e) =>
                            setBankForm({
                              ...bankForm,
                              accountNumber: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div>
                        <Label className="text-xs text-gray-500">
                          Branch Code{" "}
                          <span className="text-gray-400">(Optional)</span>
                        </Label>
                        <Input
                          placeholder="123456"
                          className="mt-1 rounded-xl bg-gray-50 border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                          value={bankForm.branchCode}
                          onChange={(e) =>
                            setBankForm({
                              ...bankForm,
                              branchCode: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gray-200" />

                    {/* Checkbox */}
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="isDefault"
                        className="text-sm text-gray-600"
                      >
                        Set as default
                      </Label>
                      <Input
                        type="checkbox"
                        id="isDefault"
                        checked={bankForm.isDefault}
                        onChange={(e) =>
                          setBankForm({
                            ...bankForm,
                            isDefault: e.target.checked,
                          })
                        }
                        className="size-4 rounded-md border-gray-300 text-indigo-500 focus:ring-indigo-500"
                      />
                    </div>

                    {/* Button */}
                    <Button
                      onClick={handleAddBank}
                      className="w-full rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2.5 shadow-sm transition-all active:scale-[0.98]"
                    >
                      Save Bank Account
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {!wallet?.bankDetails || wallet.bankDetails.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No bank accounts added yet
              </p>
            ) : (
              <div className="space-y-3">
                {wallet.bankDetails.map((bank) => (
                  <div
                    key={bank._id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-gray-100">
                        <CreditCard className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{bank.bankName}</p>
                        <p className="text-xs text-gray-500">
                          {bank.accountName} •••• {bank.accountNumber.slice(-4)}
                        </p>
                      </div>
                    </div>
                    {bank.isDefault && (
                      <span className="text-xs bg-[#6366F1]/10 text-[#6366F1] px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Request Withdrawal</CardTitle>
                <CardDescription>
                  Withdraw your available balance
                </CardDescription>
              </div>
              <Dialog open={showWithdraw} onOpenChange={setShowWithdraw}>
                <DialogTrigger>
                  <Button
                    size="sm"
                    className="bg-[#6366F1] hover:bg-[#4F46E5]"
                    disabled={
                      !wallet?.availableBalance ||
                      (wallet?.bankDetails?.length || 0) === 0
                    }
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Withdraw
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Request Withdrawal</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500">
                      Available:{" "}
                      <span className="font-bold text-gray-900">
                        {formatCurrency(wallet?.availableBalance || 0)}
                      </span>
                    </p>
                    <div>
                      <Label>Amount</Label>
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Select Bank</Label>
                      <select
                        className="w-full h-10 px-3 rounded-md border border-[#E5E7EB] text-sm"
                        value={selectedBankId}
                        onChange={(e) => setSelectedBankId(e.target.value)}
                        title="Select Bank"
                      >
                        <option value="">Select a bank</option>
                        {wallet?.bankDetails.map((bank) => (
                          <option key={bank._id} value={bank._id}>
                            {bank.bankName} - {bank.accountNumber.slice(-4)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Button
                      onClick={handleRequestWithdrawal}
                      className="w-full bg-[#6366F1] hover:bg-[#4F46E5]"
                    >
                      Request Withdrawal
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {withdrawals.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No withdrawal history
              </p>
            ) : (
              <div className="space-y-3">
                {withdrawals.slice(0, 10).map((withdrawal) => {
                  const status = STATUS_CONFIG[withdrawal.status];
                  const StatusIcon = status.icon;
                  return (
                    <div
                      key={withdrawal._id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-gray-100">
                          <DollarSign className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {formatCurrency(withdrawal.amount)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(withdrawal.createdAt)}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${status.color}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
