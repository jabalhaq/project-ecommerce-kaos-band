// src/app/actions/shipping.ts

'use server';

const BITESHIP_BASE = 'https://api.biteship.com/v1';

function biteshipHeaders() {
  return {
    Authorization: `Bearer ${process.env.BITESHIP_API_KEY}`,
    'Content-Type': 'application/json',
  };
}

// ── Provinces ─────────────────────────────────────────────────────────────────

export async function getProvinces() {
  try {
    const res = await fetch(`${BITESHIP_BASE}/maps/provinces?countries=ID`, {
      headers: biteshipHeaders(),
    });
    if (!res.ok) throw new Error(`Biteship HTTP ${res.status}`);
    const data = await res.json();
    return { provinces: data.maps as { id: string; name: string }[] };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    console.error('getProvinces error:', msg);
    return { error: msg };
  }
}

// ── Cities ────────────────────────────────────────────────────────────────────

export async function getCities(provinceId?: string) {
  try {
    const url = provinceId
      ? `${BITESHIP_BASE}/maps/cities?countries=ID&province_id=${provinceId}`
      : `${BITESHIP_BASE}/maps/cities?countries=ID`;
    const res = await fetch(url, { headers: biteshipHeaders() });
    if (!res.ok) throw new Error(`Biteship HTTP ${res.status}`);
    const data = await res.json();
    return { cities: data.maps as { id: string; name: string }[] };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    console.error('getCities error:', msg);
    return { error: msg };
  }
}

// ── Subdistricts ──────────────────────────────────────────────────────────────

export async function getSubdistricts(cityId?: string) {
  try {
    const url = cityId
      ? `${BITESHIP_BASE}/maps/districts?countries=ID&city_id=${cityId}`
      : `${BITESHIP_BASE}/maps/districts?countries=ID`;
    const res = await fetch(url, { headers: biteshipHeaders() });
    if (!res.ok) throw new Error(`Biteship HTTP ${res.status}`);
    const data = await res.json();
    return { subdistricts: data.maps as { id: string; name: string }[] };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    console.error('getSubdistricts error:', msg);
    return { error: msg };
  }
}

// ── Calculate shipping cost ───────────────────────────────────────────────────

export interface ShippingRate {
  courier_code: string;
  courier_name: string;
  service_code: string;
  service_name: string;
  price: number;
  min_day: number;
  max_day: number;
}

export async function calculateShippingCost({
  originSubdistrictId,
  destinationSubdistrictId,
  weightGrams,
  couriers,
}: {
  originSubdistrictId: string;
  destinationSubdistrictId: string;
  weightGrams: number;
  couriers?: string;
}) {
  try {
    const payload = {
      origin_latitude: undefined,
      origin_longitude: undefined,
      origin_postal_code: undefined,
      origin_district_id: originSubdistrictId,
      destination_district_id: destinationSubdistrictId,
      couriers: couriers ?? 'jne,jnt,sicepat,anteraja,gosend',
      items: [
        {
          name: 'Order Items',
          description: 'Vinyl Crate Products',
          value: 1,
          length: 30,
          width: 20,
          height: 5,
          weight: weightGrams,
          quantity: 1,
        },
      ],
    };
    const res = await fetch(`${BITESHIP_BASE}/rates/couriers`, {
      method: 'POST',
      headers: biteshipHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Biteship HTTP ${res.status}: ${body}`);
    }
    const data = await res.json();
    return { rates: data.pricing as ShippingRate[] };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    console.error('calculateShippingCost error:', msg);
    return { error: msg };
  }
}
