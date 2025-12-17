/**
 * Utilities fonctions pour les dates et les heures
 */

export function formatDate(date: string | Date, locale = 'fr-FR', options = {}) {
    if (!date) return 'N/A';

    const defaultOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        ...options
    };

    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;

        // Verifie si la date est valide
        if (isNaN(dateObj.getTime())) {
            return 'Date invalide';
        }

        return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj);
    } catch (error) {
        console.error('Erreur lors du formatage de la date:', error);
        return 'N/A';
    }
}

export function formatDateTime(date: string | Date, locale = 'fr-FR') {
    return formatDate(date, locale, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

export function formatDuration(milliseconds: number) {
    if (isNaN(milliseconds)) return 'N/A';

    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const remainingHours = hours % 24;
    const remainingMinutes = minutes % 60;
    const remainingSeconds = seconds % 60;

    const parts = [];

    if (days > 0) parts.push(`${days} jour${days !== 1 ? 's' : ''}`);
    if (remainingHours > 0) parts.push(`${remainingHours} heure${remainingHours !== 1 ? 's' : ''}`);
    if (remainingMinutes > 0) parts.push(`${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`);
    if (remainingSeconds > 0 && parts.length === 0) {
        parts.push(`${remainingSeconds} seconde${remainingSeconds !== 1 ? 's' : ''}`);
    }

    return parts.join(' ') || '0 seconde';
}

export function formatRelativeTime(date: string | Date, locale = 'fr-FR') {
    if (!date) return 'N/A';

    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;

        if (isNaN(dateObj.getTime())) {
            return 'Date invalide';
        }

        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

        // Formate le temps relatif
        const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

        if (diffInSeconds < 60) {
            return rtf.format(-diffInSeconds, 'second');
        }

        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) {
            return rtf.format(-diffInMinutes, 'minute');
        }

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) {
            return rtf.format(-diffInHours, 'hour');
        }

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 30) {
            return rtf.format(-diffInDays, 'day');
        }

        const diffInMonths = Math.floor(diffInDays / 30);
        if (diffInMonths < 12) {
            return rtf.format(-diffInMonths, 'month');
        }

        const diffInYears = Math.floor(diffInMonths / 12);
        return rtf.format(-diffInYears, 'year');
    } catch (error) {
        console.error('Erreur lors du formatage du temps relatif:', error);
        return 'N/A';
    }
}

export function isSameDay(date1: string | Date, date2: string | Date) {
    if (!date1 || !date2) return false;

    const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
    const d2 = typeof date2 === 'string' ? new Date(date2) : date2;

    return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
    );
}

export function startOfDay(date: string | Date) {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
}

export function endOfDay(date: string | Date) {
    const newDate = new Date(date);
    newDate.setHours(23, 59, 59, 999);
    return newDate;
}