import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { PLUMBING_SERVICES, VERIFIED_BRAND } from '../data/brandData';
import { BorderlessCta } from '../components/BorderlessCta';
import type { PublicBusinessConfig } from '../components/Footer';

interface ContactPageProps {
  config: PublicBusinessConfig | null;
  preselectedService?: string;
}

interface SubmissionResult {
  ok: boolean;
  delivered?: boolean;
  status?: string;
  referenceId?: string;
  message: string;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  config,
  preselectedService,
}) => {
  const pageRef = useRef<HTMLDivElement>(null);

  const [csrfToken, setCsrfToken] = useState<string>('');
  const [startedAt, setStartedAt] = useState<number>(() => Date.now());
  const [submitting, setSubmitting] = useState(false);

  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceAddress, setServiceAddress] = useState('');
  const [serviceCategory, setServiceCategory] = useState(
    preselectedService || PLUMBING_SERVICES[0].title
  );
  const [preferredContact, setPreferredContact] = useState<'phone' | 'email' | 'instagram'>('phone');
  const [plumbingIssue, setPlumbingIssue] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState(''); // honeypot

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<SubmissionResult | null>(null);

  const loadCsrfToken = async () => {
    try {
      const res = await fetch('/api/csrf-token', { credentials: 'same-origin' });
      if (res.ok) {
        const data = (await res.json()) as { csrfToken: string };
        setCsrfToken(data.csrfToken);
      }
    } catch {
      // Handled gracefully on submit if unavailable
    }
  };

  useEffect(() => {
    loadCsrfToken();
    setStartedAt(Date.now());
  }, []);

  useEffect(() => {
    if (preselectedService) {
      setServiceCategory(preselectedService);
    }
  }, [preselectedService]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return;

      gsap.from('.contact-reveal', {
        y: 24,
        opacity: 0,
        duration: 0.75,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const validateClient = (): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (customerName.trim().length < 2) {
      errs.customerName = 'Please enter your full name.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }
    const digits = phone.replace(/\D/g, '').length;
    if (digits < 7 || digits > 15) {
      errs.phone = 'Please enter a valid phone number.';
    }
    if (serviceAddress.trim().length < 5) {
      errs.serviceAddress = 'Please enter the service address or city.';
    }
    if (plumbingIssue.trim().length < 12) {
      errs.plumbingIssue = 'Please describe the plumbing work needed (at least 12 characters).';
    }
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);

    const clientErrors = validateClient();
    setFieldErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) return;

    setSubmitting(true);
    try {
      let tokenToUse = csrfToken;
      if (!tokenToUse) {
        const tokenRes = await fetch('/api/csrf-token', { credentials: 'same-origin' });
        if (tokenRes.ok) {
          const tokenData = (await tokenRes.json()) as { csrfToken: string };
          tokenToUse = tokenData.csrfToken;
          setCsrfToken(tokenToUse);
        }
      }

      const response = await fetch('/api/service-request', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': tokenToUse,
        },
        body: JSON.stringify({
          customerName,
          email,
          phone,
          serviceAddress,
          serviceCategory,
          preferredContact,
          plumbingIssue,
          websiteUrl,
          startedAt,
        }),
      });

      const payload = (await response.json()) as {
        ok: boolean;
        delivered?: boolean;
        status?: string;
        referenceId?: string;
        message?: string;
        error?: string;
        fieldErrors?: Record<string, string>;
      };

      if (!response.ok || !payload.ok) {
        if (payload.fieldErrors) {
          setFieldErrors(payload.fieldErrors);
        }
        setResult({
          ok: false,
          message:
            payload.error || 'Could not submit your service request. Please review your details.',
        });
        if (response.status === 403) {
          loadCsrfToken();
        }
        return;
      }

      setResult({
        ok: true,
        delivered: payload.delivered,
        status: payload.status,
        referenceId: payload.referenceId,
        message: payload.message || 'Service request processed.',
      });

      if (payload.delivered) {
        setCustomerName('');
        setEmail('');
        setPhone('');
        setServiceAddress('');
        setPlumbingIssue('');
      }
      loadCsrfToken();
      setStartedAt(Date.now());
    } catch {
      setResult({
        ok: false,
        message:
          'Network error reaching the submission endpoint. Please verify your connection or message @the_american_plumber directly on Instagram.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div ref={pageRef} className="w-full overflow-x-hidden">
      {/* Top Editorial Banner (Sky Blue) */}
      <section className="bg-[#E6F2FF] text-[#303B43] pt-32 pb-16 md:pt-40 md:pb-20 border-b border-[#303B43]/12">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <p className="contact-reveal text-xs font-semibold uppercase tracking-[0.2em] text-[#2457F5] mb-4">
            Contact & Service Request
          </p>
          <h1 className="contact-reveal font-display font-extrabold text-4xl sm:text-6xl leading-[1.03] tracking-tight max-w-3xl mb-5">
            Send your plumbing scope directly to {VERIFIED_BRAND.name}.
          </h1>
          <p className="contact-reveal text-lg text-[#303B43]/80 max-w-2xl leading-relaxed">
            Share the details of your installation, replacement, or repair request below. Every
            field is validated cleanly—zero automated popups, zero third-party lead brokers.
          </p>
        </div>
      </section>

      {/* Main Split Contact + Underline Form (Warm Ivory) */}
      <section className="bg-[#FFFDF7] text-[#303B43] py-20 md:py-28">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20 items-start">
            {/* Left Column: Verified & Configurable Contact Info */}
            <div className="lg:col-span-5 space-y-10">
              <div className="contact-reveal border-t border-[#303B43]/20 pt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#18B9B0] mb-2">
                  Verified Official Channel
                </p>
                <h2 className="font-display font-bold text-2xl sm:text-3xl mb-3">
                  Instagram {VERIFIED_BRAND.instagramHandle}
                </h2>
                <p className="text-sm sm:text-base text-[#303B43]/80 leading-relaxed mb-4">
                  Official account verified for {VERIFIED_BRAND.name}. Direct messages and project
                  updates are available via Instagram.
                </p>
                <BorderlessCta
                  label="OPEN INSTAGRAM PROFILE"
                  href={VERIFIED_BRAND.instagramUrl}
                  external
                  tone="blue"
                  size="sm"
                />
              </div>

              <div className="contact-reveal border-t border-[#303B43]/20 pt-6 space-y-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2457F5]">
                  Business Contact Configuration
                </p>

                <div>
                  <span className="block text-xs uppercase tracking-wider text-[#303B43]/55 mb-1">
                    Confirmed Business Location
                  </span>
                  <p className="text-base font-semibold text-[#303B43]">
                    {config?.businessLocation
                      ? config.businessLocation
                      : 'Not publicly published on @the_american_plumber — configurable via BUSINESS_LOCATION'}
                  </p>
                </div>

                <div>
                  <span className="block text-xs uppercase tracking-wider text-[#303B43]/55 mb-1">
                    Direct Phone
                  </span>
                  {config?.businessPhone ? (
                    <a
                      href={`tel:${config.businessPhone}`}
                      className="text-base font-semibold text-[#2457F5] hover:underline"
                    >
                      {config.businessPhone}
                    </a>
                  ) : (
                    <p className="text-base font-medium text-[#303B43]/75">
                      Configurable via BUSINESS_PHONE environment variable
                    </p>
                  )}
                </div>

                <div>
                  <span className="block text-xs uppercase tracking-wider text-[#303B43]/55 mb-1">
                    Direct Email
                  </span>
                  {config?.businessEmail ? (
                    <a
                      href={`mailto:${config.businessEmail}`}
                      className="text-base font-semibold text-[#2457F5] hover:underline"
                    >
                      {config.businessEmail}
                    </a>
                  ) : (
                    <p className="text-base font-medium text-[#303B43]/75">
                      Configurable via BUSINESS_EMAIL & SMTP environment variables
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Open Underline Service Request Form */}
            <div className="lg:col-span-7">
              <form
                onSubmit={handleSubmit}
                noValidate
                className="contact-reveal space-y-8"
              >
                {/* Honeypot anti-spam field */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="websiteUrl">Leave this field empty</label>
                  <input
                    id="websiteUrl"
                    name="websiteUrl"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <label
                      htmlFor="customerName"
                      className="block text-xs font-semibold uppercase tracking-wider text-[#303B43]/75 mb-1"
                    >
                      Customer Name *
                    </label>
                    <input
                      id="customerName"
                      name="customerName"
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Your full name"
                      className={`field-underline ${
                        fieldErrors.customerName ? 'has-error' : ''
                      }`}
                    />
                    {fieldErrors.customerName && (
                      <p className="text-xs text-[#c81e1e] mt-1.5">
                        {fieldErrors.customerName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-semibold uppercase tracking-wider text-[#303B43]/75 mb-1"
                    >
                      Email Address *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={`field-underline ${fieldErrors.email ? 'has-error' : ''}`}
                    />
                    {fieldErrors.email && (
                      <p className="text-xs text-[#c81e1e] mt-1.5">{fieldErrors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-xs font-semibold uppercase tracking-wider text-[#303B43]/75 mb-1"
                    >
                      Phone Number *
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(555) 000-0000"
                      className={`field-underline ${fieldErrors.phone ? 'has-error' : ''}`}
                    />
                    {fieldErrors.phone && (
                      <p className="text-xs text-[#c81e1e] mt-1.5">{fieldErrors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="serviceAddress"
                      className="block text-xs font-semibold uppercase tracking-wider text-[#303B43]/75 mb-1"
                    >
                      Service Address *
                    </label>
                    <input
                      id="serviceAddress"
                      name="serviceAddress"
                      type="text"
                      required
                      value={serviceAddress}
                      onChange={(e) => setServiceAddress(e.target.value)}
                      placeholder="Street address, city, state"
                      className={`field-underline ${
                        fieldErrors.serviceAddress ? 'has-error' : ''
                      }`}
                    />
                    {fieldErrors.serviceAddress && (
                      <p className="text-xs text-[#c81e1e] mt-1.5">
                        {fieldErrors.serviceAddress}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-end">
                  <div>
                    <label
                      htmlFor="serviceCategory"
                      className="block text-xs font-semibold uppercase tracking-wider text-[#303B43]/75 mb-1"
                    >
                      Service Scope
                    </label>
                    <select
                      id="serviceCategory"
                      name="serviceCategory"
                      value={serviceCategory}
                      onChange={(e) => setServiceCategory(e.target.value)}
                      className="field-underline cursor-pointer"
                    >
                      {PLUMBING_SERVICES.map((svc) => (
                        <option key={svc.id} value={svc.title}>
                          {svc.title}
                        </option>
                      ))}
                      <option value="General Plumbing Inquiry">
                        General Plumbing Inquiry
                      </option>
                    </select>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-[#303B43]/75 mb-2">
                      Preferred Contact Method *
                    </span>
                    <div className="flex items-center gap-6 py-2 border-b border-[#303B43]/28">
                      {(['phone', 'email', 'instagram'] as const).map((method) => (
                        <label
                          key={method}
                          className="inline-flex items-center gap-2 text-sm font-medium cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="preferredContact"
                            value={method}
                            checked={preferredContact === method}
                            onChange={() => setPreferredContact(method)}
                            className="accent-[#2457F5] w-4 h-4 cursor-pointer"
                          />
                          <span className="capitalize">{method}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="plumbingIssue"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#303B43]/75 mb-1"
                  >
                    Plumbing Issue or Project Details *
                  </label>
                  <textarea
                    id="plumbingIssue"
                    name="plumbingIssue"
                    rows={4}
                    required
                    value={plumbingIssue}
                    onChange={(e) => setPlumbingIssue(e.target.value)}
                    placeholder="Describe the piping, water heater, fixture, or leak details..."
                    className={`field-underline resize-y ${
                      fieldErrors.plumbingIssue ? 'has-error' : ''
                    }`}
                  />
                  {fieldErrors.plumbingIssue && (
                    <p className="text-xs text-[#c81e1e] mt-1.5">
                      {fieldErrors.plumbingIssue}
                    </p>
                  )}
                </div>

                {result && (
                  <div
                    role="status"
                    className={`py-4 border-t border-b flex items-start gap-3 ${
                      result.ok && result.delivered
                        ? 'border-[#18B9B0] text-[#303B43]'
                        : result.ok
                          ? 'border-[#F2C45C] text-[#303B43]'
                          : 'border-[#c81e1e] text-[#c81e1e]'
                    }`}
                  >
                    {result.ok ? (
                      <CheckCircle2
                        className={`w-5 h-5 shrink-0 mt-0.5 ${
                          result.delivered ? 'text-[#18B9B0]' : 'text-[#2457F5]'
                        }`}
                        aria-hidden="true"
                      />
                    ) : (
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
                    )}
                    <div className="text-sm leading-relaxed">
                      {result.referenceId && (
                        <p className="font-bold text-[#2457F5] mb-1 tabular-nums">
                          Reference ID: {result.referenceId}
                        </p>
                      )}
                      <p>{result.message}</p>
                    </div>
                  </div>
                )}

                <div className="pt-2 flex flex-wrap items-center justify-between gap-6">
                  <BorderlessCta
                    type="submit"
                    disabled={submitting}
                    label={submitting ? 'SENDING REQUEST...' : 'SUBMIT SERVICE REQUEST'}
                    tone="blue"
                    size="lg"
                  />

                  <span className="text-xs text-[#303B43]/60">
                    Protected by CSRF verification & server-side validation
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
