export interface ChatMessage{
    id?:number;
    sender_id:number;
    receiver_id:number;
    message:string;
    is_read:boolean;
    created_at:Date;
}