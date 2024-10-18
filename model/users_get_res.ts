export interface Users {
    phone: string;
    name: string;
    password: string;
    confirmPassword: string;
    address: string;
    photo?: string;
    lat: number;
    long: number;
  }

interface Product {
    productID: number; // Change the type if needed based on your schema
    userID: number;    // Add more fields as necessary
    userIDSender: number;
    orderID: number;
}

