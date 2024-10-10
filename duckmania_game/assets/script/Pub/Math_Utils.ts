import { Pos_Like } from "../Data/Data_Common";

export class Math_Utils {
    public static get_distance(p1: Pos_Like, p2: Pos_Like) {
        if (!p1 || !p2) return Number.POSITIVE_INFINITY;
        return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y))
    }
}