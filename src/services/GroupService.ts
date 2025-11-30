import type GroupType from "../types/group";
import { get } from "./request";

class GroupService {
    static async getGroups(): Promise<GroupType[]> {
        const data = await get('/groups')
        const groups: GroupType[] = data.map((group: any) => {
            return {
                id: group.id,
                title: group.Title,
                students: []
            }
        });
        return groups
    }

    static async getGroup(groupID: number): Promise<GroupType> {
        const group = await get(`/groups/${groupID}`)
        return {
            id: group.id,
            title: group.Title,
            students: []
        }
    }
}

export default GroupService