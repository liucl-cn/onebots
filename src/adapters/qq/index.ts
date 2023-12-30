import { Adapter } from "@/adapter";
import { App } from "@/server/app";
import { OneBot, OneBotStatus } from "@/onebot";
import { Bot, Sendable } from "qq-group-bot";
import * as path from "path";

export default class QQAdapter extends Adapter<'qq'>{
    constructor(app:App,config:QQAdapter.Config) {
        super(app,'qq',config);
        this.icon=`https://qzonestyle.gtimg.cn/qzone/qzact/act/external/tiqq/logo.png`
    }
    #disposes:Map<string,Function>=new Map<string, Function>()
    async startOneBot(oneBot:OneBot<Bot>){
        await this.setOnline(oneBot.uin)
        const selfInfo=await oneBot.internal.getSelfInfo()
        oneBot.avatar=selfInfo.avatar
        oneBot.nickname=selfInfo.username
        const pkg=require(path.resolve(path.dirname(require.resolve('qq-group-bot')),'../package.json'))
        oneBot.dependency=`qq-group-bot v${pkg.version}`
        const disposeArr:Function[]=[]
        const clean=()=>{
            while (disposeArr.length>0){
                disposeArr.pop()()
            }
            oneBot.internal.stop()
        }
        const messageHandler=(event)=>{
            this.emit('message.receive',oneBot.uin,event)
        }
        oneBot.internal.on('message',messageHandler)
        disposeArr.push(()=>{
            oneBot.internal!.off('message',messageHandler)
        })
        return clean
    }
    async setOnline(uin: string) {
        const oneBot=this.getOneBot<Bot>(uin)
        await oneBot?.internal.start()
        oneBot.status=OneBotStatus.Good
    }
    async setOffline(uin: string) {
        const oneBot=this.getOneBot<Bot>(uin)
        await oneBot?.internal.stop()
        oneBot.status=OneBotStatus.Bad
    }
    createOneBot(uin: string, protocol: Bot.Config, versions: OneBot.Config[]): OneBot {
        const oneBot = super.createOneBot<Bot>(uin, protocol, versions);
        oneBot.internal = new Bot({
            appid:oneBot.uin,
            logLevel:this.app.config.log_level,
            ...protocol
        })
        oneBot.status=OneBotStatus.Online
        return oneBot
    }
    call(uin:string,version:string,method:string,args?:any[]):Promise<any>{
        const oneBot=this.oneBots.get(uin)
        if(!oneBot){
            throw new Error(`未找到账号${uin}`)
        }
        if(typeof this[method]==='function') return this[method](uin,version,args)
        if(typeof oneBot.internal[method]!=='function') throw OneBot.UnsupportedMethodError
        try{
            return oneBot.internal[method](...(args||[]))
        }catch (e){
            throw new Error(`call internal method error:${e.message}`)
        }
    }
    fromSegment<V extends OneBot.Version>(version: V, segment: OneBot.Segment<V>|OneBot.Segment<V>[]): OneBot.MessageElement<V>[] {
        return [].concat(segment).map(item=>{
            if(typeof item==="string") return {
                type:'text',
                data:{
                    text:item
                }
            }
            return item
        })
    }
    toSegment<V extends OneBot.Version,M=Sendable>(version: V, message: M): OneBot.Segment<V>[] {
        return [].concat(message).map(item=>{
            if(!item || typeof item!=="object") return {
                type:'text',
                data:{
                    text:item
                }
            }
            const {type,data,...other}=item
            return {
                type,
                data:{
                    ...data,
                    ...other
                }
            }
        })
    }

    fromCqcode<V extends OneBot.Version>(version: V, message: string): OneBot.MessageElement<V>[] {
        const regExpMatchArray=message.match(/\[CQ:([a-z]+),(!])+]/g)
        if(!regExpMatchArray) return [
            {
                type:'text',
                data:{
                    text:message
                }
            }
        ]
        const result:OneBot.MessageElement<V>[]=[]
        for(const match of regExpMatchArray){
            const [type,...valueArr]=match.substring(1,match.length-1).split(',')
            result.push({
                type:type,
                data:Object.fromEntries(valueArr.map(item=>{
                    const [key,value]=item.split('=')
                    return [key,value]
                }))
            })
        }
        return result
    }

    toCqcode<V extends OneBot.Version>(version: V, messageArr:OneBot.MessageElement<V>[]): string {
        return [].concat(messageArr).map(item=>{
            const dataStr=Object.entries(item.data).map(([key,value])=>{
                // is Buffer
                if(value instanceof Buffer) return `${key}=${value.toString('base64')}`
                // is Object
                if(value instanceof Object) return `${key}=${JSON.stringify(value)}`
                // is Array
                if(value instanceof Array) return `${key}=${value.map(v=>JSON.stringify(v)).join(',')}`
                // is String
                return `${key}=${item[key]}`
            })
            return `[CQ:${item.type},${dataStr.join(',')}]`
        }).join('')
    }
    formatEventPayload<V extends OneBot.Version>(version:V,event:string,data:any):OneBot.Payload<V>{
        const result= {
            id: data.id,
            [version==='V12'?'type':'post_type']: event,
            version: version,
            self:{
                platform:'qq',
                user_id: data.self_id
            },
            detail_type: data.message_type||data.notice_type||data.request_type,
            platform: 'qq',
            time:data.timestamp,
            ...data,
        }
        delete result.bot
        return result
    }
    async start(uin:string){
        const startOneBots=[...this.oneBots.values()].filter(oneBot=>{
            return uin?oneBot.uin===uin:true
        })
        for(const oneBot of startOneBots){
            this.#disposes.set(oneBot.uin,await this.startOneBot(oneBot))
        }
        const {protocol}=this.config

        await super.start()
    }
    async stop(uin?:string){
        const stopOneBots=[...this.oneBots.values()].filter(oneBot=>{
            return uin?oneBot.uin===uin:true
        })
        for(const oneBot of stopOneBots){
            const dispose=this.#disposes.get(oneBot.uin)
            if(dispose){
                dispose()
            }
        }
        await super.stop()
    }
    getSelfInfo<V extends OneBot.Version>(uin: string, version: V): OneBot.SelfInfo<V> {
        const oneBot=this.oneBots.get(uin)
        return {
            nickname: oneBot?.internal?.nickname,
            status: OneBotStatus.Online,
        } as OneBot.SelfInfo<V>;
    }
}
declare module '@/adapter'{
    export namespace Adapter{
        export interface Configs{
            qq: QQAdapter.Config
        }
    }
}
export namespace QQAdapter{
    export interface Config extends Adapter.Config<'qq'>{
        protocol:Omit<Bot.Config, 'appid'>
    }
}