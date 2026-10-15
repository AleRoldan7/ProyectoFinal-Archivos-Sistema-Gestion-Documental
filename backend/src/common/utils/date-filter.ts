export function dateFilter(from?: string, to?: string): Record<string, unknown> {

    if (!from && !to) return {};

    const range: { $gte?: Date; $lte?: Date } = {}

    if (from) range.$gte = new Date(from);
    if (to) {
        const hasta = new Date(to);
        if (to.length === 10) hasta.setUTCHours(23, 59, 59, 999);
        range.$lte = hasta;
    }
    return { createdAt: range };
}