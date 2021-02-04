
export default interface Order {
    shoppingCartId: string;
    billingAddress: {
        salutation: string;
        firstName: string;
        lastName: string;
        streetName: string;
        streetNumber: number;
        postalCode: number;
        city: string;
        email: string;
    };
    shippingData: {
        salutation: string;
        firstName: string;
        lastName: string;
        streetName: string;
        streetNumber: number;
        postalCode: number;
        city: string;
    };
    paymentData: {
        rechnungData: null | {};
        lastschriftData: null | {
            inhaber: string;
            iban: string;
        };
        paypalData: null | {
            email: string
        };
        kreditkartenData: null | {
            inhaber: string;
            nummer: string;
            cvcCode: string;
            gueltigBisMonat: string;
            gueltigBisJahr: string;
        }
    }
}