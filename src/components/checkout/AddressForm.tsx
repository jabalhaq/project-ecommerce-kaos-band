'use client';

import React, { useState, useEffect } from 'react';
import { getProvinces, getCities, getSubdistricts } from '@/app/actions/shipping';
import { MapPin } from 'lucide-react';

export default function AddressForm() {
  const [provinces, setProvinces] = useState<{ id: string; name: string }[]>([]);
  const [cities, setCities] = useState<{ id: string; name: string }[]>([]);
  const [subdistricts, setSubdistricts] = useState<{ id: string; name: string }[]>([]);

  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSubdistrict, setSelectedSubdistrict] = useState('');

  const [receiverName, setReceiverName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [postalCode, setPostalCode] = useState('');

  useEffect(() => {
    getProvinces().then((res) => {
      if (res.provinces) setProvinces(res.provinces);
    });
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      getCities(selectedProvince).then((res) => {
        if (res.cities) setCities(res.cities);
      });
      setSelectedCity('');
      setSubdistricts([]);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedCity) {
      getSubdistricts(selectedCity).then((res) => {
        if (res.subdistricts) setSubdistricts(res.subdistricts);
      });
      setSelectedSubdistrict('');
    }
  }, [selectedCity]);

  return (
    <div className="bg-zinc-900 border border-[#F4EBD9]/10 p-6 space-y-6">
      <div className="flex items-center gap-2 border-b border-[#F4EBD9]/10 pb-4">
        <MapPin className="h-5 w-5 text-[#D97706]" />
        <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#F4EBD9]">
          Shipping Address
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono uppercase text-[#F4EBD9]/60 mb-1.5">Receiver Name</label>
          <input
            type="text"
            value={receiverName}
            onChange={(e) => setReceiverName(e.target.value)}
            placeholder="Johnny Ramone"
            className="w-full bg-[#121212] border border-[#F4EBD9]/20 text-[#F4EBD9] p-3 text-xs focus:border-[#D97706] outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-mono uppercase text-[#F4EBD9]/60 mb-1.5">Phone Number</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+62 812 3456 7890"
            className="w-full bg-[#121212] border border-[#F4EBD9]/20 text-[#F4EBD9] p-3 text-xs focus:border-[#D97706] outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono uppercase text-[#F4EBD9]/60 mb-1.5">Street Address</label>
        <textarea
          rows={2}
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          placeholder="Jl. Vinyl Archive No. 666, Blok A"
          className="w-full bg-[#121212] border border-[#F4EBD9]/20 text-[#F4EBD9] p-3 text-xs focus:border-[#D97706] outline-none resize-none"
        />
      </div>

      {/* Cascading Selects */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Province */}
        <div>
          <label className="block text-xs font-mono uppercase text-[#F4EBD9]/60 mb-1.5">Province</label>
          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className="w-full bg-[#121212] border border-[#F4EBD9]/20 text-[#F4EBD9] p-3 text-xs focus:border-[#D97706] outline-none"
          >
            <option value="">Select Province</option>
            {provinces.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* City */}
        <div>
          <label className="block text-xs font-mono uppercase text-[#F4EBD9]/60 mb-1.5">City</label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            disabled={!selectedProvince}
            className="w-full bg-[#121212] border border-[#F4EBD9]/20 text-[#F4EBD9] p-3 text-xs focus:border-[#D97706] outline-none disabled:opacity-50"
          >
            <option value="">Select City</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Subdistrict */}
        <div>
          <label className="block text-xs font-mono uppercase text-[#F4EBD9]/60 mb-1.5">Subdistrict</label>
          <select
            value={selectedSubdistrict}
            onChange={(e) => setSelectedSubdistrict(e.target.value)}
            disabled={!selectedCity}
            className="w-full bg-[#121212] border border-[#F4EBD9]/20 text-[#F4EBD9] p-3 text-xs focus:border-[#D97706] outline-none disabled:opacity-50"
          >
            <option value="">Select Subdistrict</option>
            {subdistricts.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono uppercase text-[#F4EBD9]/60 mb-1.5">Postal Code</label>
        <input
          type="text"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          placeholder="12345"
          className="w-full sm:w-1/3 bg-[#121212] border border-[#F4EBD9]/20 text-[#F4EBD9] p-3 text-xs focus:border-[#D97706] outline-none"
        />
      </div>
    </div>
  );
}
