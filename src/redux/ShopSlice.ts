import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../hooks/useAxios";
import { RootState } from "./store";

interface Item {
  name: string;
  category: string;
  imgUrl: string;
  price: number;
  featured: boolean;
  description: string;
  totalRating: number;
  reviewCount: number;
}

interface MongoDBItem extends Item {
  _id: string;
}

interface LocalItem extends Item {
  id: string;
}

export interface CartItemProps {
  id: string;
  name: string;
  imgUrl: string;
  size: string;
  price: number;
  count: number;
}

interface Category {
  _id: string;
  name: string;
  imgUrl: string;
  description: string;
}

interface ItemState {
  itemsCount: number;
  items: LocalItem[];
  featuredItems: LocalItem[];
  cartItems: CartItemProps[];
  categories: Category[];
  loadingState: "idle" | "pending" | "succeeded" | "failed";
}

export interface FetchItemsThunkProps {
  limit?: number;
  page?: number;
  category?: string;
  nameQuery?: string;
}

// Function to change the _id to id
const changeIdKey = (inputArray: MongoDBItem[]): LocalItem[] =>
  inputArray.map(({ _id, ...rest }) => ({ id: _id, ...rest }));

// Async Thunks
export const fetchItems = createAsyncThunk(
  "items/fetchItems",
  async (fetchItemsProps: FetchItemsThunkProps) => {
    try {
      const res = await axiosInstance.get("/api/items", {
        // On the backend these queries below are received via req.query
        params: fetchItemsProps,
      });
      if (res.status === 200) {
        const arr = changeIdKey(res.data.result);

        return { itemsCount: res.data.itemsCount, result: arr };
      }
    } catch (err) {
      console.error(err);
    }
  }
);

export const fetchFeaturedItems = createAsyncThunk(
  "items/fetchFeaturedItems",
  async () => {
    try {
      const res = await axiosInstance.get("/api/items/featured");
      if (res.status === 200) {
        return changeIdKey(res.data.result);
      }
    } catch (err) {
      console.error(err);
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    try {
      const res = await axiosInstance.get("/api/categories");
      if (res.status === 200) {
        return res.data.result;
      }
    } catch (err) {
      console.error(err);
    }
  }
);

const initialState: ItemState = {
  itemsCount: 0,
  items: [],
  featuredItems: [],
  cartItems: [],
  categories: [],
  loadingState: "idle",
};

// Slices
const ShopSlice = createSlice({
  name: "shop-slice",
  initialState,
  reducers: {
    addCartItem(state, action) {
      const { id, size } = action.payload;
      if (
        state.cartItems.some((item) => item.id === id && item.size === size)
      ) {
        state.cartItems.forEach((item) => {
          if (item.id === id && item.size === size) {
            item.count++;
          }
        });
      } else {
        state.cartItems.push({ ...action.payload, count: 1 });
      }
    },

    updateCartItemCount(state, action) {
      const { id, size, count } = action.payload;
      state.cartItems.forEach((item) => {
        if (item.id === id && item.size === size) {
          item.count = count;
        }
      });
    },

    removeCartItem(state, action) {
      const { id, size } = action.payload;
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== id || item.size !== size
      );
    },

    clearCartItems(state) {
      state.cartItems = [];
    },
  },

  extraReducers(builder) {
    builder.addCase(fetchItems.fulfilled, (state, action) => {
      state.loadingState = "succeeded";
      state.itemsCount = action.payload?.itemsCount;
      state.items = action.payload!.result;
    });

    builder.addCase(fetchItems.pending, (state, action) => {
      state.loadingState = "pending";
    });

    builder.addCase(fetchFeaturedItems.fulfilled, (state, action) => {
      state.loadingState = "succeeded";
      state.featuredItems = action.payload!;
    });

    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.loadingState = "succeeded";
      state.categories = action.payload!;
    });
  },
});

export const {
  addCartItem,
  updateCartItemCount,
  removeCartItem,
  clearCartItems,
} = ShopSlice.actions;

export const getItems = (state: RootState) => state.shop.items;
export const getItemsCount = (state: RootState) => state.shop.itemsCount;
export const getLoadingState = (state: RootState) => state.shop.loadingState;
export const getFeaturedItems = (state: RootState) => state.shop.featuredItems;
export const getCartItems = (state: RootState) => state.shop.cartItems;
export const getCartItemsAmount = (state: RootState) =>
  state.shop.cartItems.reduce(
    (total, item) => total + item.price * item.count,
    0
  );
export const getCategories = (state: RootState) => state.shop.categories;
// export const getItemDetail = (state: RootState, id: string) =>
//   state.shop.items.find((item) => item.id === id);

export default ShopSlice.reducer;
