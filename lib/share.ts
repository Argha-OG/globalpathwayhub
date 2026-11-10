/**
 * Utility to format and copy university / course details for WhatsApp,
 * Telegram, Messenger, or any other messaging app.
 */

export function generateCourseShareText(course: any, customUrl?: string): string {
    if (!course) return '';
    const uni = typeof course.university === 'object' && course.university ? course.university : {};
    const uniName = uni.name || 'Partner Institution';
    const location = [uni.city, uni.state, uni.location, uni.country]
        .filter(Boolean)
        .filter((v, i, a) => a.indexOf(v) === i)
        .join(', ');

    const baseUrl =
        typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost')
            ? window.location.origin
            : 'https://globalpathwayhub.com';

    const url =
        customUrl ||
        `${baseUrl}/courses/${encodeURIComponent(course._id || course.id)}`;

    const lines = [
        `🎓 *${course.name}*`,
        `🏛️ *University:* ${uniName}`,
    ];

    if (location) {
        lines.push(`📍 *Location:* ${location}`);
    }
    if (course.level) {
        lines.push(`📜 *Degree Level:* ${course.level}`);
    }
    if (course.duration) {
        lines.push(`⏱️ *Duration:* ${course.duration}`);
    }
    if (course.tuitionFee) {
        lines.push(`💰 *Tuition / Costing:* ${course.tuitionFee}`);
    }

    if (course.description) {
        lines.push('');
        lines.push(`📝 *Program Overview:*`);
        lines.push(course.description);
    }

    lines.push('');
    if (uni.website) {
        lines.push(`🌐 *Official Website:* ${uni.website}`);
    }
    if (url) {
        lines.push(`🔗 *View Details & Apply Online:*`);
        lines.push(url);
    }

    lines.push('');
    lines.push(`✨ *GlobalPathwayHub Education Advisory*`);
    lines.push(`Contact our education counselors for admission, scholarships, and visa filing!`);

    return lines.join('\n');
}

export function generateUniversityShareText(uni: any, customUrl?: string): string {
    if (!uni) return '';
    const details = uni.details || {};
    const tuition = details.tuition || details.tuition_out_of_state;
    const location = [details.city, details.state, uni.location, uni.country]
        .filter(Boolean)
        .filter((v, i, a) => a.indexOf(v) === i)
        .join(', ');

    const baseUrl =
        typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost')
            ? window.location.origin
            : 'https://globalpathwayhub.com';

    const url =
        customUrl ||
        `${baseUrl}/universities/${encodeURIComponent(uni._id || uni.id || uni.name)}`;

    const lines = [
        `🏛️ *${uni.name}*`,
    ];

    if (location) {
        lines.push(`📍 *Location:* ${location}`);
    }
    if (details.level) {
        lines.push(`🎓 *Level:* ${details.level.replace(/_/g, ' ')}`);
    }
    if (details.control || details.institution_type) {
        lines.push(`🏢 *Institution:* ${details.institution_type || details.control}`);
    }
    if (tuition) {
        lines.push(`💰 *Estimated Tuition:* $${Number(tuition).toLocaleString()}/year`);
    }
    if (details.student_faculty_ratio) {
        lines.push(`👨‍🏫 *Faculty Ratio:* ${details.student_faculty_ratio}:1`);
    }
    if (details.enrollment) {
        lines.push(`👥 *Enrolled Students:* ${Number(details.enrollment).toLocaleString()}`);
    }
    if (details.degree_types && details.degree_types.length > 0) {
        lines.push(`📚 *Degrees Offered:* ${details.degree_types.slice(0, 6).join(', ')}`);
    }

    if (uni.description) {
        lines.push('');
        lines.push(`📝 *About:*`);
        lines.push(uni.description);
    }

    lines.push('');
    if (uni.website) {
        lines.push(`🌐 *Official Website:* ${uni.website}`);
    }
    if (url) {
        lines.push(`🔗 *Explore University Profile & Programs:*`);
        lines.push(url);
    }

    lines.push('');
    lines.push(`✨ *GlobalPathwayHub Education Advisory*`);
    lines.push(`Contact our counselors for direct guidance and admission support!`);

    return lines.join('\n');
}

/**
 * Copies text to clipboard with fallback for non-secure or restricted contexts.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        }
    } catch {
        // Fallback below
    }

    try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        return success;
    } catch (err) {
        console.error('Clipboard copy failed:', err);
        return false;
    }
}

