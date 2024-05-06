const Utils = () => {

    const formatPhoneNumber = input => {
        if (!input) return input;
        const numberInput = input.replace(/[^\d]/g, "");
        const numberInputLength = numberInput.length;

        if (numberInputLength < 4) {
            return numberInput;
        } else if (numberInputLength < 7) {
            return `(${numberInput.slice(0, 3)}) ${numberInput.slice(3)}`;
        } else if (numberInputLength < 11) {
            return `(${numberInput.slice(0, 2)}) ${numberInput.slice(2, 6)}-${numberInput.slice(6, 10)}`;
        } else {
            return `(${numberInput.slice(0, 2)}) ${numberInput.slice(2, 7)}-${numberInput.slice(7, 11)}`;
        }
    }

    const getActivityLevel = (value) => {
        switch (value) {
            case 0.2:
                return 'No sport/exercise';
            case 0.375:
                return 'Light activity (sport 1-3 times per week)';
            case 0.55:
                return 'Moderate activity (sport 3-5 times per week)';
            case 0.725:
                return 'High activity (everyday exercise)';
            case 0.9:
                return 'Extreme activity (professional athlete)';
            default:
                return '';
        }
    }

    function getStartOfWeek(date) {

        // Copy date if provided, or use current date if not
        date = date ? new Date(+date) : new Date();
        date.setHours(0, 0, 0, 0);

        // Set date to previous Sunday
        date.setDate(date.getDate() - date.getDay());
        return date;
    }

    function getEndOfWeek(date) {
        date = getStartOfWeek(date);
        date.setDate(date.getDate() + 6);

        return date;
    }

    function getWeek(date) {
        date = getStartOfWeek(date);
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }

    // return number of days between two dates
    function dateDiffInDays(a, b) {
        const _MS_PER_DAY = 1000 * 60 * 60 * 24;

        // Discard the time and time-zone information.
        const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
        const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

        return Math.floor((utc2 - utc1) / _MS_PER_DAY);
    }

    return {
        formatPhoneNumber: formatPhoneNumber,
        getActivityLevel: getActivityLevel,
        getStartOfWeek: getStartOfWeek,
        getEndOfWeek: getEndOfWeek,
        getWeek: getWeek,
        dateDiffInDays: dateDiffInDays
    }
}
export default Utils