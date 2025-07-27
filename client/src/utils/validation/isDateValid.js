const isDateValid = (dateString) => {
    if (!dateString) return false;

    const selectedYear = new Date(dateString).getFullYear();
    const currentYear = new Date().getFullYear();

    return selectedYear >= currentYear && selectedYear <= 2099;
};

export { isDateValid };
