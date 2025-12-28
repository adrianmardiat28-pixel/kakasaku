import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  Heart,
  Home,
  Gift,
  Users,
  LogOut,
  Menu,
  X,
  TrendingUp,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  RefreshCw,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Donation {
  id: string;
  name: string;
  email: string;
  amount: number;
  created_at: string;
  type: string;
  status: string;
}

interface KakasakuMember {
  id: string;
  name: string;
  email: string;
  monthly_amount: number;
  payment_status: string;
  due_date: string;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "donations" | "kakasaku">("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [members, setMembers] = useState<KakasakuMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/admin/login");
        return;
      }
      fetchData();
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/admin/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch donations
      const { data: donationsData, error: donationsError } = await supabase
        .from("donations")
        .select("*")
        .order("created_at", { ascending: false });

      if (donationsError) throw donationsError;
      setDonations(donationsData || []);

      // Fetch kakasaku members
      const { data: membersData, error: membersError } = await supabase
        .from("kakasaku_members")
        .select("*")
        .order("created_at", { ascending: false });

      if (membersError) throw membersError;
      setMembers(membersData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Gagal memuat data. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const togglePaymentStatus = async (memberId: string, currentStatus: string) => {
    const newStatus = currentStatus === "lunas" ? "belum" : "lunas";
    try {
      const { error } = await supabase
        .from("kakasaku_members")
        .update({ payment_status: newStatus })
        .eq("id", memberId);

      if (error) throw error;

      setMembers(members.map(m => 
        m.id === memberId ? { ...m, payment_status: newStatus } : m
      ));

      toast({
        title: "Status Diperbarui",
        description: `Status pembayaran berhasil diubah menjadi ${newStatus === "lunas" ? "Lunas" : "Belum Bayar"}.`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Gagal memperbarui status.",
        variant: "destructive",
      });
    }
  };

  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);
  const totalKakasaku = members.reduce((sum, m) => sum + m.monthly_amount, 0);
  const paidMembers = members.filter(m => m.payment_status === "lunas").length;
  const unpaidMembers = members.filter(m => m.payment_status === "belum").length;

  const stats = [
    {
      label: "Total Donasi Umum",
      value: formatCurrency(totalDonations),
      icon: DollarSign,
      change: `${donations.length} donasi`,
    },
    {
      label: "Total Kakasaku/Bulan",
      value: formatCurrency(totalKakasaku),
      icon: Users,
      change: `${members.length} anggota`,
    },
    {
      label: "Total Donatur",
      value: donations.length.toString(),
      icon: Heart,
      change: "donasi umum",
    },
    {
      label: "Anggota Kakasaku",
      value: members.length.toString(),
      icon: Calendar,
      change: "anggota aktif",
    },
  ];

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "donations", label: "Donasi Umum", icon: Gift },
    { id: "kakasaku", label: "Kakasaku", icon: Users },
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Kakasaku Jakarta Mengabdi</title>
      </Helmet>

      <div className="min-h-screen bg-background flex">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar transform transition-transform duration-300 lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b border-sidebar-border">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-sidebar-primary flex items-center justify-center">
                  <Heart className="w-5 h-5 text-sidebar-primary-foreground" />
                </div>
                <div>
                  <span className="font-serif text-lg font-semibold text-sidebar-foreground">Kakasaku</span>
                  <span className="block text-xs text-sidebar-foreground/70 -mt-1">Admin Panel</span>
                </div>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as typeof activeTab);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-sidebar-border">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
                Keluar
              </Button>
            </div>
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-foreground/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-64">
          {/* Header */}
          <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border px-4 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-foreground"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <h1 className="font-serif text-xl font-bold text-foreground">
                {activeTab === "overview" && "Dashboard Overview"}
                {activeTab === "donations" && "Manajemen Donasi Umum"}
                {activeTab === "kakasaku" && "Manajemen Kakasaku"}
              </h1>
            </div>
            <Button variant="ghost" size="sm" onClick={fetchData} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </header>

          {/* Content */}
          <div className="p-4 lg:p-8">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <RefreshCw className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    {/* Stats Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {stats.map((stat, index) => (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-card rounded-xl p-6 border border-border/50"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <stat.icon className="w-5 h-5 text-primary" />
                            </div>
                            <span className="text-xs font-medium text-muted-foreground">
                              {stat.change}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                          <p className="font-serif text-2xl font-bold text-foreground">{stat.value}</p>
                        </motion.div>
                      ))}
                    </div>

                    {/* Recent Activity */}
                    <div className="grid lg:grid-cols-2 gap-6">
                      <div className="bg-card rounded-xl p-6 border border-border/50">
                        <h3 className="font-serif text-lg font-semibold text-foreground mb-4">
                          Donasi Terbaru
                        </h3>
                        <div className="space-y-4">
                          {donations.slice(0, 5).map((donation) => (
                            <div key={donation.id} className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                  <span className="text-primary font-semibold">
                                    {donation.name.charAt(0)}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium text-foreground">{donation.name}</p>
                                  <p className="text-xs text-muted-foreground">{formatDate(donation.created_at)}</p>
                                </div>
                              </div>
                              <span className="font-semibold text-foreground">
                                {formatCurrency(donation.amount)}
                              </span>
                            </div>
                          ))}
                          {donations.length === 0 && (
                            <p className="text-muted-foreground text-center py-4">Belum ada donasi</p>
                          )}
                        </div>
                      </div>

                      <div className="bg-card rounded-xl p-6 border border-border/50">
                        <h3 className="font-serif text-lg font-semibold text-foreground mb-4">
                          Status Kakasaku Bulan Ini
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-success/10 rounded-lg">
                            <div className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-success" />
                              <span className="text-foreground">Sudah Bayar</span>
                            </div>
                            <span className="font-bold text-foreground">{paidMembers}</span>
                          </div>
                          <div className="flex items-center justify-between p-4 bg-warning/10 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Clock className="w-5 h-5 text-warning" />
                              <span className="text-foreground">Belum Bayar</span>
                            </div>
                            <span className="font-bold text-foreground">{unpaidMembers}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Donations Tab */}
                {activeTab === "donations" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nama Donatur</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Nominal</TableHead>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {donations.map((donation) => (
                            <TableRow key={donation.id}>
                              <TableCell className="font-medium">{donation.name}</TableCell>
                              <TableCell className="text-muted-foreground">{donation.email}</TableCell>
                              <TableCell>{formatCurrency(donation.amount)}</TableCell>
                              <TableCell className="text-muted-foreground">{formatDate(donation.created_at)}</TableCell>
                              <TableCell>
                                <Badge variant="default" className="bg-success">
                                  {donation.status === "completed" ? "Selesai" : donation.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                          {donations.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                Belum ada data donasi
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </motion.div>
                )}

                {/* Kakasaku Tab */}
                {activeTab === "kakasaku" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nama Anggota</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Nominal/Bulan</TableHead>
                            <TableHead>Jatuh Tempo</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Aksi</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {members.map((member) => (
                            <TableRow key={member.id}>
                              <TableCell className="font-medium">{member.name}</TableCell>
                              <TableCell className="text-muted-foreground">{member.email}</TableCell>
                              <TableCell>{formatCurrency(member.monthly_amount)}</TableCell>
                              <TableCell className="text-muted-foreground">{formatDate(member.due_date)}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={member.payment_status === "lunas" ? "default" : "secondary"}
                                  className={member.payment_status === "lunas" ? "bg-success" : "bg-warning text-warning-foreground"}
                                >
                                  {member.payment_status === "lunas" ? "Lunas" : "Belum Bayar"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => togglePaymentStatus(member.id, member.payment_status)}
                                >
                                  {member.payment_status === "lunas" ? "Tandai Belum" : "Tandai Lunas"}
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                          {members.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                Belum ada anggota Kakasaku
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;
