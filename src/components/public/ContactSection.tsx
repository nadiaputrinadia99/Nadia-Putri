import React, { useState } from 'react';
import { Mail, MessageSquare, Instagram, Linkedin, Send, Copy, Check, Sparkles } from 'lucide-react';
import { Contact } from '../../types';

interface ContactSectionProps {
  contacts: Contact[];
}

export const ContactSection: React.FC<ContactSectionProps> = ({ contacts }) => {
  const [senderName, setSenderName] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Extract primary WhatsApp and Email values if available
  const waContact = contacts.find((c) => c.type === 'whatsapp');
  const emailContact = contacts.find((c) => c.type === 'email');

  const getContactDetails = (contact: Contact) => {
    switch (contact.type) {
      case 'whatsapp': {
        const cleanNumber = contact.value.replace(/[^0-9]/g, '');
        const href = contact.value.startsWith('http')
          ? contact.value
          : `https://wa.me/${cleanNumber}`;
        return {
          icon: MessageSquare,
          title: 'WhatsApp',
          label: contact.value,
          href,
          colorClass: 'text-emerald-600 bg-emerald-50 hover:border-emerald-300',
        };
      }
      case 'email': {
        const email = contact.value.replace(/^mailto:/i, '');
        return {
          icon: Mail,
          title: 'Email',
          label: email,
          href: `mailto:${email}`,
          colorClass: 'text-blue-600 bg-blue-50 hover:border-blue-300',
        };
      }
      case 'instagram': {
        const href = contact.value.startsWith('http')
          ? contact.value
          : `https://instagram.com/${contact.value.replace(/^@/, '')}`;
        return {
          icon: Instagram,
          title: 'Instagram',
          label: contact.value.replace(/^https?:\/\/(www\.)?instagram\.com\//i, '@'),
          href,
          colorClass: 'text-rose-600 bg-rose-50 hover:border-rose-300',
        };
      }
      case 'linkedin': {
        const href = contact.value.startsWith('http')
          ? contact.value
          : `https://linkedin.com/in/${contact.value}`;
        return {
          icon: Linkedin,
          title: 'LinkedIn',
          label: 'LinkedIn Profile',
          href,
          colorClass: 'text-sky-600 bg-sky-50 hover:border-sky-300',
        };
      }
      default:
        return {
          icon: Send,
          title: 'Kontak',
          label: contact.value,
          href: contact.value,
          colorClass: 'text-zinc-600 bg-zinc-50 hover:border-zinc-300',
        };
    }
  };

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waContact) return;
    const cleanNumber = waContact.value.replace(/[^0-9]/g, '');
    const text = `Halo, perkenalkan saya *${senderName.trim() || 'Pengunjung Portofolio'}*.\n\n*Perihal:* ${
      subject.trim() || 'Pertanyaan & Peluang Kerja Sama'
    }\n\n*Pesan:* ${message.trim() || 'Halo, saya tertarik dengan portofolio Anda.'}`;
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailContact) return;
    const email = emailContact.value.replace(/^mailto:/i, '');
    const mailtoSubject = encodeURIComponent(subject.trim() || 'Pertanyaan & Kolaborasi Portofolio');
    const mailtoBody = encodeURIComponent(
      `Halo,\n\nNama: ${senderName.trim() || '-'}\n\nPesan:\n${message.trim()}`
    );
    window.location.href = `mailto:${email}?subject=${mailtoSubject}&body=${mailtoBody}`;
  };

  const copyEmailToClipboard = () => {
    if (!emailContact) return;
    const email = emailContact.value.replace(/^mailto:/i, '');
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <section id="kontak" className="py-14 md:py-20 border-t border-zinc-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 mb-3 border border-blue-100">
            <Send className="w-3.5 h-3.5" />
            <span>Terhubung</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 mb-3">
            Mari Berkolaborasi
          </h2>
          <p className="text-zinc-600 text-sm sm:text-base">
            Silakan hubungi saya melalui salah satu kanal komunikasi berikut atau kirim pesan singkat secara langsung.
          </p>
        </div>

        {/* Contact Links Grid (Touch-friendly 44x44px minimum) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-10">
          {contacts.map((contact) => {
            const details = getContactDetails(contact);
            const Icon = details.icon;

            return (
              <a
                key={contact.id}
                href={details.href}
                target={contact.type === 'email' ? '_self' : '_blank'}
                rel="noopener noreferrer"
                className="min-h-[56px] p-5 rounded-2xl bg-white border border-zinc-200 hover:border-blue-400 hover:shadow-md transition-all flex flex-col items-center text-center group"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110 ${details.colorClass}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-900 mb-1">
                  {details.title}
                </h3>
                <p className="text-xs text-zinc-500 truncate max-w-full font-normal">
                  {details.label}
                </p>
              </a>
            );
          })}
        </div>

        {/* Interactive Quick Message Composer */}
        <div className="max-w-2xl mx-auto bg-zinc-50/70 border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 pb-4 border-b border-zinc-200">
            <div>
              <h3 className="font-bold text-lg text-zinc-900">Kirim Pesan Langsung</h3>
              <p className="text-xs sm:text-sm text-zinc-500">
                Pesan akan otomatis diformat dan diteruskan ke WhatsApp atau Email.
              </p>
            </div>

            {emailContact && (
              <button
                type="button"
                onClick={copyEmailToClipboard}
                className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 bg-white border border-zinc-200 px-3 py-1.5 rounded-lg min-h-[36px] self-start sm:self-auto"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEmail ? 'Email Disalin!' : 'Salin Email'}</span>
              </button>
            )}
          </div>

          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-1">
                  Nama Anda
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Contoh: Dimas Aditya"
                  className="w-full px-3.5 py-2.5 min-h-[44px] text-sm border border-zinc-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-1">
                  Topik / Subjek
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Contoh: Tawaran Kolaborasi Proyek"
                  className="w-full px-3.5 py-2.5 min-h-[44px] text-sm border border-zinc-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-1">
                Pesan Anda
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tuliskan kebutuhan, timeline, atau detail diskusi yang ingin Anda bicarakan..."
                className="w-full px-3.5 py-2.5 text-sm border border-zinc-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {waContact && (
                <button
                  type="button"
                  onClick={handleSendWhatsApp}
                  className="min-h-[44px] px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-700 active:bg-emerald-800 flex items-center justify-center gap-2 transition-colors shadow-2xs flex-1"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Kirim via WhatsApp</span>
                </button>
              )}

              {emailContact && (
                <button
                  type="button"
                  onClick={handleSendEmail}
                  className="min-h-[44px] px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 active:bg-blue-800 flex items-center justify-center gap-2 transition-colors shadow-2xs flex-1"
                >
                  <Mail className="w-4 h-4" />
                  <span>Kirim via Email</span>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
