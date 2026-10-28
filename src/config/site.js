// Central place for business details. Anything left empty is simply not rendered,
// so the site never displays placeholder or invented contact information.
// Fill these in only with details supplied by the client.
export const SITE = {
  name: 'RG PRIME AUTO FINANCE',
  contact: {
    phone: '',
    email: '',
    address: '',
    hours: '',
  },
  // Lead form destination. When empty, the consultation form runs in DEMO mode:
  // it validates input and shows a success state, but sends nothing anywhere.
  // Set VITE_LEAD_ENDPOINT in a .env file to POST submissions as JSON.
  leadEndpoint: import.meta.env.VITE_LEAD_ENDPOINT || '',
}

export const NAV_LINKS = [
  { id: 'services', label: 'Services' },
  { id: 'journey', label: 'How it works' },
  { id: 'estimate', label: 'Estimator' },
  { id: 'faq', label: 'FAQ' },
]
