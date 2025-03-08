export class Cart {
    _id:string = '';
    products:any[] = [{
        quantity : 0,
        product_id:{
            _id:'',
            product_name: '',
        description: '',
        product_price: 0,
        product_stock: 0,
        image_url: [],
        size:'',
        category_id:'',
        discount_id:''
        }
    }];
    quantity:number = 0;
}
