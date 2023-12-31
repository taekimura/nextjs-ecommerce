export type ProductPayload = {
  name: string;
  description: string;
  price: string;
  category: string;
  countInStock: string;
  images: string[] | undefined;
};

export type Product = {
  _id: string;
  features: string[];
  rating: number;
  createdBy: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
  name: string;
  description: string;
  price: number;
  category: string;
  countInStock: number;
  images: string[];
  quantity: number;
};

export type Category = {
  _id: string;
  name: string;
  description: string;
  createdBy: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type CategoryPayload = {
  name: string;
  description: string;
};
