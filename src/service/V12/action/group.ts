import { V12 } from "../index";

export class GroupAction {
    /**
     * 发送群聊消息
     * @param group_id {number} 群id
     * @param message {V12.Sendable} 消息
     * @param source {source} 引用消息id
     */
    async sendGroupMsg(
        this: V12,
        group_id: string,
        message: V12.Sendable,
        source?: string,
    ): Promise<V12.MessageRet> {
        return this.adapter.call(this.oneBot.uin, "V12", "sendGroupMessage", [
            group_id,
            message,
            source,
        ]);
    }

    /**
     * 群组踢人
     * @param group_id {number} 群id
     * @param user_id {number} 成员id
     * @param reject_add_request {boolean} 是否禁止此人加群请求
     */
    setGroupKick(this: V12, group_id: string, user_id: string, reject_add_request?: boolean) {
        return this.adapter.call(this.oneBot.uin, "V12", "setGroupKick", [
            group_id,
            user_id,
            reject_add_request,
        ]);
    }

    /**
     * 设置群精华
     * @param message_id
     */
    setEssenceMessage(this: V12, message_id: string) {
        return this.adapter.call(this.oneBot.uin, "V12", "setEssenceMessage", [message_id]);
    }

    /**
     * 移除群精华
     * @param message_id
     */
    removeEssenceMessage(this: V12, message_id: string) {
        return this.adapter.call(this.oneBot.uin, "V12", "removeEssenceMessage", [message_id]);
    }
    /**
     * 群打卡
     * @param group_id 群id
     */
    sendGroupSign(this: V12, group_id: string) {
        return this.adapter.call(this.oneBot.uin, "V12", "sendGroupSign", [group_id]);
    }

    /**
     * 群禁言指定人
     * @param group_id {number} 群id
     * @param user_id {number} 成员id
     * @param duration {number} 禁言时长(单位：秒)
     */
    setGroupBan(this: V12, group_id: string, user_id: string, duration: number = 1800) {
        return this.adapter.call(this.oneBot.uin, "V12", "setGroupBan", [
            group_id,
            user_id,
            duration,
        ]);
    }

    /**
     * 群禁言匿名者
     * @param group_id {number} 群id
     * @param flag {string} 匿名者flag
     * @param duration {number} 禁言时长(单位：秒)
     */
    setGroupAnonymousBan(this: V12, group_id: string, flag: string, duration: number = 1800) {
        return this.adapter.call(this.oneBot.uin, "V12", "setGroupAnonymousBan", [
            group_id,
            flag,
            duration,
        ]);
    }

    /**
     * 群全体禁言
     * @param group_id {number} 群id
     * @param enable {boolean} 是否禁言
     */
    setGroupWholeBan(this: V12, group_id: string, enable?: boolean) {
        return this.adapter.call(this.oneBot.uin, "V12", "setGroupWholeBan", [group_id, enable]);
    }

    /**
     * 群匿名聊天
     * @param group_id {number} 群id
     * @param enable {boolean} 是否开启
     */
    setGroupAnonymous(this: V12, group_id: string, enable?: boolean) {
        return this.adapter.call(this.oneBot.uin, "V12", "setGroupAnonymous", [group_id, enable]);
    }

    /**
     * 设置群管
     * @param group_id {number} 群id
     * @param user_id {number} 成员id
     * @param enable {boolean} true 设为管理，false 取消管理
     */
    setGroupAdmin(this: V12, group_id: string, user_id: string, enable?: boolean) {
        return this.adapter.call(this.oneBot.uin, "V12", "setGroupAdmin", [
            group_id,
            user_id,
            enable,
        ]);
    }

    /**
     * 设置群成员名片(成员备注)
     * @param group_id {number} 群id
     * @param user_id {number} 成员id
     * @param card {string} 名片信息，不传或传空串则为 删除名片
     */
    setGroupCard(this: V12, group_id: string, user_id: string, card?: string) {
        return this.adapter.call(this.oneBot.uin, "V12", "setGroupCard", [group_id, user_id, card]);
    }

    /**
     * 设置群名
     * @param group_id {number} 群id
     * @param name {string} 新群名
     */
    setGroupName(this: V12, group_id: string, name: string) {
        return this.adapter.call(this.oneBot.uin, "V12", "setGroupName", [group_id, name]);
    }
    sendGroupPoke(this: V12, group_id: string, user_id: string) {
        return this.adapter.call(this.oneBot.uin, "V12", "sendGroupPoke", [group_id, user_id]);
    }
    /**
     * 退出指定群聊
     * @param group_id {number} 群id
     */
    leaveGroup(this: V12, group_id: string) {
        return this.adapter.call(this.oneBot.uin, "V12", "leaveGroup", [group_id]);
    }

    /**
     * 设置群成员头衔
     * @param group_id {number} 群id
     * @param user_id {number} 成员id
     * @param special_title {string} 头衔
     * @param duration {number} 持有时长 不传则永久
     */
    setGroupSpecialTitle(
        this: V12,
        group_id: string,
        user_id: string,
        special_title: string,
        duration: number = -1,
    ) {
        return this.adapter.call(this.oneBot.uin, "V12", "setGroupSpecialTitle", [
            group_id,
            user_id,
            special_title,
            duration,
        ]);
    }

    /**
     * 处理加群请求
     * @param flag {string} 加群flag
     * @param approve {boolean} 是否同意(默认：true)
     * @param reason {string} 拒绝理由，approve为false时有效(默认为空)
     * @param block {boolean} 拒绝时是否加入黑名单，(默认：false)
     */
    setGroupAddRequest(
        this: V12,
        flag: string,
        approve: boolean = true,
        reason: string = "",
        block: boolean = false,
    ) {
        return this.adapter.call(this.oneBot.uin, "V12", "setGroupAddRequest", [
            flag,
            approve,
            reason,
            block,
        ]);
    }

    /**
     * 获取群列表
     */
    async getGroupList(this: V12) {
        return this.adapter.call(this.oneBot.uin, "V12", "getGroupList");
    }

    /**
     * 获取指定群信息
     * @param group_id
     */
    getGroupInfo(this: V12, group_id: string) {
        return this.adapter.call(this.oneBot.uin, "V12", "getGroupInfo", [group_id]);
    }

    /**
     * 获取群成员列表
     * @param group_id
     */
    async getGroupMemberList(this: V12, group_id: string) {
        return this.adapter.call(this.oneBot.uin, "V12", "getGroupMemberList", [group_id]);
    }

    /**
     * 获取指定群成员信息
     * @param group_id
     * @param user_id
     */
    getGroupMemberInfo(this: V12, group_id: string, user_id: string) {
        return this.adapter.call(this.oneBot.uin, "V12", "getGroupMemberInfo", [group_id, user_id]);
    }

    /**
     * 设置群公告
     * @param group_id
     * @param content
     */
    sendGroupNotice(this: V12, group_id: string, content: string) {
        return this.adapter.call(this.oneBot.uin, "V12", "sendGroupNotice", [group_id, content]);
    }
}
