import {V12} from "../index";
import {Sendable} from "oicq";
import {remove} from "@/utils";

export class GroupAction{
    /**
     * 发送群聊消息
     * @param group_id {number} 群id
     * @param message {import('oicq').Sendable} 消息
     * @param message_id {string} 引用的消息ID
     */
    async sendGroupMsg(this:V12,group_id:number,message:V12.SegmentElem[],message_id?:string){
        const forward =message.find(e=>e.type==='node') as V12.SegmentElem<'node'>
        if(forward) remove(message,forward)
        let quote=message.find(e=>e.type==='reply') as V12.SegmentElem<'reply'>
        if(quote)  remove(message,quote)
        const element=V12.fromSegment(message)
        if(forward) element.unshift(await this.client.makeForwardMsg(forward.data.message.map(segment=>{
            return {
                message:V12.fromSegment([segment]),
                user_id:forward.data.user_id,
                nickname:forward.data.user_name,
                time:forward.data.time
            }
        })))
        if(quote && !message_id) message_id=quote.data.message_id
        return await this.client.sendGroupMsg(group_id,element,message_id?await this.client.getMsg(message_id):undefined)
    }

    /**
     * 群组踢人
     * @param group_id {number} 群id
     * @param user_id {number} 成员id
     * @param reject_add_request {boolean} 是否禁止此人加群请求
     */
    setGroupKick(this:V12,group_id:number,user_id:number,reject_add_request?:boolean){
        return this.client.setGroupKick(group_id,user_id,reject_add_request)
    }

    /**
     * 群禁言指定人
     * @param group_id {number} 群id
     * @param user_id {number} 成员id
     * @param duration {number} 禁言时长(单位：秒)
     */
    setGroupBan(this:V12,group_id:number,user_id:number,duration:number=1800){
        return this.client.setGroupBan(group_id,user_id,duration)
    }

    /**
     * 群禁言匿名者
     * @param group_id {number} 群id
     * @param flag {string} 匿名者flag
     * @param duration {number} 禁言时长(单位：秒)
     */
    setGroupAnonymousBan(this:V12,group_id:number,flag:string,duration:number=1800){
        return this.client.setGroupAnonymousBan(group_id,flag,duration)
    }

    /**
     * 群全体禁言
     * @param group_id {number} 群id
     * @param enable {boolean} 是否禁言
     */
    setGroupWholeBan(this:V12,group_id:number,enable?:boolean){
        return this.client.setGroupWholeBan(group_id,enable)
    }

    /**
     * 群匿名聊天
     * @param group_id {number} 群id
     * @param enable {boolean} 是否开启
     */
    setGroupAnonymous(this:V12,group_id:number,enable?:boolean){
        return this.client.setGroupAnonymous(group_id,enable)
    }

    /**
     * 设置群管
     * @param group_id {number} 群id
     * @param user_id {number} 成员id
     * @param enable {boolean} true 设为管理，false 取消管理
     */
    setGroupAdmin(this:V12,group_id:number,user_id:number,enable?:boolean){
        return this.client.setGroupAdmin(group_id,user_id,enable)
    }

    /**
     * 设置群成员名片(成员备注)
     * @param group_id {number} 群id
     * @param user_id {number} 成员id
     * @param card {string} 名片信息，不传或传空串则为 删除名片
     */
    setGroupCard(this:V12,group_id:number,user_id:number,card?:string){
        return this.client.setGroupCard(group_id,user_id,card)
    }

    /**
     * 设置群名
     * @param group_id {number} 群id
     * @param name {string} 新群名
     */
    setGroupName(this:V12,group_id:number,name:string){
        return this.client.setGroupName(group_id,name)
    }

    /**
     * 退出指定群聊
     * @param group_id {number} 群id
     */
    leaveGroup(this:V12,group_id:number){
        return this.client.setGroupLeave(group_id)
    }

    /**
     * 设置群成员头衔
     * @param group_id {number} 群id
     * @param user_id {number} 成员id
     * @param special_title {string} 头衔
     * @param duration {number} 持有时长 不传则永久
     */
    setGroupSpecialTitle(this:V12,group_id:number,user_id:number,special_title:string,duration:number=-1){
        return this.client.setGroupSpecialTitle(group_id,user_id,special_title,duration)
    }

    /**
     * 处理加群请求
     * @param flag {string} 加群flag
     * @param approve {boolean} 是否同意(默认：true)
     * @param reason {string} 拒绝理由，approve为false时有效(默认为空)
     * @param block {boolean} 拒绝时是否加入黑名单，(默认：false)
     */
    setGroupAddRequest(this:V12,flag:string,approve:boolean=true,reason:string='',block:boolean=false){
        return this.client.setGroupAddRequest(flag,approve,reason,block)
    }

    /**
     * 获取群列表
     */
    async getGroupList(this:V12){
        return this.client.getGroupList()
    }

    /**
     * 获取指定群信息
     * @param group_id
     */
    getGroupInfo(this:V12,group_id:number){
        return this.client.getGroupInfo(group_id)
    }

    /**
     * 获取群成员列表
     * @param group_id
     */
    async getGroupMemberList(this:V12,group_id:number){
        return this.client.getGroupMemberList(group_id)
    }

    /**
     * 获取指定群成员信息
     * @param group_id
     * @param user_id
     */
    getGroupMemberInfo(this:V12,group_id:number,user_id:number){
        return this.client.getGroupMemberInfo(group_id,user_id)
    }
}
