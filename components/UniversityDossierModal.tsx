'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    FaGraduationCap,
    FaLocationDot,
    FaGlobe,
    FaPhone,
    FaDollarSign,
    FaUsers,
    FaBuildingColumns,
    FaLandmark,
    FaAward,
    FaCircleCheck,
    FaCircleXmark,
    FaClock,
    FaCompass,
    FaBookOpen,
    FaArrowUpRightFromSquare,
    FaPaperPlane,
    FaXmark,
    FaEnvelope,
    FaShareNodes,
    FaCode,
    FaListUl,
    FaChevronDown,
    FaChevronUp,
    FaCopy,
    FaCheck,
    FaWhatsapp,
} from 'react-icons/fa6';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { generateUniversityShareText, copyToClipboard } from '@/lib/share';

export interface UniversityDossierModalProps {
    isOpen: boolean;
    onClose: () => void;
    university: any | null;
}

export default function UniversityDossierModal({
    isOpen,
    onClose,
    university,
}: UniversityDossierModalProps) {
    const [showAllAliases, setShowAllAliases] = useState(false);
    const [showAllAttributes, setShowAllAttributes] = useState(false);
    const [showRawJson, setShowRawJson] = useState(false);
    const [copiedJson, setCopiedJson] = useState(false);
    const [copiedShare, setCopiedShare] = useState(false);

    if (!isOpen || !university) return null;

    // Normalize direct API-Ninjas response vs Database entity with `details`
    const d = university.details || {};
    const name = university.name || d.name || 'Unknown University';
    const country = university.country || d.country || '';
    const countryCode = university.country_code || d.country_code || '';
    const city = university.city || d.city || '';
    const state = university.state || d.state || '';
    const regionCode = university.region_code || d.region_code || '';
    const county = university.county || d.county || '';
    const address = university.address || d.address || '';
    const postalCode = university.postal_code || d.postal_code || '';
    const fullLocation =
        university.location ||
        [address, city, state, postalCode, country].filter(Boolean).join(', ') ||
        'Campus Location Available Upon Consultation';

    const phone = university.phone || d.phone || '';
    const website = university.website || d.website || '';
    const domains = university.domains || d.domains || [];
    const aliases = university.aliases || d.aliases || [];
    const degreeTypes = university.degree_types || d.degree_types || [];

    const founded = university.founded || d.founded || null;
    const level = university.level || d.level || 'Higher Education Institution';
    const control = university.control || d.control || '';
    const institutionType = university.institution_type || d.institution_type || control || '';
    const status = university.status || d.status || 'active';
    const recognition = university.recognition || d.recognition || '';
    const years = university.years || d.years || '';

    const enrollment = university.enrollment || d.enrollment || null;
    const enrollmentYear = university.enrollment_year || d.enrollment_year || '';
    const studentFacultyRatio = university.student_faculty_ratio || d.student_faculty_ratio || '';

    const tuition = university.tuition || d.tuition || null;
    const tuitionInState = university.tuition_in_state || d.tuition_in_state || null;
    const tuitionOutState = university.tuition_out_of_state || d.tuition_out_of_state || null;

    const researchOutput = university.research_output || d.research_output || null;
    const timezone = university.timezone || d.timezone || '';
    const timezoneIana = university.timezone_iana || d.timezone_iana || '';
    const latitude = university.latitude || d.latitude || null;
    const longitude = university.longitude || d.longitude || null;

    const rorId = university.ror_id || d.ror_id || '';
    const wikidataId = university.wikidata_id || d.wikidata_id || '';
    const apiId = university.id || d.id || '';

    // Merge all raw keys for the all-data inspector
    const rawData = { ...d, ...(typeof university === 'object' ? university : {}) };
    delete rawData.details;

    const googleMapsUrl =
        latitude && longitude
            ? `https://www.google.com/maps?q=${latitude},${longitude}`
            : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' ' + (city || country))}`;

    const handleShare = async () => {
        const text = generateUniversityShareText(university);
        const ok = await copyToClipboard(text);
        if (ok) {
            setCopiedShare(true);
            toast.success('University details copied! Ready to paste into WhatsApp.');
            setTimeout(() => setCopiedShare(false), 2500);
        } else {
            toast.error('Failed to copy to clipboard');
        }
    };

    const handleWhatsAppShare = () => {
        const text = generateUniversityShareText(university);
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    };

    const handleCopyJson = () => {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(JSON.stringify(rawData, null, 2));
            setCopiedJson(true);
            setTimeout(() => setCopiedJson(false), 2000);
        }
    };

    const allFieldAttributes = [
        { key: 'name', label: 'Institution Name', value: name, group: 'Identification' },
        { key: 'id', label: 'API Registry ID', value: apiId ? `#${apiId}` : null, group: 'Identification' },
        { key: 'status', label: 'Operational Status', value: status, group: 'Classification' },
        { key: 'recognition', label: 'National Registry Recognition', value: recognition, group: 'Classification' },
        { key: 'level', label: 'Institutional Level', value: level, group: 'Classification' },
        { key: 'control', label: 'Control / Sector Code', value: control, group: 'Classification' },
        { key: 'institution_type', label: 'Institution Type (Detailed)', value: institutionType, group: 'Classification' },
        { key: 'founded', label: 'Year Founded', value: founded, group: 'Historical' },
        { key: 'years', label: 'Standard Program Length', value: years, group: 'Academic' },
        { key: 'degree_types', label: 'Degree Types Offered', value: degreeTypes?.join(', '), group: 'Academic' },
        { key: 'student_faculty_ratio', label: 'Student-to-Faculty Ratio', value: studentFacultyRatio, group: 'Academic' },
        { key: 'research_output', label: 'Total Research Output / Papers', value: researchOutput ? Number(researchOutput).toLocaleString() : null, group: 'Academic' },
        { key: 'tuition', label: 'Published Annual Tuition (USD)', value: tuition ? `$${Number(tuition).toLocaleString()}` : null, group: 'Financial' },
        { key: 'tuition_in_state', label: 'In-State Tuition (USD)', value: tuitionInState ? `$${Number(tuitionInState).toLocaleString()}` : null, group: 'Financial' },
        { key: 'tuition_out_of_state', label: 'Out-of-State / International Tuition (USD)', value: tuitionOutState ? `$${Number(tuitionOutState).toLocaleString()}` : null, group: 'Financial' },
        { key: 'enrollment', label: 'Total Enrolled Students', value: enrollment ? Number(enrollment).toLocaleString() : null, group: 'Demographics' },
        { key: 'enrollment_year', label: 'Census Enrollment Year', value: enrollmentYear, group: 'Demographics' },
        { key: 'address', label: 'Physical Campus Address', value: address, group: 'Geographic & Contact' },
        { key: 'city', label: 'City', value: city, group: 'Geographic & Contact' },
        { key: 'state', label: 'State / Province', value: state, group: 'Geographic & Contact' },
        { key: 'region_code', label: 'State / Region Code', value: regionCode, group: 'Geographic & Contact' },
        { key: 'county', label: 'County / Municipality', value: county, group: 'Geographic & Contact' },
        { key: 'postal_code', label: 'Postal / ZIP Code', value: postalCode, group: 'Geographic & Contact' },
        { key: 'country', label: 'Country', value: country, group: 'Geographic & Contact' },
        { key: 'country_code', label: 'ISO Country Code', value: countryCode, group: 'Geographic & Contact' },
        { key: 'timezone', label: 'Standard Timezone', value: timezone, group: 'Geographic & Contact' },
        { key: 'timezone_iana', label: 'IANA Timezone Identifier', value: timezoneIana, group: 'Geographic & Contact' },
        { key: 'latitude', label: 'GPS Latitude', value: latitude, group: 'Geographic & Contact' },
        { key: 'longitude', label: 'GPS Longitude', value: longitude, group: 'Geographic & Contact' },
        { key: 'phone', label: 'Admissions Contact Phone', value: phone, group: 'Geographic & Contact' },
        { key: 'website', label: 'Official Web Portal', value: website, group: 'Geographic & Contact' },
        { key: 'domains', label: 'Email Domains', value: domains?.join(', '), group: 'Geographic & Contact' },
        { key: 'aliases', label: 'Aliases & Associated Units', value: aliases?.join(', '), group: 'Identification' },
        { key: 'ror_id', label: 'ROR ID (Research Organization Registry)', value: rorId, group: 'Registry Identifiers' },
        { key: 'wikidata_id', label: 'Wikidata Identifier', value: wikidataId, group: 'Registry Identifiers' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal Dialog Content */}
            <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden z-10 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
                {/* Header Banner */}
                <div className="relative bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-800 text-white p-6 sm:p-8 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors focus:outline-none"
                        aria-label="Close modal"
                    >
                        <FaXmark className="h-4 w-4" />
                    </button>

                    <div className="flex flex-wrap items-center gap-2 mb-3">
                        {status && (
                            <span
                                className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                                    status.toLowerCase() === 'active'
                                        ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/30'
                                        : 'bg-rose-500/20 text-rose-200 border border-rose-400/30'
                                }`}
                            >
                                {status.toLowerCase() === 'active' ? (
                                    <FaCircleCheck className="h-3 w-3 text-emerald-400" />
                                ) : (
                                    <FaCircleXmark className="h-3 w-3 text-rose-400" />
                                )}
                                {status} Status
                            </span>
                        )}

                        {recognition && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-200 border border-amber-300/30">
                                <FaAward className="h-3 w-3 text-amber-300" />
                                Nationally {recognition}
                            </span>
                        )}

                        {level && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-white/15 text-white border border-white/20 capitalize">
                                <FaBuildingColumns className="h-3 w-3" />
                                {level.replace(/_/g, ' ')}
                            </span>
                        )}

                        {institutionType && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-medium bg-white/10 text-slate-200 capitalize">
                                {institutionType.replace(/_/g, ' ')}
                            </span>
                        )}

                        {apiId && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-white/10 text-blue-200">
                                ID #{apiId}
                            </span>
                        )}
                    </div>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
                        {name}
                    </h2>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-blue-100">
                        <span className="inline-flex items-center gap-1.5">
                            <FaLocationDot className="h-3.5 w-3.5 text-blue-300" />
                            {[city, state, regionCode, country].filter(Boolean).join(', ') || country}
                            {countryCode && <span className="opacity-75">({countryCode})</span>}
                        </span>

                        {founded && (
                            <span className="inline-flex items-center gap-1.5">
                                <FaLandmark className="h-3.5 w-3.5 text-blue-300" />
                                Founded {founded} ({new Date().getFullYear() - Number(founded)} yrs established)
                            </span>
                        )}
                    </div>

                    {/* Alternate Names / Aliases */}
                    {aliases && aliases.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-white/15 text-xs text-blue-100/90">
                            <div className="flex flex-wrap items-center gap-1.5">
                                <span className="font-semibold text-white/90">Aliases & Schools ({aliases.length}):</span>
                                {(showAllAliases ? aliases : aliases.slice(0, 5)).map((alias: string, i: number) => (
                                    <span key={i} className="px-2 py-0.5 rounded-md bg-white/10 text-[11px]">
                                        {alias}
                                    </span>
                                ))}
                                {aliases.length > 5 && (
                                    <button
                                        type="button"
                                        onClick={() => setShowAllAliases(!showAllAliases)}
                                        className="text-[11px] font-bold text-amber-300 hover:text-amber-200 underline ml-1 cursor-pointer"
                                    >
                                        {showAllAliases ? 'Show less' : `+${aliases.length - 5} more`}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Scrollable Body Container */}
                <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1 text-slate-800">
                    {/* Primary Key Performance Indicators Ribbon */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                        {/* Tuition Card */}
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
                            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                <FaDollarSign className="h-3 w-3 text-emerald-600" />
                                Annual Tuition
                            </span>
                            <div className="mt-2">
                                <span className="text-xl sm:text-2xl font-black text-slate-900">
                                    {tuition ? `$${Number(tuition).toLocaleString()}` : 'Contact Agency'}
                                </span>
                                {tuition && <span className="text-[10px] text-slate-500 block">/ academic year</span>}
                            </div>
                        </div>

                        {/* Enrollment Card */}
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
                            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                <FaUsers className="h-3 w-3 text-blue-600" />
                                Total Enrollment
                            </span>
                            <div className="mt-2">
                                <span className="text-xl sm:text-2xl font-black text-slate-900">
                                    {enrollment ? Number(enrollment).toLocaleString() : 'N/A'}
                                </span>
                                {enrollmentYear && (
                                    <span className="text-[10px] text-slate-500 block">Census {enrollmentYear}</span>
                                )}
                            </div>
                        </div>

                        {/* Student to Faculty Ratio */}
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
                            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                <FaGraduationCap className="h-3 w-3 text-indigo-600" />
                                Student / Faculty
                            </span>
                            <div className="mt-2">
                                <span className="text-xl sm:text-2xl font-black text-slate-900">
                                    {studentFacultyRatio ? studentFacultyRatio : 'Standard'}
                                </span>
                                <span className="text-[10px] text-slate-500 block">Mentorship Ratio</span>
                            </div>
                        </div>

                        {/* Research Output Card */}
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
                            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                <FaBookOpen className="h-3 w-3 text-purple-600" />
                                Research Output
                            </span>
                            <div className="mt-2">
                                <span className="text-xl sm:text-2xl font-black text-slate-900">
                                    {researchOutput
                                        ? Number(researchOutput) > 1000000
                                            ? `${(Number(researchOutput) / 1000000).toFixed(2)}M`
                                            : Number(researchOutput).toLocaleString()
                                        : 'Active'}
                                </span>
                                <span className="text-[10px] text-slate-500 block">Citations & Papers</span>
                            </div>
                        </div>

                        {/* Academic Duration Card */}
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between col-span-2 sm:col-span-1">
                            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                <FaClock className="h-3 w-3 text-amber-600" />
                                Typical Length
                            </span>
                            <div className="mt-2">
                                <span className="text-xl sm:text-2xl font-black text-slate-900">
                                    {years || '3-4 Years'}
                                </span>
                                <span className="text-[10px] text-slate-500 block">Degree Completion</span>
                            </div>
                        </div>
                    </div>

                    {/* In-State vs Out-of-State Tuition breakdown */}
                    {(tuitionInState || tuitionOutState) && (
                        <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/70 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div className="text-xs">
                                <span className="font-bold text-slate-800">Tuition Breakdown: </span>
                                <span className="text-slate-600">Published official annual tuition rates:</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
                                {tuitionInState && (
                                    <span className="text-slate-700">
                                        In-State: <strong className="text-slate-900">${Number(tuitionInState).toLocaleString()}</strong>
                                    </span>
                                )}
                                {tuitionOutState && (
                                    <span className="text-blue-700 bg-white px-2.5 py-1 rounded-lg border border-blue-200">
                                        International / Out-of-State: <strong className="text-blue-900">${Number(tuitionOutState).toLocaleString()}</strong>
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Degree Types & Programs Offered */}
                    {degreeTypes && degreeTypes.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                <FaGraduationCap className="h-4 w-4 text-blue-600" />
                                Available Degree Levels & Programs ({degreeTypes.length})
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                {degreeTypes.map((deg: string, idx: number) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs font-medium text-slate-800 hover:border-blue-300 transition-colors"
                                    >
                                        <div className="h-6 w-6 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 text-[10px]">
                                            ✓
                                        </div>
                                        <span>{deg}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Campus Geographic & Coordinates Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Physical Address & Location */}
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                                <FaLocationDot className="h-4 w-4 text-red-500" />
                                Campus Location & Coordinates
                            </h4>

                            <div className="space-y-1.5 text-xs text-slate-600">
                                {address && (
                                    <p className="font-semibold text-slate-800">
                                        Street Address: <span className="font-normal">{address}</span>
                                    </p>
                                )}
                                <p>
                                    City & State:{' '}
                                    <span className="font-semibold text-slate-800">
                                        {[city, state, postalCode].filter(Boolean).join(', ') || city || 'Campus'}
                                    </span>
                                </p>
                                {regionCode && <p>State / Region Code: <strong className="text-slate-800">{regionCode}</strong></p>}
                                {county && <p>County / Municipality: {county}</p>}
                                <p>
                                    Country:{' '}
                                    <strong className="text-slate-800">
                                        {country} {countryCode ? `(${countryCode})` : ''}
                                    </strong>
                                </p>
                                {(timezone || timezoneIana) && (
                                    <p className="flex items-center gap-1.5 pt-1 text-[11px] text-slate-500">
                                        <FaClock className="h-3 w-3 text-slate-400" />
                                        Timezone: {timezoneIana || timezone} {timezone && `(${timezone})`}
                                    </p>
                                )}
                                {latitude && longitude && (
                                    <p className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                                        <FaCompass className="h-3 w-3 text-slate-400" />
                                        GPS: {latitude}, {longitude}
                                    </p>
                                )}
                            </div>

                            <a
                                href={googleMapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-800 pt-1"
                            >
                                <FaArrowUpRightFromSquare className="h-3 w-3" />
                                Open in Google Maps & View Satellite Campus
                            </a>
                        </div>

                        {/* Contact & Official Verification */}
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                                <FaGlobe className="h-4 w-4 text-blue-600" />
                                Official Contact & Domains
                            </h4>

                            <div className="space-y-2 text-xs text-slate-600">
                                {website ? (
                                    <div>
                                        <span className="block text-[11px] text-slate-500">Official Web Portal:</span>
                                        <a
                                            href={website.startsWith('http') ? website : `https://${website}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-bold text-blue-600 hover:underline break-all inline-flex items-center gap-1"
                                        >
                                            {website}
                                            <FaArrowUpRightFromSquare className="h-2.5 w-2.5" />
                                        </a>
                                    </div>
                                ) : (
                                    <p className="text-slate-500 italic">No public web portal recorded</p>
                                )}

                                {phone && (
                                    <div>
                                        <span className="block text-[11px] text-slate-500">Admissions Phone:</span>
                                        <a
                                            href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                                            className="font-semibold text-slate-800 hover:text-primary inline-flex items-center gap-1.5"
                                        >
                                            <FaPhone className="h-3 w-3 text-emerald-600" />
                                            {phone}
                                        </a>
                                    </div>
                                )}

                                {domains && domains.length > 0 && (
                                    <div>
                                        <span className="block text-[11px] text-slate-500">Verified Email Domains:</span>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {domains.map((dom: string, i: number) => (
                                                <span
                                                    key={i}
                                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] font-mono text-slate-700"
                                                >
                                                    <FaEnvelope className="h-2.5 w-2.5 text-slate-400" />
                                                    @{dom}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Registry IDs */}
                                <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                                    {rorId && (
                                        <a
                                            href={`https://ror.org/${rorId}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-blue-600 underline"
                                        >
                                            ROR ID: {rorId}
                                        </a>
                                    )}
                                    {wikidataId && (
                                        <a
                                            href={`https://www.wikidata.org/wiki/${wikidataId}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-blue-600 underline"
                                        >
                                            Wikidata: {wikidataId}
                                        </a>
                                    )}
                                    {apiId && <span>Registry ID: #{apiId}</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Action Bar */}
                <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200/80 flex flex-col sm:flex-row justify-between items-center gap-3 flex-shrink-0">
                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                        <Button
                            type="button"
                            size="sm"
                            onClick={handleShare}
                            className={`text-xs font-bold rounded-xl h-9 gap-1.5 ${
                                copiedShare
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                            }`}
                        >
                            {copiedShare ? <FaCheck className="h-3 w-3 text-white" /> : <FaCopy className="h-3 w-3" />}
                            {copiedShare ? 'Copied for WhatsApp!' : 'Copy for WhatsApp'}
                        </Button>

                        <Button
                            type="button"
                            size="sm"
                            onClick={handleWhatsAppShare}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl h-9 gap-1.5 shadow-xs"
                        >
                            <FaWhatsapp className="h-3.5 w-3.5" />
                            Share on WhatsApp
                        </Button>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 sm:flex-none border-slate-300 text-xs text-slate-700 rounded-xl"
                        >
                            Close Dossier
                        </Button>

                        <Link
                            href={`/apply/${encodeURIComponent(name)}`}
                            className="flex-1 sm:flex-none"
                        >
                            <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm px-6 rounded-xl h-9">
                                <FaPaperPlane className="h-3.5 w-3.5" />
                                Apply to this University
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
