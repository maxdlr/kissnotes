export const formatDate = (d: Date | string) => {
    if (typeof d === "string") {
        return new Date(d).toLocaleDateString("fr-FR");
    }
    return d.toLocaleDateString();
}

export const getRelativeTime = (d?: Date | string) => {
    if (!d) return "";
    const date = typeof d === "string" ? new Date(d) : d;
    const diff = new Date().getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    let result = "";

    if (seconds < 60) {
        result =  `${seconds} second${seconds !== 1 ? "s" : ""}`;
    } else if (minutes < 60) {
        result = `${minutes} minute${minutes !== 1 ? "s" : ""}`;
    } else if (hours < 24) {
        result = `${hours} hour${hours !== 1 ? "s" : ""}`;
    } else if (days < 30) {
        result = `${days} day${days !== 1 ? "s" : ""}`;
    } else if (months < 12) {
        result = `${months} month${months !== 1 ? "s" : ""}`;
    } else {
        result = `${years} year${years !== 1 ? "s" : ""}`;
    }
    return `${result} ago`
}
