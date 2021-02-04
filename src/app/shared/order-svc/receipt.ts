export default interface Receipt {
    itemCount: number;
    orderId: number;
    paymentType: string;
    shippingData: {
        salutation: string,
        firstName: string;
        lastName: string;
        streetName: string;
        streetNumber: number;
        postalCode: number;
        city: string;
    },
    total: number;
}