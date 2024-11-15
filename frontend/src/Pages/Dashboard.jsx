"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Balance from "@/components/Balance";
import Users from "@/components/Users";
import { FcMoneyTransfer } from "react-icons/fc";

export default function Dashboard() {
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [balanceResponse, transactionsResponse] = await Promise.all([
          axios.get("https://truewallet.onrender.com/api/v1/account/balance", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          axios.get("https://truewallet.onrender.com/api/v1/account/recent", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ]);

        // console.log("Balance Response:", balanceResponse.data);
        // console.log("Transactions Response:", transactionsResponse.data);

        setBalance(balanceResponse.data.balance);
        setTransactions(transactionsResponse.data.transactions);
        // console.log(transactions);
      } catch (err) {
        if (err.response?.status === 401) {
          toast.error("Session Expired! Please sign in to continue");
          navigate("/signin");
        } else {
          toast.error("Error fetching Balance or Transactions");
        }
        console.error("Error fetching dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const quickActions = [{ icon: Send, label: "Send Money", path: "/send" }];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols- md:grid-cols-2 gap-6 ">
        <div className="">
          <Card className="md:col-span-2 mb-10">
            <CardHeader>
              <CardTitle>Account Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[72px] w-[200px] rounded-xl" />
              ) : (
                <Balance value={balance || 0} />
              )}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {quickActions.map((action) => (
                  <QuickActionButton
                    key={action.label}
                    icon={<action.icon className="h-5 w-5" />}
                    label={action.label}
                    onClick={() => navigate(action.path)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-[68px] w-full" />
                  ))}
                </div>
              ) : transactions.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No recent transactions
                </p>
              ) : (
                <div className="space-y-4">
                  {transactions.length > 10 && (
                    <Button onClick={() => navigate("/transactions")}>
                      View All Transactions
                    </Button>
                  )}

                  {transactions.map((transaction) => (
                    <TransactionItem
                      key={transaction.id}
                      transaction={transaction}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <h1 className="text-6xl font-mono font-bold flex items-center">
                SEND-<span className="text-blue-600 mr-10"> MONEY</span> <FcMoneyTransfer/>
              </h1>
            </CardHeader>
            <CardContent>
              <Users />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function QuickActionButton({ icon, label, onClick }) {
  return (
    <Button
      variant="outline"
      className="h-auto flex flex-col items-center justify-center p-4 space-y-2"
      onClick={onClick}
    >
      <span className="text-xl text-primary">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </Button>
  );
}

function TransactionItem({ transaction }) {
  const isCredit = transaction.type === "credit";
  return (
    <div className="flex items-center justify-between p-4 hover:bg-muted/50 rounded-lg transition-colors">
      <div className="flex items-center space-x-4">
        <div
          className={`p-2 rounded-full ${
            isCredit ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
          }`}
        >
          <Send className={isCredit ? "rotate-180" : ""} />
        </div>
        <div>
          <p className="font-medium">{transaction.title}</p>
          <p className="text-sm text-muted-foreground">{transaction.date}</p>
        </div>
      </div>
      <span
        className={`font-semibold ${
          isCredit ? "text-green-600" : "text-red-600"
        }`}
      >
        {isCredit ? "+" : "-"}₹{transaction.amount.toFixed(2)}
      </span>
    </div>
  );
}
