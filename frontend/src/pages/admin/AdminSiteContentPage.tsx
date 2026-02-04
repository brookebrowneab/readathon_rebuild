import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import AdminPageLayout from '../../components/layout/AdminPageLayout';
import { getSiteContent } from '../../lib/api';
import Textarea from '../../components/ui/textarea';
import Button from '../../components/ui/button';
import useAdminGuard from '../../lib/useAdminGuard';

type ContentItem = { key: string; value: string };

export default function AdminSiteContentPage() {
  const { loading } = useAdminGuard();
  const [items, setItems] = useState<ContentItem[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getSiteContent();
        setItems(data);
      } catch {
        setItems([]);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <AdminPageLayout title="Site Content" subtitle="Edit homepage copy and stats.">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout title="Site Content" subtitle="Edit text displayed on public pages">
      <div className="space-y-6">
        <div className="bg-background p-6 hand-drawn">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Site Content</h3>
              <p className="text-xs text-muted-foreground">Edit text displayed on public pages</p>
            </div>
            <Button variant="secondary" className="gap-2">
              <Save className="h-4 w-4" />
              Saved
            </Button>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <span>Home Page</span>
              <span className="text-xs text-muted-foreground">(8 items)</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold text-foreground">Hero Headlines</p>
                <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] uppercase text-muted-foreground">
                  JSON
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Rotating headlines shown in the hero section (JSON array of strings)
              </p>
              <Textarea
                className="font-mono text-sm"
                rows={6}
                defaultValue={`[\n  \"Every Page Counts.\",\n  \"Read More. Grow Together.\",\n  \"Read books. Support Janney.\"\n]`}
              />
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-foreground">Hero Description</p>
              <p className="text-xs text-muted-foreground">Main paragraph under the hero headline</p>
              <Textarea
                rows={3}
                defaultValue={items.find((item) => item.key === 'hero_description')?.value || ''}
              />
            </div>
          </div>
        </div>
      </div>
    </AdminPageLayout>
  );
}
