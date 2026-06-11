import type { UserProfile } from '@/modules/users/types/user.types';

export const staticUsers: UserProfile[] = [
  {
    name: 'Sarah Hudson',
    email: 'sarah.h@auction.com',
    role: 'client',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC52XPX68f7szipt695KhrDJcnIhxiHn0yR4ZoBwVs-3gBxPlSBfgYyK1Ndjgj3Ab9sr6McYjjpoIomk14ByO6O7NQUBj4mD-nf7at2S0a-l0q9ZNbvRp8wtwBCIGYxnJnnBouDrRKkqy6J-QYf_IGa6b8Th3fnxP8PVmCHtj2m_evcHpIqgHzdCNGmQPIfCTpWhHmZuNS8iQZBgjyNNvXY0vztyxP0o2GNwVSSBKBHFQyYLTtEhYbx1tv8d4DPgGgv583VbykPoOOW',
    auctionsCount: 42,
    status: 'Verified'
  },
  {
    name: 'Michael Kross',
    email: 'm.kross@webmail.com',
    role: 'client',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANk-3Dtzd_hBhyD3kvCRaGu6eCFoQE1rqQPlo9tgPgAuMlATODs8ahLtUWJehu1hfG50cVlzVHkskxx79idFectDVOzT4VtlnC3YwTLXl_gjKE47tuROxNEMRW_i0-vSzlvbKHUsGr7_YSGN38cnSRqTMy_xM1PS0Z5itE2zcCvE04UrjKo9n5sYfo0eWMBcLqmiclF5ivtkhZqd8ObhJ9wxaJZeO7WkgxKmv--dxvVrB9YJgj8-HZt7D9Bly8R8rKaJA69JU_pcqI',
    auctionsCount: 12,
    status: 'Standard'
  },
  {
    name: 'James Dorian',
    email: 'james.d@net.org',
    role: 'client',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-FZYdAHGcqZmXnUsJ-T0J4bsjT3-O48-ZFkAk-LxSZfbf6Qhe76nbqP4pcNWMX6XTPJCjcTUezXQekixvNL1cyeib9ifXcYIlD37NdtCZpXv9o7uiablTaDiGckDNIb55Muuxgd82A_5zg9iQs-u0XaPEFpalQuATbzv387h3YwhVmIIPFUEiAMwVKfbIdtG7v-d-I3PbZMp_q5TTNFErgWbVEy6yCZuhR8_QFZB_OtMd4k_rneZvwj7IQs2SUGZX1oFY_jEHt2cI',
    auctionsCount: 0,
    status: 'Flagged'
  },
  {
    name: 'Linda Wright',
    email: 'linda.w@corp.com',
    role: 'client',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANk-3Dtzd_hBhyD3kvCRaGu6eCFoQE1rqQPlo9tgPgAuMlATODs8ahLtUWJehu1hfG50cVlzVHkskxx79idFectDVOzT4VtlnC3YwTLXl_gjKE47tuROxNEMRW_i0-vSzlvbKHUsGr7_YSGN38cnSRqTMy_xM1PS0Z5itE2zcCvE04UrjKo9n5sYfo0eWMBcLqmiclF5ivtkhZqd8ObhJ9wxaJZeO7WkgxKmv--dxvVrB9YJgj8-HZt7D9Bly8R8rKaJA69JU_pcqI',
    auctionsCount: 156,
    status: 'Verified'
  }
];
