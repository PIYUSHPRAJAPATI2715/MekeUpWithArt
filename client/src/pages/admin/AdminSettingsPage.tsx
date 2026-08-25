import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api';
import { useToast } from '../../components/common/Toast';
import { Settings, Clock, Calendar, Save, Plus, Trash2 } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'business' | 'hours' | 'holidays'>('business');

  // Business Info State
  const [businessName, setBusinessName] = useState('');
  const [phoneNumbers, setPhoneNumbers] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [instagram, setInstagram] = useState('');
  const [googleMapsIframeUrl, setGoogleMapsIframeUrl] = useState('');
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubheading, setHeroSubheading] = useState('');
  const [aboutContent, setAboutContent] = useState('');
  const [isSavingBusiness, setIsSavingBusiness] = useState(false);

  // Working Hours State
  const [workingHours, setWorkingHours] = useState<any[]>([]);

  // Holidays State
  const [holidays, setHolidays] = useState<any[]>([]);
  const [newHolidayDate, setNewHolidayDate] = useState('');
  const [newHolidayTitle, setNewHolidayTitle] = useState('');

  useEffect(() => {
    // Load Business Settings
    adminApi.getSettings().then((res) => {
      if (res.data.success && res.data.data) {
        const d = res.data.data;
        setBusinessName(d.businessName || '');
        setPhoneNumbers(d.phoneNumbers ? d.phoneNumbers.join(', ') : '8949009360, 7357496309');
        setEmail(d.email || '');
        setAddress(d.address || '');
        setInstagram(d.instagram || '');
        setGoogleMapsIframeUrl(d.googleMapsIframeUrl || '');
        setHeroTitle(d.heroTitle || '');
        setHeroSubheading(d.heroSubheading || '');
        setAboutContent(d.aboutContent || '');
      }
    });

    // Load Working Hours
    adminApi.getWorkingHours().then((res) => {
      if (res.data.success) setWorkingHours(res.data.data);
    });

    // Load Holidays
    adminApi.getHolidays().then((res) => {
      if (res.data.success) setHolidays(res.data.data);
    });
  }, []);

  const handleSaveBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingBusiness(true);
    try {
      await adminApi.updateSettings({
        businessName,
        phoneNumbers: phoneNumbers.split(',').map((p) => p.trim()).filter(Boolean),
        email,
        address,
        instagram,
        googleMapsIframeUrl,
        heroTitle,
        heroSubheading,
        aboutContent,
      });
      showToast('Business settings updated successfully!', 'success');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update settings', 'error');
    } finally {
      setIsSavingBusiness(false);
    }
  };

  const handleSaveHours = async () => {
    try {
      await adminApi.updateWorkingHours(workingHours);
      showToast('Working hours updated', 'success');
    } catch (err) {
      showToast('Failed to update working hours', 'error');
    }
  };

  const handleAddHoliday = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHolidayDate || !newHolidayTitle) return;
    try {
      const res = await adminApi.createHoliday({ date: newHolidayDate, title: newHolidayTitle });
      if (res.data.success) {
        showToast('Holiday added', 'success');
        setHolidays([...holidays, res.data.data]);
        setNewHolidayDate('');
        setNewHolidayTitle('');
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to add holiday', 'error');
    }
  };

  const handleDeleteHoliday = async (id: string) => {
    try {
      await adminApi.deleteHoliday(id);
      showToast('Holiday deleted', 'info');
      setHolidays(holidays.filter((h) => h._id !== id));
    } catch (err) {
      showToast('Failed to delete holiday', 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-salon-border/60 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-salon-cream">Business Control Panel</h1>
          <p className="text-xs text-salon-muted">Configure salon branding, operating hours & holiday calendar</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('business')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold ${activeTab === 'business' ? 'bg-salon-gold text-salon-dark' : 'bg-salon-card text-salon-cream'}`}
          >
            Business Info
          </button>
          <button
            onClick={() => setActiveTab('hours')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold ${activeTab === 'hours' ? 'bg-salon-gold text-salon-dark' : 'bg-salon-card text-salon-cream'}`}
          >
            Operating Hours
          </button>
          <button
            onClick={() => setActiveTab('holidays')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold ${activeTab === 'holidays' ? 'bg-salon-gold text-salon-dark' : 'bg-salon-card text-salon-cream'}`}
          >
            Holidays
          </button>
        </div>
      </div>

      {activeTab === 'business' && (
        <form onSubmit={handleSaveBusiness} className="p-8 rounded-3xl glass-panel border border-salon-gold/25 space-y-4 text-xs shadow-xl">
          <h3 className="font-serif text-lg font-bold text-salon-cream">Salon Profile & Branding</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block uppercase font-bold text-salon-muted mb-1">Business Name</label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream"
              />
            </div>

            <div>
              <label className="block uppercase font-bold text-salon-muted mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block uppercase font-bold text-salon-muted mb-1">Phone Numbers (Comma Separated)</label>
              <input
                type="text"
                required
                value={phoneNumbers}
                onChange={(e) => setPhoneNumbers(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream"
              />
            </div>

            <div>
              <label className="block uppercase font-bold text-salon-muted mb-1">Instagram Username</label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream"
              />
            </div>
          </div>

          <div>
            <label className="block uppercase font-bold text-salon-muted mb-1">Address</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream"
            />
          </div>

          <div>
            <label className="block uppercase font-bold text-salon-muted mb-1">Hero Title</label>
            <input
              type="text"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream"
            />
          </div>

          <div>
            <label className="block uppercase font-bold text-salon-muted mb-1">Hero Subheading</label>
            <input
              type="text"
              value={heroSubheading}
              onChange={(e) => setHeroSubheading(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream"
            />
          </div>

          <div>
            <label className="block uppercase font-bold text-salon-muted mb-1">About Content</label>
            <textarea
              rows={3}
              value={aboutContent}
              onChange={(e) => setAboutContent(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream resize-none"
            />
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              disabled={isSavingBusiness}
              className="px-8 py-3 rounded-xl bg-salon-gold text-salon-dark font-bold shadow-lg"
            >
              {isSavingBusiness ? 'SAVING...' : 'SAVE BUSINESS SETTINGS'}
            </button>
          </div>
        </form>
      )}

      {activeTab === 'hours' && (
        <div className="p-8 rounded-3xl glass-panel border border-salon-gold/25 space-y-4 text-xs">
          <h3 className="font-serif text-lg font-bold text-salon-cream">Weekly Operating Hours & Breaks</h3>

          <div className="space-y-3">
            {workingHours.map((wh, idx) => (
              <div key={wh.day} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-salon-dark border border-salon-border gap-3">
                <div className="flex items-center gap-3 w-32">
                  <input
                    type="checkbox"
                    checked={wh.isOpen}
                    onChange={(e) => {
                      const updated = [...workingHours];
                      updated[idx].isOpen = e.target.checked;
                      setWorkingHours(updated);
                    }}
                  />
                  <span className="font-bold text-salon-cream">{wh.day}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span>Open:</span>
                  <input
                    type="text"
                    value={wh.openTime}
                    onChange={(e) => {
                      const updated = [...workingHours];
                      updated[idx].openTime = e.target.value;
                      setWorkingHours(updated);
                    }}
                    className="w-20 px-2 py-1 bg-salon-card border rounded text-center text-salon-gold"
                  />
                  <span>Close:</span>
                  <input
                    type="text"
                    value={wh.closeTime}
                    onChange={(e) => {
                      const updated = [...workingHours];
                      updated[idx].closeTime = e.target.value;
                      setWorkingHours(updated);
                    }}
                    className="w-20 px-2 py-1 bg-salon-card border rounded text-center text-salon-gold"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 flex justify-end">
            <button onClick={handleSaveHours} className="px-8 py-3 rounded-xl bg-salon-gold text-salon-dark font-bold shadow-lg">
              SAVE WORKING HOURS
            </button>
          </div>
        </div>
      )}

      {activeTab === 'holidays' && (
        <div className="p-8 rounded-3xl glass-panel border border-salon-gold/25 space-y-6 text-xs">
          <h3 className="font-serif text-lg font-bold text-salon-cream">Blocked Dates & Holiday Management</h3>

          <form onSubmit={handleAddHoliday} className="flex items-center gap-3">
            <input
              type="date"
              required
              value={newHolidayDate}
              onChange={(e) => setNewHolidayDate(e.target.value)}
              className="px-3 py-2 rounded-xl bg-salon-dark border border-salon-border text-salon-cream"
            />
            <input
              type="text"
              required
              placeholder="Holiday Title (e.g. Diwali Full Day)"
              value={newHolidayTitle}
              onChange={(e) => setNewHolidayTitle(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-salon-dark border border-salon-border text-salon-cream"
            />
            <button type="submit" className="px-4 py-2 rounded-xl bg-salon-gold text-salon-dark font-bold shrink-0">
              Add Holiday
            </button>
          </form>

          <div className="space-y-2">
            {holidays.map((h) => (
              <div key={h._id} className="flex items-center justify-between p-3 rounded-xl bg-salon-dark border border-salon-border">
                <div>
                  <span className="font-bold text-salon-gold">{h.date}</span> — <span className="text-salon-cream">{h.title}</span>
                </div>
                <button onClick={() => handleDeleteHoliday(h._id)} className="text-rose-400 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
