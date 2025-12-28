import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  Home,
  Gift,
  Users,
  LogOut,
  Menu,
  X,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  RefreshCw,
  Plus,
  Pencil,
  Trash2,
  LayoutGrid
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// --- INTERFACES ---
interface Donation {
  id: string;
  name: string;
  email: string;
  amount: number;
  created_at: string;
  type: string;
  status: string;
  payment_method?: string;
}

interface KakasakuMember {
  id: string;
  name: string;
  email: string;
  monthly_amount: number;
  payment_status: string;
  due_date: string;
}

interface Program {
  id: string;
  title: string;
  description: string;
  target: number;
  raised: number;
  category: string;
  created_at?: string;
}

const AdminDashboard = () => {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState<"overview" | "donations" | "kakasaku" | "programs">("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Data States
  const [donations, setDonations] = useState<Donation[]>([]);
  const [members, setMembers] = useState<KakasakuMember[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);

  // Program Form States
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    target: "",
    category: "pendidikan",
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  // --- EFFECT: CHECK AUTH & FETCH ---
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/admin/login");
        return;
      }
      fetchData();
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) navigate("/admin/login");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // --- FETCH DATA FUNCTION ---
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Donations
      const { data: donationsData } = await supabase
        .from("donations")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (donationsData) setDonations(donationsData);

      // 2. Fetch Members
      const { data: membersData } = await supabase
        .from("kakasaku_members")
        .select("*")
        .order("created_at", { ascending: false });

      if (membersData) setMembers(membersData);

      // 3. Fetch Programs (Pakai 'as any' untuk bypass TS sementara)
      const { data: programsData } = await (supabase as any)
        .from("programs")
        .select("*")
        .order("created_at", { ascending: false });

      if (programsData) setPrograms(programsData as Program[]);

    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Gagal memuat data. Silakan refresh.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // --- HELPER FUNCTIONS ---
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
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

  // --- LOGIC: KAKASAKU MEMBERS ---
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
        description: `Pembayaran diubah menjadi ${newStatus === "lunas" ? "Lunas" : "Belum Bayar"}.`,
      });
    } catch (error) {
      toast({ title: "Error", description: "Gagal update status.", variant: "destructive" });
    }
  };

  // --- LOGIC: PROGRAMS CRUD ---
  const handleAddProgram = () => {
    setEditingId(null);
    setFormData({ title: "", description: "", target: "", category: "pendidikan" });
    setIsDialogOpen(true);
  };

  const handleEditProgram = (program: Program) => {
    setEditingId(program.id);
    setFormData({
      title: program.title,
      description: program.description || "",
      target: program.target.toString(),
      category: program.category || "pendidikan",
    });
    setIsDialogOpen(true);
  };

  const handleDeleteProgram = async (id: string) => {
    if (!confirm("Yakin ingin menghapus program ini? Data tidak bisa dikembalikan.")) return;
    
    try {
      const { error } = await (supabase as any).from("programs").delete().eq("id", id);
      if (error) throw error;
      
      setPrograms(programs.filter(p => p.id !== id));
      toast({ title: "Program Dihapus" });
    } catch (error) {
      toast({ title: "Gagal Menghapus", variant: "destructive" });
    }
  };

  const handleSaveProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        target: parseInt(formData.target),
        category: formData.category,
      };

      if (editingId) {
        // Update
        const { error } = await (supabase as any)
          .from("programs")
          .update(payload)
          .eq("id", editingId);
        if (error) throw error;
        toast({ title: "Program Berhasil Diupdate" });
      } else {
        // Insert
        const { error } = await (supabase as any)
          .from("programs")
          .insert(payload);
        if (error) throw error;
        toast({ title: "Program Baru Ditambahkan" });
      }

      setIsDialogOpen(false);
      fetchData(); // Refresh list
    } catch (error: any) {
      toast({ title: "Gagal Menyimpan", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  // --- STATS CALCULATION ---
  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);
  const totalKakasaku = members.reduce((sum, m) => sum + m.monthly_amount, 0);
  const paidMembers = members.filter(m => m.payment_status === "lunas").length;
  const unpaidMembers = members.filter(m => m.payment_status === "belum").length;

  const stats = [
    { label: "Total Donasi Umum", value: formatCurrency(totalDonations), icon: DollarSign, change: `${donations.length} transaksi` },
    { label: "Kakasaku / Bulan", value: formatCurrency(totalKakasaku), icon: Users, change: `${members.length} anggota` },
    { label: "Program Aktif", value: programs.length.toString(), icon: LayoutGrid, change: "kampanye" },
    { label: "Anggota Lunas", value: paidMembers.toString(), icon: CheckCircle, change: "bulan ini" },
  ];

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "donations", label: "Donasi Umum", icon: Gift },
    { id: "kakasaku", label: "Kakasaku", icon: Users },
    { id: "programs", label: "Program Donasi", icon: LayoutGrid },
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Kakasaku Jakarta Mengabdi</title>
      </Helmet>

      <div className="min-h-screen bg-background flex">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex flex-col h-full border-r border-border">
            {/* Logo */}
            <div className="p-6 border-b border-border">
                <Link to="/" className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center overflow-hidden">
                    <img src="/logo.png" alt="Kakasaku" className="w-8 h-8 object-cover" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="font-serif text-lg font-bold text-foreground">Kakasaku</span>
                    <span className="text-xs text-muted-foreground -mt-1">Admin Panel</span>
                  </div>
                </Link>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-4 space-y-1">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id as any); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-border">
              <Button variant="ghost" className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
                <LogOut className="w-5 h-5" /> Keluar
              </Button>
            </div>
          </div>
        </aside>

        {/* Overlay for Mobile */}
        {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 bg-secondary/5">
          {/* Header */}
          <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border px-4 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2">
                {sidebarOpen ? <X /> : <Menu />}
              </button>
              <h1 className="font-serif text-xl font-bold">
                {activeTab === "overview" && "Dashboard Overview"}
                {activeTab === "donations" && "Riwayat Donasi Umum"}
                {activeTab === "kakasaku" && "Anggota Kakasaku"}
                {activeTab === "programs" && "Manajemen Program"}
              </h1>
            </div>
            <Button variant="outline" size="sm" onClick={fetchData} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} /> Refresh
            </Button>
          </header>

          <div className="p-4 lg:p-8">
            {isLoading ? (
              <div className="flex justify-center py-20"><RefreshCw className="animate-spin text-primary" /></div>
            ) : (
              <>
                {/* --- TAB: OVERVIEW --- */}
                {activeTab === "overview" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {stats.map((stat) => (
                        <div key={stat.label} className="bg-card p-6 rounded-xl border shadow-sm">
                          <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-primary/10 rounded-lg"><stat.icon className="w-5 h-5 text-primary" /></div>
                            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">{stat.change}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{stat.label}</p>
                          <p className="text-2xl font-bold font-serif">{stat.value}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* --- TAB: DONATIONS --- */}
                {activeTab === "donations" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nama</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Nominal</TableHead>
                            <TableHead>Metode</TableHead>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {donations.map((d) => (
                            <TableRow key={d.id}>
                              <TableCell className="font-medium">{d.name}</TableCell>
                              <TableCell>{d.email}</TableCell>
                              <TableCell>{formatCurrency(d.amount)}</TableCell>
                              <TableCell className="capitalize">{d.payment_method || "-"}</TableCell>
                              <TableCell>{formatDate(d.created_at)}</TableCell>
                              <TableCell><Badge className="bg-success">Selesai</Badge></TableCell>
                            </TableRow>
                          ))}
                          {donations.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Belum ada data</TableCell></TableRow>}
                        </TableBody>
                      </Table>
                    </div>
                  </motion.div>
                )}

                {/* --- TAB: KAKASAKU --- */}
                {activeTab === "kakasaku" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nama Anggota</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Donasi Bulanan</TableHead>
                            <TableHead>Status Pembayaran</TableHead>
                            <TableHead>Aksi</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {members.map((m) => (
                            <TableRow key={m.id}>
                              <TableCell className="font-medium">{m.name}</TableCell>
                              <TableCell>{m.email}</TableCell>
                              <TableCell>{formatCurrency(m.monthly_amount)}</TableCell>
                              <TableCell>
                                <Badge variant={m.payment_status === "lunas" ? "default" : "secondary"} className={m.payment_status === "lunas" ? "bg-success" : "bg-warning text-warning-foreground"}>
                                  {m.payment_status === "lunas" ? "Lunas" : "Belum Bayar"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm" onClick={() => togglePaymentStatus(m.id, m.payment_status)}>
                                  {m.payment_status === "lunas" ? "Tandai Belum" : "Tandai Lunas"}
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                          {members.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Belum ada anggota</TableCell></TableRow>}
                        </TableBody>
                      </Table>
                    </div>
                  </motion.div>
                )}

                {/* --- TAB: PROGRAMS (FITUR BARU) --- */}
                {activeTab === "programs" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-semibold">Daftar Program</h2>
                      <Button onClick={handleAddProgram}><Plus className="w-4 h-4 mr-2" /> Tambah Program</Button>
                    </div>

                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {programs.map((program) => (
                        <div key={program.id} className="bg-card rounded-xl border shadow-sm p-6 flex flex-col">
                          <div className="flex justify-between items-start mb-4">
                            <Badge variant="outline" className="uppercase">{program.category}</Badge>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600" onClick={() => handleEditProgram(program)}><Pencil className="w-4 h-4" /></Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => handleDeleteProgram(program.id)}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                          </div>
                          <h3 className="font-bold text-lg mb-2 line-clamp-1">{program.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">{program.description}</p>
                          <div className="space-y-2 text-sm border-t pt-4">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Target:</span>
                              <span className="font-semibold">{formatCurrency(program.target)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Terkumpul:</span>
                              <span className="font-semibold text-primary">{formatCurrency(program.raised)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* --- DIALOG FORM PROGRAM --- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Program" : "Tambah Program Baru"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveProgram} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Judul Program</Label>
              <Input required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="Contoh: Bantuan Pendidikan..." />
            </div>
            <div className="space-y-2">
              <Label>Kategori</Label>
              <Select value={formData.category} onValueChange={(val) => setFormData({...formData, category: val})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendidikan">Pendidikan</SelectItem>
                  <SelectItem value="kesehatan">Kesehatan</SelectItem>
                  <SelectItem value="umkm">UMKM</SelectItem>
                  <SelectItem value="lingkungan">Lingkungan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Target Dana (Rp)</Label>
              <Input type="number" required value={formData.target} onChange={(e) => setFormData({...formData, target: e.target.value})} placeholder="50000000" />
            </div>
            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea required className="min-h-[100px]" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Penjelasan program..." />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
              <Button type="submit" disabled={isSaving}>{isSaving ? "Menyimpan..." : "Simpan"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminDashboard;