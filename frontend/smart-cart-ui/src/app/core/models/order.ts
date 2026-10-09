export interface Order{
    id?:number;
    user_id:number;
    total_amount:number;
    order_status:string;
    order_date:string;
    created_at?:string;
    updated_at?:string;
}