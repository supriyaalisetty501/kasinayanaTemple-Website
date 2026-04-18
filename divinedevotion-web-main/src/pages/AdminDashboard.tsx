import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/i18n/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LogOut, Trash2, Upload, Plus, Save } from "lucide-react";
import type { User } from "@supabase/supabase-js";

interface EventRow {
  id: string;
  title_te: string;
  title_en: string;
  description_te: string | null;
  description_en: string | null;
  event_date: string | null;
  image_url: string | null;
  is_published: boolean;
}

interface GalleryRow {
  id: string;
  image_url: string;
  caption_te: string | null;
  caption_en: string | null;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  // Settings
  const [timings, setTimings] = useState({ morning_open: "", morning_close: "", evening_open: "", evening_close: "", pooja_morning: "", pooja_evening: "" });
  const [donation, setDonation] = useState({ phone1: "", phone2: "" });
  const [mapSettings, setMapSettings] = useState({ embed_url: "", address_te: "", address_en: "" });
  const [about, setAbout] = useState({ story_te: "", story_en: "" });

  // Events / gallery
  const [events, setEvents] = useState<EventRow[]>([]);
  const [gallery, setGallery] = useState<GalleryRow[]>([]);
  const [newEvent, setNewEvent] = useState({ title_te: "", title_en: "", description_te: "", description_en: "", event_date: "" });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate("/admin", { replace: true });
      else setUser(session.user);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) { navigate("/admin", { replace: true }); return; }
      setUser(data.session.user);
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    supabase.rpc("has_role", { _user_id: user.id, _role: "admin" }).then(({ data }) => {
      setIsAdmin(Boolean(data));
    });
    loadAll();
  }, [user]);

  const loadAll = async () => {
    const { data: settingsData } = await supabase.from("settings").select("*");
    settingsData?.forEach((s) => {
      const v = s.value as Record<string, string>;
      if (s.key === "timings") setTimings(v as typeof timings);
      if (s.key === "donation") setDonation(v as typeof donation);
      if (s.key === "map") setMapSettings(v as typeof mapSettings);
      if (s.key === "about") setAbout({ story_te: v.story_te ?? "", story_en: v.story_en ?? "" });
    });
    const { data: ev } = await supabase.from("events").select("*").order("created_at", { ascending: false });
    setEvents((ev as EventRow[]) ?? []);
    const { data: g } = await supabase.from("gallery").select("*").order("created_at", { ascending: false });
    setGallery((g as GalleryRow[]) ?? []);
  };

  const saveSetting = async (key: string, value: object) => {
    const { error } = await supabase.from("settings").upsert([{ key, value: value as never }]);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else toast({ title: "Saved ✓" });
  };

  const addEvent = async () => {
    if (!newEvent.title_te || !newEvent.title_en) {
      toast({ title: "Title required (Telugu + English)", variant: "destructive" });
      return;
    }
    const payload = { ...newEvent, event_date: newEvent.event_date || null };
    const { error } = await supabase.from("events").insert(payload);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Event added ✓" });
      setNewEvent({ title_te: "", title_en: "", description_te: "", description_en: "", event_date: "" });
      loadAll();
    }
  };

  const deleteEvent = async (id: string) => {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Deleted" }); loadAll(); }
  };

  const uploadGallery = async (file: File, captionTe: string, captionEn: string) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage.from("gallery").upload(path, file);
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("gallery").getPublicUrl(path);
      const { error: insErr } = await supabase.from("gallery").insert({
        image_url: pub.publicUrl, caption_te: captionTe || null, caption_en: captionEn || null,
      });
      if (insErr) throw insErr;
      toast({ title: "Photo uploaded ✓" });
      loadAll();
    } catch (err) {
      toast({ title: "Upload failed", description: err instanceof Error ? err.message : "", variant: "destructive" });
    } finally { setUploading(false); }
  };

  const deleteGallery = async (id: string) => {
    const { error } = await supabase.from("gallery").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Deleted" }); loadAll(); }
  };

  const signOut = async () => { await supabase.auth.signOut(); };

  if (!user) return null;

  if (isAdmin === false) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-divine px-4">
        <div className="max-w-md rounded-3xl border-2 border-destructive/30 bg-card p-8 text-center shadow-deep">
          <h1 className="font-display text-2xl font-bold">Access Denied</h1>
          <p className="mt-3 text-muted-foreground">
            Your account is signed in but does not have the <code className="rounded bg-muted px-1">admin</code> role yet.
            Ask the project owner to grant access by inserting your user ID into <code className="rounded bg-muted px-1">user_roles</code>.
          </p>
          <p className="mt-3 break-all text-xs text-muted-foreground">User ID: {user.id}</p>
          <Button onClick={signOut} variant="outline" className="mt-4"><LogOut className="mr-2 h-4 w-4" /> {t("signOut")}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-divine">
      <header className="sticky top-0 z-40 border-b-2 border-primary/20 bg-card/95 backdrop-blur">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <h1 className="font-display text-2xl font-bold text-gradient-saffron">{t("adminPanel")}</h1>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Button onClick={signOut} variant="outline" size="sm">
              <LogOut className="mr-2 h-4 w-4" /> {t("signOut")}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="content">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="content">About</TabsTrigger>
            <TabsTrigger value="timings">Timings</TabsTrigger>
            <TabsTrigger value="contact">Contact & Map</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="mt-6 space-y-4 rounded-2xl border-2 border-primary/20 bg-card p-6">
            <h2 className="font-display text-xl font-bold">About Sri Kasinayana Swamy</h2>
            <div>
              <Label>Story (Telugu)</Label>
              <Textarea rows={6} value={about.story_te} onChange={(e) => setAbout({ ...about, story_te: e.target.value })} />
            </div>
            <div>
              <Label>Story (English)</Label>
              <Textarea rows={6} value={about.story_en} onChange={(e) => setAbout({ ...about, story_en: e.target.value })} />
            </div>
            <Button onClick={() => saveSetting("about", about)} className="bg-gradient-saffron"><Save className="mr-2 h-4 w-4" />Save</Button>
          </TabsContent>

          <TabsContent value="timings" className="mt-6 space-y-4 rounded-2xl border-2 border-primary/20 bg-card p-6">
            <h2 className="font-display text-xl font-bold">Temple Timings</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {(Object.keys(timings) as Array<keyof typeof timings>).map((k) => (
                <div key={k}>
                  <Label className="capitalize">{k.replace(/_/g, " ")}</Label>
                  <Input value={timings[k]} onChange={(e) => setTimings({ ...timings, [k]: e.target.value })} placeholder="e.g. 6:00 AM" />
                </div>
              ))}
            </div>
            <Button onClick={() => saveSetting("timings", timings)} className="bg-gradient-saffron"><Save className="mr-2 h-4 w-4" />Save</Button>
          </TabsContent>

          <TabsContent value="contact" className="mt-6 space-y-6 rounded-2xl border-2 border-primary/20 bg-card p-6">
            <div className="space-y-4">
              <h2 className="font-display text-xl font-bold">Contact Numbers</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label>Phone 1</Label><Input value={donation.phone1} onChange={(e) => setDonation({ ...donation, phone1: e.target.value })} /></div>
                <div><Label>Phone 2</Label><Input value={donation.phone2} onChange={(e) => setDonation({ ...donation, phone2: e.target.value })} /></div>
              </div>
              <Button onClick={() => saveSetting("donation", donation)} className="bg-gradient-saffron"><Save className="mr-2 h-4 w-4" />Save Contact</Button>
            </div>

            <div className="space-y-4 border-t pt-6">
              <h2 className="font-display text-xl font-bold">Map & Address</h2>
              <div>
                <Label>Google Maps Embed URL</Label>
                <Input value={mapSettings.embed_url} onChange={(e) => setMapSettings({ ...mapSettings, embed_url: e.target.value })} placeholder="https://www.google.com/maps?q=...&output=embed" />
                <p className="mt-1 text-xs text-muted-foreground">Open Google Maps → Share → Embed a map → copy the src URL.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label>Address (Telugu)</Label><Input value={mapSettings.address_te} onChange={(e) => setMapSettings({ ...mapSettings, address_te: e.target.value })} /></div>
                <div><Label>Address (English)</Label><Input value={mapSettings.address_en} onChange={(e) => setMapSettings({ ...mapSettings, address_en: e.target.value })} /></div>
              </div>
              <Button onClick={() => saveSetting("map", mapSettings)} className="bg-gradient-saffron"><Save className="mr-2 h-4 w-4" />Save Map</Button>
            </div>
          </TabsContent>

          <TabsContent value="events" className="mt-6 space-y-6 rounded-2xl border-2 border-primary/20 bg-card p-6">
            <div className="space-y-3 rounded-xl border-2 border-primary/15 bg-muted/40 p-4">
              <h2 className="font-display text-xl font-bold">Add Event</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input placeholder="Title (Telugu)" value={newEvent.title_te} onChange={(e) => setNewEvent({ ...newEvent, title_te: e.target.value })} />
                <Input placeholder="Title (English)" value={newEvent.title_en} onChange={(e) => setNewEvent({ ...newEvent, title_en: e.target.value })} />
                <Textarea placeholder="Description (Telugu)" value={newEvent.description_te} onChange={(e) => setNewEvent({ ...newEvent, description_te: e.target.value })} />
                <Textarea placeholder="Description (English)" value={newEvent.description_en} onChange={(e) => setNewEvent({ ...newEvent, description_en: e.target.value })} />
                <Input type="date" value={newEvent.event_date} onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })} />
              </div>
              <Button onClick={addEvent} className="bg-gradient-saffron"><Plus className="mr-2 h-4 w-4" />Add Event</Button>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Existing Events ({events.length})</h3>
              {events.map((e) => (
                <div key={e.id} className="flex items-start justify-between gap-3 rounded-xl border bg-card p-3">
                  <div>
                    <p className="font-bold">{e.title_te} <span className="text-muted-foreground">/ {e.title_en}</span></p>
                    {e.event_date && <p className="text-xs text-muted-foreground">{e.event_date}</p>}
                  </div>
                  <Button onClick={() => deleteEvent(e.id)} variant="destructive" size="sm"><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="gallery" className="mt-6 space-y-6 rounded-2xl border-2 border-primary/20 bg-card p-6">
            <GalleryUploader onUpload={uploadGallery} uploading={uploading} />
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {gallery.map((g) => (
                <div key={g.id} className="group relative overflow-hidden rounded-xl border">
                  <img src={g.image_url} alt="" className="aspect-square w-full object-cover" />
                  <button
                    onClick={() => deleteGallery(g.id)}
                    className="absolute right-2 top-2 rounded-full bg-destructive p-2 text-destructive-foreground opacity-0 shadow-deep transition-smooth group-hover:opacity-100"
                    aria-label="Delete photo"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

const GalleryUploader = ({ onUpload, uploading }: { onUpload: (f: File, te: string, en: string) => void; uploading: boolean }) => {
  const [file, setFile] = useState<File | null>(null);
  const [captionTe, setCaptionTe] = useState("");
  const [captionEn, setCaptionEn] = useState("");
  return (
    <div className="space-y-3 rounded-xl border-2 border-dashed border-primary/30 bg-muted/40 p-4">
      <h2 className="font-display text-xl font-bold">Upload Photo</h2>
      <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Input placeholder="Caption (Telugu, optional)" value={captionTe} onChange={(e) => setCaptionTe(e.target.value)} />
        <Input placeholder="Caption (English, optional)" value={captionEn} onChange={(e) => setCaptionEn(e.target.value)} />
      </div>
      <Button
        disabled={!file || uploading}
        onClick={() => { if (file) { onUpload(file, captionTe, captionEn); setFile(null); setCaptionTe(""); setCaptionEn(""); } }}
        className="bg-gradient-saffron"
      >
        <Upload className="mr-2 h-4 w-4" />{uploading ? "Uploading..." : "Upload"}
      </Button>
    </div>
  );
};

export default AdminDashboard;
