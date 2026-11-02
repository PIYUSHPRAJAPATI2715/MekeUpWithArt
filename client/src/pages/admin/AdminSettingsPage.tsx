import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api';
import { useToast } from '../../components/common/Toast';
import {
  Settings,
  Clock,
  Calendar,
  Save,
  Plus,
  Trash2,
  BellRing,
  FileText,
  ShieldCheck,
  MessageSquare,
  Sparkles,
  Award,
  Users,
  CheckCircle2,
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<
    'business' | 'banner' | 'about' | 'policies' | 'hours' | 'holidays' | 'whatsapp'
  >('business');

  // Business Info State
  const [businessName, setBusinessName] = useState('MAKEUP WITH ART');
  const [phoneNumbers, setPhoneNumbers] = useState('9352769045, 7575939735');
  const [email, setEmail] = useState('makeupwitharto@gmail.com');
  const [address, setAddress] = useState('Pillar No. 113, Shyam Nagar Metro Station, Jaipur');
  const [instagram, setInstagram] = useState('makeup.with.art');
  const [googleMapsIframeUrl, setGoogleMapsIframeUrl] = useState('');
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubheading, setHeroSubheading] = useState('');
  const [aboutContent, setAboutContent] = useState('');

  // Announcement Banner State
  const [bannerEnabled, setBannerEnabled] = useState(true);
  const [bannerText, setBannerText] = useState(
    '✨ Special Festive Offer: 20% OFF on HD Airbrush Bridal & Groom Packages! Book Online Today.'
  );
  const [bannerLink, setBannerLink] = useState('/packages');

  // About & Stats State
  const [aboutMission, setAboutMission] = useState('');
  const [aboutVision, setAboutVision] = useState('');
  const [happyClients, setHappyClients] = useState(4500);
  const [experienceYears, setExperienceYears] = useState(8);
  const [expertStylists, setExpertStylists] = useState(12);
  const [rating, setRating] = useState(4.9);

  // Legal Policies State
  const [termsAndConditions, setTermsAndConditions] = useState('');
  const [privacyPolicy, setPrivacyPolicy] = useState('');
  const [cancellationPolicy, setCancellationPolicy] = useState('');

  // WhatsApp Configuration State
  const [whatsappProvider, setWhatsappProvider] = useState<'WEB' | 'WAAPI' | 'META'>('WEB');
  const [whatsappApiToken, setWhatsappApiToken] = useState('');
  const [whatsappPhoneNumberId, setWhatsappPhoneNumberId] = useState('');

  const [isSaving, setIsSaving] = useState(false);

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
        setBusinessName(d.businessName || 'MAKEUP WITH ART');
        setPhoneNumbers(
          d.phoneNumbers && d.phoneNumbers.length > 0
            ? d.phoneNumbers.join(', ')
            : '9352769045, 7575939735'
        );
        setEmail(d.email || 'makeupwitharto@gmail.com');
        setAddress(d.address || 'Pillar No. 113, Shyam Nagar Metro Station, Jaipur');
        setInstagram(d.instagram || 'makeup.with.art');
        setGoogleMapsIframeUrl(d.googleMapsIframeUrl || '');
        setHeroTitle(d.heroTitle || 'Your Beauty. Your Style. Your Art.');
        setHeroSubheading(
          d.heroSubheading ||
            'Jaipur\'s Top-Rated Luxury Unisex Salon & HD Bridal Studio at Shyam Nagar Metro Station.'
        );
        setAboutContent(d.aboutContent || '');
        setAboutMission(d.aboutMission || '');
        setAboutVision(d.aboutVision || '');

        if (d.stats) {
          setHappyClients(d.stats.happyClients ?? 4500);
          setExperienceYears(d.stats.experienceYears ?? 8);
          setExpertStylists(d.stats.expertStylists ?? 12);
          setRating(d.stats.rating ?? 4.9);
        }

        if (d.announcementBanner) {
          setBannerEnabled(d.announcementBanner.enabled ?? true);
          setBannerText(d.announcementBanner.text || '');
          setBannerLink(d.announcementBanner.link || '/packages');
        }

        setTermsAndConditions(d.termsAndConditions || '');
        setPrivacyPolicy(d.privacyPolicy || '');
        setCancellationPolicy(d.cancellationPolicy || '');

        if (d.whatsappConfig) {
          setWhatsappProvider(d.whatsappConfig.provider || 'WEB');
          setWhatsappApiToken(d.whatsappConfig.apiToken || '');
          setWhatsappPhoneNumberId(d.whatsappConfig.phoneNumberId || '');
        }
      }
    });

    // Load Working Hours
    adminApi.getWorkingHours().then((res) => {
      if (res.data.success) {
        if (res.data.data && res.data.data.length > 0) {
          setWorkingHours(res.data.data);
        } else {
          const defaultDays = [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ].map((day) => ({
            day,
            isOpen: true,
            openTime: '10:30',
            closeTime: '21:30',
            breakStart: '14:00',
            breakEnd: '14:30',
          }));
          setWorkingHours(defaultDays);
        }
      }
    });

    // Load Holidays
    adminApi.getHolidays().then((res) => {
      if (res.data.success) setHolidays(res.data.data);
    });
  }, []);

  const handleSaveAllSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
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
        aboutMission,
        aboutVision,
        stats: {
          happyClients: Number(happyClients),
          experienceYears: Number(experienceYears),
          expertStylists: Number(expertStylists),
          rating: Number(rating),
        },
        announcementBanner: {
          enabled: bannerEnabled,
          text: bannerText,
          link: bannerLink,
        },
        termsAndConditions,
        privacyPolicy,
        cancellationPolicy,
        whatsappConfig: {
          provider: whatsappProvider,
          apiToken: whatsappApiToken,
          phoneNumberId: whatsappPhoneNumberId,
        },
      });
      showToast('Settings saved successfully!', 'success');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveHours = async () => {
    try {
      await adminApi.updateWorkingHours(workingHours);
      showToast('Working hours schedule updated!', 'success');
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

  const tabs = [
    { id: 'business', label: 'Salon Profile', icon: Settings },
    { id: 'banner', label: 'Offer Banner', icon: BellRing },
    { id: 'about', label: 'About & Stats', icon: Sparkles },
    { id: 'policies', label: 'Legal Policies', icon: ShieldCheck },
    { id: 'whatsapp', label: 'WhatsApp API', icon: MessageSquare },
    { id: 'hours', label: 'Working Hours', icon: Clock },
    { id: 'holidays', label: 'Holidays', icon: Calendar },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-salon-border/60 pb-4 gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-salon-cream">
            Universal Salon Control Panel
          </h1>
          <p className="text-xs text-salon-muted">
            Configure dynamic content, policy pages, banner notices, WhatsApp gateways, and salon schedule.
          </p>
        </div>

        <button
          onClick={() => handleSaveAllSettings()}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-salon-gold hover:bg-salon-gold/90 text-salon-dark font-bold text-xs uppercase tracking-wider shadow-lg shadow-salon-gold/20 disabled:opacity-50 transition-all"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>

      {/* Tabs navigation */}
      <div className="flex flex-wrap gap-2 border-b border-salon-border/40 pb-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-salon-gold text-salon-dark shadow-md shadow-salon-gold/20'
                  : 'bg-salon-card/80 text-salon-cream/80 hover:bg-salon-card hover:text-salon-gold border border-salon-border/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Salon Profile */}
      {activeTab === 'business' && (
        <form onSubmit={handleSaveAllSettings} className="p-6 sm:p-8 rounded-3xl glass-panel border border-salon-gold/25 space-y-4 text-xs shadow-xl">
          <h3 className="font-serif text-lg font-bold text-salon-cream">Salon Identity & Contacts</h3>

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
              <label className="block uppercase font-bold text-salon-muted mb-1">Official Email</label>
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
                className="w-full px-3.5 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream font-mono"
              />
            </div>

            <div>
              <label className="block uppercase font-bold text-salon-muted mb-1">Instagram Handle</label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream"
              />
            </div>
          </div>

          <div>
            <label className="block uppercase font-bold text-salon-muted mb-1">Physical Salon Address</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream"
            />
          </div>

          <div>
            <label className="block uppercase font-bold text-salon-muted mb-1">Google Maps Embed URL</label>
            <input
              type="text"
              value={googleMapsIframeUrl}
              onChange={(e) => setGoogleMapsIframeUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream"
            />
          </div>

          <div>
            <label className="block uppercase font-bold text-salon-muted mb-1">Homepage Hero Title</label>
            <input
              type="text"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream"
            />
          </div>

          <div>
            <label className="block uppercase font-bold text-salon-muted mb-1">Homepage Hero Subheading</label>
            <input
              type="text"
              value={heroSubheading}
              onChange={(e) => setHeroSubheading(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream"
            />
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-salon-gold text-salon-dark font-bold uppercase tracking-wider"
            >
              {isSaving ? 'Saving...' : 'Update Profile'}
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Offer Banner */}
      {activeTab === 'banner' && (
        <form onSubmit={handleSaveAllSettings} className="p-6 sm:p-8 rounded-3xl glass-panel border border-salon-gold/25 space-y-5 text-xs shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-salon-border/60">
            <div>
              <h3 className="font-serif text-lg font-bold text-salon-cream">Top Website Announcement Banner</h3>
              <p className="text-xs text-salon-muted">Display a sticky notification bar across the top of all customer pages.</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-salon-cream">
              <input
                type="checkbox"
                checked={bannerEnabled}
                onChange={(e) => setBannerEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-salon-gold accent-salon-gold"
              />
              Banner Active
            </label>
          </div>

          <div>
            <label className="block uppercase font-bold text-salon-muted mb-1">Banner Announcement Text</label>
            <input
              type="text"
              value={bannerText}
              onChange={(e) => setBannerText(e.target.value)}
              placeholder="e.g. ✨ Special Offer: Flat 20% OFF on Pre-Bridal & Groom Makeup!"
              className="w-full px-3.5 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream"
            />
          </div>

          <div>
            <label className="block uppercase font-bold text-salon-muted mb-1">Target Link URL</label>
            <input
              type="text"
              value={bannerLink}
              onChange={(e) => setBannerLink(e.target.value)}
              placeholder="e.g. /packages or /services"
              className="w-full px-3.5 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream"
            />
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-salon-gold text-salon-dark font-bold uppercase tracking-wider"
            >
              {isSaving ? 'Saving...' : 'Save Banner Settings'}
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: About & Stats */}
      {activeTab === 'about' && (
        <form onSubmit={handleSaveAllSettings} className="p-6 sm:p-8 rounded-3xl glass-panel border border-salon-gold/25 space-y-5 text-xs shadow-xl">
          <h3 className="font-serif text-lg font-bold text-salon-cream">About Us Page & Studio Statistics</h3>

          <div>
            <label className="block uppercase font-bold text-salon-muted mb-1">About Salon Main Story</label>
            <textarea
              rows={4}
              value={aboutContent}
              onChange={(e) => setAboutContent(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block uppercase font-bold text-salon-muted mb-1">Our Mission</label>
              <textarea
                rows={3}
                value={aboutMission}
                onChange={(e) => setAboutMission(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream leading-relaxed"
              />
            </div>

            <div>
              <label className="block uppercase font-bold text-salon-muted mb-1">Our Vision</label>
              <textarea
                rows={3}
                value={aboutVision}
                onChange={(e) => setAboutVision(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream leading-relaxed"
              />
            </div>
          </div>

          <div className="pt-3">
            <h4 className="font-serif text-sm font-bold text-salon-gold mb-3">Live Impact Metrics</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block uppercase font-bold text-salon-muted mb-1">Happy Clients</label>
                <input
                  type="number"
                  value={happyClients}
                  onChange={(e) => setHappyClients(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-salon-dark border border-salon-border text-salon-cream"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-salon-muted mb-1">Experience Years</label>
                <input
                  type="number"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-salon-dark border border-salon-border text-salon-cream"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-salon-muted mb-1">Expert Stylists</label>
                <input
                  type="number"
                  value={expertStylists}
                  onChange={(e) => setExpertStylists(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-salon-dark border border-salon-border text-salon-cream"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-salon-muted mb-1">Google Rating</label>
                <input
                  type="number"
                  step="0.1"
                  value={rating}
                  onChange={(e) => setRating(parseFloat(e.target.value) || 4.9)}
                  className="w-full px-3 py-2 rounded-xl bg-salon-dark border border-salon-border text-salon-cream"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-salon-gold text-salon-dark font-bold uppercase tracking-wider"
            >
              {isSaving ? 'Saving...' : 'Save About Page Content'}
            </button>
          </div>
        </form>
      )}

      {/* Tab 4: Legal Policies */}
      {activeTab === 'policies' && (
        <form onSubmit={handleSaveAllSettings} className="p-6 sm:p-8 rounded-3xl glass-panel border border-salon-gold/25 space-y-6 text-xs shadow-xl">
          <div>
            <h3 className="font-serif text-lg font-bold text-salon-cream">Legal & SEO Compliance Pages</h3>
            <p className="text-xs text-salon-muted">
              Edit the live content for Terms & Conditions, Privacy Policy, and Cancellation rules.
            </p>
          </div>

          <div>
            <label className="block uppercase font-bold text-salon-muted mb-1">
              Terms & Conditions Content (Markdown supported)
            </label>
            <textarea
              rows={7}
              value={termsAndConditions}
              onChange={(e) => setTermsAndConditions(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream font-mono leading-relaxed"
            />
          </div>

          <div>
            <label className="block uppercase font-bold text-salon-muted mb-1">
              Privacy Policy Content (Crucial for Google Ads & Analytics)
            </label>
            <textarea
              rows={7}
              value={privacyPolicy}
              onChange={(e) => setPrivacyPolicy(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream font-mono leading-relaxed"
            />
          </div>

          <div>
            <label className="block uppercase font-bold text-salon-muted mb-1">
              Cancellation & Refund Policy Content
            </label>
            <textarea
              rows={6}
              value={cancellationPolicy}
              onChange={(e) => setCancellationPolicy(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream font-mono leading-relaxed"
            />
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-salon-gold text-salon-dark font-bold uppercase tracking-wider"
            >
              {isSaving ? 'Saving...' : 'Save Legal Policies'}
            </button>
          </div>
        </form>
      )}

      {/* Tab 5: WhatsApp API */}
      {activeTab === 'whatsapp' && (
        <form onSubmit={handleSaveAllSettings} className="p-6 sm:p-8 rounded-3xl glass-panel border border-salon-gold/25 space-y-6 text-xs shadow-xl">
          <div>
            <h3 className="font-serif text-lg font-bold text-salon-cream flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              WhatsApp Gateway & Automation Credentials
            </h3>
            <p className="text-xs text-salon-muted">
              Configure Meta Cloud API, WaAPI, or WhatsApp Web QR link to enable automatic notifications.
            </p>
          </div>

          <div>
            <label className="block uppercase font-bold text-salon-muted mb-1">Active WhatsApp Dispatch Engine</label>
            <select
              value={whatsappProvider}
              onChange={(e: any) => setWhatsappProvider(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream"
            >
              <option value="WEB">WhatsApp Web & Direct Clicker (Free & Included)</option>
              <option value="WAAPI">WaAPI Instance Gateway (No Meta Approval Needed)</option>
              <option value="META">Meta WhatsApp Business Cloud API (Official)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block uppercase font-bold text-salon-muted mb-1">
                API Bearer Token (WaAPI or Meta Token)
              </label>
              <input
                type="password"
                placeholder="Paste API token here..."
                value={whatsappApiToken}
                onChange={(e) => setWhatsappApiToken(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream font-mono"
              />
            </div>

            <div>
              <label className="block uppercase font-bold text-salon-muted mb-1">
                Meta Phone Number ID (Meta Cloud API only)
              </label>
              <input
                type="text"
                placeholder="e.g. 10982347182938"
                value={whatsappPhoneNumberId}
                onChange={(e) => setWhatsappPhoneNumberId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream font-mono"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-salon-dark/80 border border-salon-border space-y-2">
            <span className="font-bold text-salon-gold block">What do you need for 100% automated broadcasting?</span>
            <ul className="space-y-1.5 text-salon-cream/80 list-disc pl-4">
              <li>
                <strong>Option 1 (Instant & Free):</strong> Use our built-in <em>WhatsApp Broadcast Direct Linker</em> in the Broadcasts tab. No API key needed!
              </li>
              <li>
                <strong>Option 2 (WaAPI):</strong> Sign up at waapi.app, copy your instance API token and paste above.
              </li>
              <li>
                <strong>Option 3 (Official Meta Cloud API):</strong> Create a Meta App on developers.facebook.com, add WhatsApp Product, and copy your System User Token & Phone ID.
              </li>
            </ul>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-salon-gold text-salon-dark font-bold uppercase tracking-wider"
            >
              {isSaving ? 'Saving...' : 'Save WhatsApp Configuration'}
            </button>
          </div>
        </form>
      )}

      {/* Tab 6: Operating Hours */}
      {activeTab === 'hours' && (
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-salon-gold/25 space-y-4 text-xs">
          <h3 className="font-serif text-lg font-bold text-salon-cream">Weekly Operating Hours & Breaks</h3>

          <div className="space-y-3">
            {workingHours.map((wh, idx) => (
              <div
                key={wh.day}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-salon-dark border border-salon-border gap-3"
              >
                <div className="flex items-center gap-3 w-32">
                  <input
                    type="checkbox"
                    checked={wh.isOpen}
                    onChange={(e) => {
                      const updated = [...workingHours];
                      updated[idx].isOpen = e.target.checked;
                      setWorkingHours(updated);
                    }}
                    className="w-4 h-4 rounded text-salon-gold accent-salon-gold"
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
                    className="w-20 px-2 py-1 bg-salon-card border rounded text-center text-salon-gold font-mono"
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
                    className="w-20 px-2 py-1 bg-salon-card border rounded text-center text-salon-gold font-mono"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 flex justify-end">
            <button
              onClick={handleSaveHours}
              className="px-6 py-2.5 rounded-xl bg-salon-gold text-salon-dark font-bold uppercase tracking-wider"
            >
              Save Schedule
            </button>
          </div>
        </div>
      )}

      {/* Tab 7: Holidays */}
      {activeTab === 'holidays' && (
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-salon-gold/25 space-y-6 text-xs">
          <h3 className="font-serif text-lg font-bold text-salon-cream">Blocked Dates & Holiday Management</h3>

          <form onSubmit={handleAddHoliday} className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="date"
              required
              value={newHolidayDate}
              onChange={(e) => setNewHolidayDate(e.target.value)}
              className="px-3 py-2 rounded-xl bg-salon-dark border border-salon-border text-salon-cream w-full sm:w-auto"
            />
            <input
              type="text"
              required
              placeholder="Holiday Title (e.g. Diwali Salon Break)"
              value={newHolidayTitle}
              onChange={(e) => setNewHolidayTitle(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-salon-dark border border-salon-border text-salon-cream w-full"
            />
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-salon-gold text-salon-dark font-bold shrink-0 w-full sm:w-auto uppercase tracking-wider"
            >
              Add Holiday
            </button>
          </form>

          <div className="space-y-2">
            {holidays.length === 0 ? (
              <div className="text-center py-6 text-salon-muted">No holidays or closures scheduled.</div>
            ) : (
              holidays.map((h) => (
                <div
                  key={h._id}
                  className="flex items-center justify-between p-3 rounded-xl bg-salon-dark border border-salon-border"
                >
                  <div>
                    <span className="font-bold text-salon-gold">{h.date}</span> —{' '}
                    <span className="text-salon-cream">{h.title}</span>
                  </div>
                  <button onClick={() => handleDeleteHoliday(h._id)} className="text-rose-400 p-1 hover:text-rose-300">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
